import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createPremiumCookieValue,
  PREMIUM_COOKIE_NAME
} from "../../../lib/premiumCookie";
import {
  ensureDgpsProfile,
  isDgpsPremiumStatus,
  planIntervalFromSubscription,
  upsertDgpsSubscriptionState
} from "../../../lib/dgpsProfile";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/calculator", request.url));
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const cookieSecret = process.env.ACCESS_COOKIE_SECRET;

  if (!stripeSecret) {
    console.error("[checkout/complete] Missing STRIPE_SECRET_KEY");
    return NextResponse.redirect(new URL("/calculator", request.url));
  }

  try {
    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20"
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session?.payment_status !== "paid" && session?.status !== "complete") {
      return NextResponse.redirect(new URL("/calculator", request.url));
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const userId =
      session.client_reference_id ||
      session.metadata?.supabase_user_id ||
      user?.id ||
      null;

    const email =
      user?.email ||
      session.customer_details?.email ||
      session.customer_email ||
      null;

    let profile = null;

    if (userId) {
      await ensureDgpsProfile({ id: userId, email });

      if (session.mode === "subscription" && session.subscription) {
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subId);
        profile = await upsertDgpsSubscriptionState({
          userId,
          stripeCustomerId:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          planInterval: planIntervalFromSubscription(subscription),
          currentPeriodEndUnix: subscription.current_period_end || null,
          email
        });
      }
    }

    let expUnix =
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

    if (profile?.current_period_end) {
      expUnix = Math.floor(
        new Date(profile.current_period_end).getTime() / 1000
      );
    } else if (session.mode === "subscription" && session.subscription) {
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const sub = await stripe.subscriptions.retrieve(subId);
      if (sub?.current_period_end) expUnix = sub.current_period_end;
    }

    const res = NextResponse.redirect(new URL("/calculator", request.url));

    const shouldSetCookie =
      cookieSecret &&
      (isDgpsPremiumStatus(profile?.subscription_status) ||
        session.payment_status === "paid");

    if (shouldSetCookie) {
      const maxAge = Math.max(0, expUnix - Math.floor(Date.now() / 1000));
      const token = createPremiumCookieValue(
        cookieSecret,
        expUnix,
        session.id
      );
      res.cookies.set(PREMIUM_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge
      });
    }

    return res;
  } catch (err) {
    console.error("[checkout/complete] Stripe error:", err);
    return NextResponse.redirect(new URL("/calculator", request.url));
  }
}
