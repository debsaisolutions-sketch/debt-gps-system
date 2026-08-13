import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  ensureDgpsProfile,
  isDgpsPremiumStatus
} from "../../lib/dgpsProfile";
import {
  createPremiumCookieValue,
  PREMIUM_COOKIE_NAME
} from "../../lib/premiumCookie";
import { SSR_COOKIE_ENCODE } from "../../lib/supabase/ssrCookies";

export const dynamic = "force-dynamic";

const EMAIL_OTP_TYPES = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email"
]);

function cookieMeta(cookie) {
  const options = cookie.options || {};
  return {
    name: cookie.name,
    valueLength: cookie.value ? String(cookie.value).length : 0,
    domain: options.domain ?? null,
    path: options.path ?? null,
    secure: options.secure ?? null,
    sameSite: options.sameSite ?? null,
    httpOnly: options.httpOnly ?? null,
    maxAge: options.maxAge ?? null
  };
}

function createCallbackClient(request, response) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://egyruxwhldsmxhiqcekl.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_9AsiDMx2RM8e657vv0w0lg__glnZ3hv";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      encode: SSR_COOKIE_ENCODE,
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        console.log(
          "[auth/callback] setAll cookies",
          JSON.stringify(cookiesToSet.map(cookieMeta))
        );
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            path: options?.path || "/",
            sameSite: options?.sameSite || "lax",
            secure: true
          });
        });
      }
    }
  });
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/calculator";
  const safeNext = next.startsWith("/") ? next : "/calculator";
  const otpType = EMAIL_OTP_TYPES.has(typeParam) ? typeParam : "magiclink";

  if (!tokenHash && !code) {
    return NextResponse.redirect(`${origin}/calculator`);
  }

  const redirectResponse = NextResponse.redirect(`${origin}${safeNext}`);
  const supabase = createCallbackClient(request, redirectResponse);

  let data;
  let error;

  if (tokenHash) {
    ({ data, error } = await supabase.auth.verifyOtp({
      type: otpType,
      token_hash: tokenHash
    }));
    if (error) {
      console.error("[auth/callback] verifyOtp failed", error.message);
    }
  } else {
    ({ data, error } = await supabase.auth.exchangeCodeForSession(code));
    if (error) {
      console.error("[auth/callback] exchange failed", error.message);
    }
  }

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=1`);
  }

  if (data?.user) {
    let profile = null;
    try {
      profile = await ensureDgpsProfile(data.user);
    } catch (err) {
      console.warn("[auth/callback] ensure profile failed", err.message);
    }

    const cookieSecret = process.env.ACCESS_COOKIE_SECRET;
    if (
      profile &&
      cookieSecret &&
      isDgpsPremiumStatus(profile.subscription_status)
    ) {
      const expUnix = profile.current_period_end
        ? Math.floor(new Date(profile.current_period_end).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
      const maxAge = Math.max(0, expUnix - Math.floor(Date.now() / 1000));
      redirectResponse.cookies.set(
        PREMIUM_COOKIE_NAME,
        createPremiumCookieValue(
          cookieSecret,
          expUnix,
          profile.stripe_subscription_id || profile.user_id
        ),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge
        }
      );
    }
  }

  const expireVerifier = {
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 0
  };
  request.cookies.getAll().forEach((cookie) => {
    if (String(cookie.name).includes("code-verifier")) {
      redirectResponse.cookies.set(cookie.name, "", expireVerifier);
    }
  });

  const outgoing = redirectResponse.cookies.getAll().map((cookie) => ({
    name: cookie.name,
    valueLength: cookie.value ? String(cookie.value).length : 0
  }));
  console.log(
    "[auth/callback] redirect Set-Cookie names",
    JSON.stringify({
      origin,
      location: `${origin}${safeNext}`,
      cookies: outgoing
    })
  );

  return redirectResponse;
}
