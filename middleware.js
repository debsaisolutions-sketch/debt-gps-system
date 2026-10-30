import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { isAdminEmail, isCronAuthorized } from "./app/lib/adminAccess";
import { bookLocation } from "./app/lib/bookingUrl";
import { SSR_COOKIE_ENCODE } from "./app/lib/supabase/ssrCookies";

function redirectWithLocation(location, status = 307) {
  const response = new NextResponse(null, { status });
  response.headers.set("Location", location);
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/book") {
    return redirectWithLocation(bookLocation(request.url));
  }

  if (pathname === "/learn/generate") {
    request.headers.set("x-dgps-request-url", request.url);
  }

  let pendingCookies = [];
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://egyruxwhldsmxhiqcekl.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_9AsiDMx2RM8e657vv0w0lg__glnZ3hv";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      encode: SSR_COOKIE_ENCODE,
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies = cookiesToSet;
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: {
            headers: request.headers
          }
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  if (pathname === "/learn/generate" && !isCronAuthorized(request)) {
    if (!isAdminEmail(user?.email)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.hash = "";
      const redirectResponse = redirectWithLocation(loginUrl.toString());
      pendingCookies.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options);
      });
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/calculator",
    "/checkout/:path*",
    "/api/access",
    "/book",
    "/learn/generate"
  ]
};
