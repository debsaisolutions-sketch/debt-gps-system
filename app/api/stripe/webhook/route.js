import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  planIntervalFromSubscription,
  provisionPaidDgpsProfile,
  upsertDgpsSubscriptionState
} from "../../../lib/dgpsProfile";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function customerIdFrom(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id || null;
}

function subscriptionEmail(subscription, fallback) {
  return (
    fallback ||
    subscription?.metadata?.email ||
    null
  );
}

/**
 * @param {import('stripe').Stripe} stripe
 * @param {import('stripe').Stripe.Subscription} subscription
 * @param {string | null} email
 */
async function syncSubscription(stripe, subscription, email) {
  const stripeCustomerId = customerIdFrom(subscription.customer);
  let resolvedEmail = subscriptionEmail(subscription, email);

  if (!resolvedEmail && stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      if (!customer.deleted) resolvedEmail = customer.email || null;
    } catch (err) {
      console.warn("[stripe/webhook] customer retrieve failed", err.message);
    }
  }

  const patch = {
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    planInterval: planIntervalFromSubscription(subscription),
    currentPeriodEndUnix: subscription.current_period_end || null
  };

  const profile = resolvedEmail
    ? await provisionPaidDgpsProfile({ email: resolvedEmail, ...patch })
    : await upsertDgpsSubscriptionState({
        userId: subscription.metadata?.supabase_user_id || undefined,
        email: resolvedEmail,
        ...patch
      });

  const userId = profile?.user_id;
  if (userId && subscription.metadata?.supabase_user_id !== userId) {
    try {
      await stripe.subscriptions.update(subscription.id, {
        metadata: {
          ...(subscription.metadata || {}),
          supabase_user_id: userId,
          app: "debt_gps",
          ...(resolvedEmail ? { email: resolvedEmail } : {})
        }
      });
    } catch (err) {
      console.warn("[stripe/webhook] metadata stamp failed", err.message);
    }
  }

  return profile;
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verify failed", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.email ||
          null;

        if (!email) {
          console.error(
            "[stripe/webhook] checkout.session.completed missing email",
            session.id
          );
          return NextResponse.json(
            { error: "Missing email on checkout session" },
            { status: 500 }
          );
        }

        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(stripe, subscription, email);
        } else {
          await provisionPaidDgpsProfile({
            email,
            stripeCustomerId: customerIdFrom(session.customer)
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await syncSubscription(
          stripe,
          subscription,
          subscription.metadata?.email || null
        );
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (!invoice.subscription) break;
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subId);
        const email =
          invoice.customer_email || subscription.metadata?.email || null;
        await syncSubscription(stripe, subscription, email);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error", event.type, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
