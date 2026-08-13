import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.debtgpssystem.com"
  ).replace(/\/$/, "");
}

/**
 * Send a magic-link email using implicit OTP (no PKCE).
 * createBrowserClient from @supabase/ssr hardcodes flowType: "pkce", which
 * prefixes TokenHash with "pkce_" and ties login to the requesting browser.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const nextRaw = String(body.next || "/set-password");
    const next = nextRaw.startsWith("/") ? nextRaw : "/set-password";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
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
        flowType: "implicit",
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const emailRedirectTo =
      next === "/set-password"
        ? `${siteOrigin()}/auth/callback/set-password`
        : `${siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo
      }
    });

    if (error) {
      console.error("[auth/magic-link] signInWithOtp failed", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("dgps_auth_next", next, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60
    });
    return res;
  } catch (err) {
    console.error("[auth/magic-link]", err);
    return NextResponse.json(
      { error: err.message || "Could not send login link." },
      { status: 500 }
    );
  }
}
