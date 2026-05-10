import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createPremiumCookieValue,
  PREMIUM_COOKIE_NAME
} from "../../../lib/premiumCookie";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const cookieSecret = process.env.ACCESS_COOKIE_SECRET;

  if (!stripeSecret || !cookieSecret) {
    console.error(
      "[checkout/complete] Missing STRIPE_SECRET_KEY or ACCESS_COOKIE_SECRET"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20"
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session?.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    let expUnix =
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

    if (session.mode === "subscription" && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription);
      if (sub?.current_period_end) {
        expUnix = sub.current_period_end;
      }
    }

    const token = createPremiumCookieValue(
      cookieSecret,
      expUnix,
      session.id
    );

    const maxAge = Math.max(0, expUnix - Math.floor(Date.now() / 1000));

    const res = NextResponse.redirect(new URL("/calculator", request.url));
    res.cookies.set(PREMIUM_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge
    });

    return res;
  } catch (err) {
    console.error("[checkout/complete] Stripe error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
