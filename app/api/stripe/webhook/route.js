import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  ensureDgpsProfile,
  planIntervalFromSubscription,
  upsertDgpsSubscriptionState
} from "../../../lib/dgpsProfile";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

/**
 * @param {import('stripe').Stripe.Subscription} subscription
 * @param {string | null} userId
 * @param {string | null} email
 */
async function syncSubscription(subscription, userId, email) {
  return upsertDgpsSubscriptionState({
    userId: userId || undefined,
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    planInterval: planIntervalFromSubscription(subscription),
    currentPeriodEndUnix: subscription.current_period_end || null,
    email: email || null
  });
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
        const userId =
          session.client_reference_id ||
          session.metadata?.supabase_user_id ||
          null;
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.email ||
          null;

        if (userId) {
          await ensureDgpsProfile({ id: userId, email });
        }

        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(subscription, userId, email);
        } else if (userId && session.customer) {
          await upsertDgpsSubscriptionState({
            userId,
            stripeCustomerId:
              typeof session.customer === "string"
                ? session.customer
                : session.customer.id,
            email
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.supabase_user_id || null;
        await syncSubscription(subscription, userId, null);
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
        const userId = subscription.metadata?.supabase_user_id || null;
        await syncSubscription(subscription, userId, invoice.customer_email);
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
