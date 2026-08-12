import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createPremiumCookieValue,
  PREMIUM_COOKIE_NAME,
  verifyPremiumCookie
} from "../../lib/premiumCookie";
import {
  ensureDgpsProfile,
  isDgpsPremiumStatus
} from "../../lib/dgpsProfile";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieSecret = process.env.ACCESS_COOKIE_SECRET;
  let authenticated = false;
  let email = null;
  let premium = false;
  let subscriptionStatus = "none";
  let currentPeriodEnd = null;

  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      authenticated = true;
      email = user.email || null;
      const profile = await ensureDgpsProfile(user);
      subscriptionStatus = profile.subscription_status || "none";
      currentPeriodEnd = profile.current_period_end || null;
      premium = isDgpsPremiumStatus(profile.subscription_status);

      const res = NextResponse.json({
        premium,
        authenticated,
        email,
        subscriptionStatus,
        currentPeriodEnd
      });

      if (premium && cookieSecret) {
        const expUnix = profile.current_period_end
          ? Math.floor(new Date(profile.current_period_end).getTime() / 1000)
          : Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
        const maxAge = Math.max(0, expUnix - Math.floor(Date.now() / 1000));
        const token = createPremiumCookieValue(
          cookieSecret,
          expUnix,
          profile.stripe_subscription_id || profile.user_id
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
    }
  } catch (err) {
    console.warn("[access] auth/profile check failed", err.message);
  }

  // Legacy fallback: signed cookie from older checkout flow (no login yet).
  try {
    const raw = cookies().get(PREMIUM_COOKIE_NAME)?.value;
    premium = Boolean(cookieSecret && verifyPremiumCookie(cookieSecret, raw));
  } catch {
    premium = false;
  }

  return NextResponse.json({
    premium,
    authenticated,
    email,
    subscriptionStatus,
    currentPeriodEnd
  });
}
