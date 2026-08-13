import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "../../../lib/supabase/server";
import { ensureDgpsProfile } from "../../../lib/dgpsProfile";

export const dynamic = "force-dynamic";

function siteOrigin(request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.nextUrl.origin ||
    "https://debtgpssystem.com"
  ).replace(/\/$/, "");
}

export async function POST(request) {
  try {
    const incomingAuthCookies = request.cookies
      .getAll()
      .filter((cookie) => /^(sb-|supabase)/i.test(cookie.name))
      .map((cookie) => ({
        name: cookie.name,
        valueLength: cookie.value ? String(cookie.value).length : 0
      }));
    console.log(
      "[checkout/session] incoming auth cookies",
      JSON.stringify(incomingAuthCookies)
    );

    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "login_required",
          message: "Please log in with your email magic link before checkout."
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const interval = body?.interval === "year" ? "year" : "month";

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

    const profile = await ensureDgpsProfile(user);
    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

    const { upsertDgpsSubscriptionState } = await import(
      "../../../lib/dgpsProfile"
    );

    let customerId = profile.stripe_customer_id || null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          supabase_user_id: user.id,
          app: "debt_gps"
        }
      });
      customerId = customer.id;
      await upsertDgpsSubscriptionState({
        userId: user.id,
        stripeCustomerId: customerId,
        email: user.email
      });
    }

    const origin = siteOrigin(request);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/calculator`,
      metadata: {
        supabase_user_id: user.id,
        app: "debt_gps",
        plan_interval: interval
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          app: "debt_gps",
          plan_interval: interval
        }
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
