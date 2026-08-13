import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getDgpsProfileByEmail,
  isDgpsPremiumStatus
} from "../../../lib/dgpsProfile";
import { stampPremiumCookie } from "../../../lib/premiumCookie";

export const dynamic = "force-dynamic";

function siteOrigin(request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.nextUrl.origin ||
    "https://www.debtgpssystem.com"
  ).replace(/\/$/, "");
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const interval = body?.interval === "year" ? "year" : "month";
    const email = normalizeEmail(body?.email);

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Enter the email you used to subscribe so we can restore access or start checkout."
        },
        { status: 400 }
      );
    }

    const existing = await getDgpsProfileByEmail(email);
    if (existing && isDgpsPremiumStatus(existing.subscription_status)) {
      const origin = siteOrigin(request);
      const res = NextResponse.json({
        alreadyPaid: true,
        url: `${origin}/calculator`
      });
      stampPremiumCookie(
        res,
        process.env.ACCESS_COOKIE_SECRET,
        existing,
        existing.stripe_subscription_id || existing.user_id
      );
      return res;
    }

    const monthlyPrice =
      process.env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID;
    const yearlyPrice = process.env.STRIPE_PRICE_ID_YEARLY;
    const priceId = interval === "year" ? yearlyPrice : monthlyPrice;

    if (!priceId) {
      console.error(
        "[checkout/session] Missing STRIPE_PRICE_ID_MONTHLY/STRIPE_PRICE_ID or STRIPE_PRICE_ID_YEARLY"
      );
      return NextResponse.json(
        { error: "Checkout is not configured." },
        { status: 500 }
      );
    }

    if (interval === "year" && !yearlyPrice) {
      return NextResponse.json(
        {
          error: "Annual billing is not configured yet. Choose monthly for now."
        },
        { status: 400 }
      );
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });
    const origin = siteOrigin(request);
    const metadata = {
      app: "debt_gps",
      plan_interval: interval,
      email
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/calculator`,
      metadata,
      subscription_data: {
        metadata
      }
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (err) {
    console.error("[checkout/session]", err);
    return NextResponse.json(
      { error: err.message || "Could not start checkout." },
      { status: 500 }
    );
  }
}
