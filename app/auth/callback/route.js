import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  ensureDgpsProfile
} from "../../lib/dgpsProfile";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/calculator";
  const safeNext = next.startsWith("/") ? next : "/calculator";

  if (!code) {
    return NextResponse.redirect(`${origin}/calculator`);
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://egyruxwhldsmxhiqcekl.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_9AsiDMx2RM8e657vv0w0lg__glnZ3hv";

  const redirectResponse = NextResponse.redirect(`${origin}${safeNext}`);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        redirectResponse.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        redirectResponse.cookies.set({ name, value: "", ...options });
      }
    }
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange failed", error.message);
    return NextResponse.redirect(`${origin}/calculator?auth=error`);
  }

  if (data?.user) {
    try {
      await ensureDgpsProfile(data.user);
    } catch (err) {
      console.warn("[auth/callback] ensure profile failed", err.message);
    }
  }

  return redirectResponse;
}
