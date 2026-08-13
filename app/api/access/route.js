import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PREMIUM_COOKIE_NAME,
  parsePremiumCookie,
  stampPremiumCookie,
  clearPremiumCookie
} from "../../lib/premiumCookie";
import {
  ensureDgpsProfile,
  getDgpsProfile,
  isDgpsPremiumStatus
} from "../../lib/dgpsProfile";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

function jsonAccess(body, cookieSecret, profile, expireCookie) {
  const res = NextResponse.json(body);
  if (expireCookie) {
    clearPremiumCookie(res);
  } else if (body.premium && cookieSecret && profile?.user_id) {
    stampPremiumCookie(res, cookieSecret, profile);
  }
  return res;
}

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

      return jsonAccess(
        {
          premium,
          authenticated,
          email,
          subscriptionStatus,
          currentPeriodEnd
        },
        cookieSecret,
        profile,
        !premium
      );
    }
  } catch (err) {
    console.warn("[access] auth/profile check failed", err.message);
  }

  const raw = cookies().get(PREMIUM_COOKIE_NAME)?.value;
  const parsed = cookieSecret ? parsePremiumCookie(cookieSecret, raw) : null;

  if (!parsed) {
    return NextResponse.json({
      premium: false,
      authenticated,
      email,
      subscriptionStatus,
      currentPeriodEnd
    });
  }

  // v2: live dgps_profiles check. v1 (no uid): signed expiry only.
  if (parsed.uid) {
    try {
      const profile = await getDgpsProfile(parsed.uid);
      if (!profile) {
        const res = NextResponse.json({
          premium: false,
          authenticated,
          email: parsed.email || null,
          subscriptionStatus: "none",
          currentPeriodEnd: null
        });
        clearPremiumCookie(res);
        return res;
      }

      email = profile.email || parsed.email || null;
      subscriptionStatus = profile.subscription_status || "none";
      currentPeriodEnd = profile.current_period_end || null;
      premium = isDgpsPremiumStatus(profile.subscription_status);

      return jsonAccess(
        {
          premium,
          authenticated,
          email,
          subscriptionStatus,
          currentPeriodEnd
        },
        cookieSecret,
        profile,
        !premium
      );
    } catch (err) {
      console.warn("[access] cookie profile lookup failed", err.message);
      return NextResponse.json({
        premium: true,
        authenticated,
        email: parsed.email || null,
        subscriptionStatus,
        currentPeriodEnd
      });
    }
  }

  return NextResponse.json({
    premium: true,
    authenticated,
    email,
    subscriptionStatus,
    currentPeriodEnd
  });
}
