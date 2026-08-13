import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ensureDgpsProfile,
  isDgpsPremiumStatus
} from "../../../lib/dgpsProfile";
import { stampPremiumCookie } from "../../../lib/premiumCookie";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "Enter your password." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://egyruxwhldsmxhiqcekl.supabase.co";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "sb_publishable_9AsiDMx2RM8e657vv0w0lg__glnZ3hv";

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data?.user) {
      const msg = String(error?.message || "");
      const noPassword = /invalid login credentials/i.test(msg);
      return NextResponse.json(
        {
          error: noPassword
            ? "That email/password did not match. If you have not set a password yet, use the login link below, then set one."
            : msg || "Could not log in."
        },
        { status: 401 }
      );
    }

    const profile = await ensureDgpsProfile(data.user);
    const premium = isDgpsPremiumStatus(profile.subscription_status);
    const res = NextResponse.json({
      ok: true,
      premium,
      email: data.user.email || email
    });

    if (premium) {
      stampPremiumCookie(
        res,
        process.env.ACCESS_COOKIE_SECRET,
        profile,
        profile.stripe_subscription_id || profile.user_id
      );
    }

    return res;
  } catch (err) {
    console.error("[auth/password]", err);
    return NextResponse.json(
      { error: err.message || "Could not log in." },
      { status: 500 }
    );
  }
}
