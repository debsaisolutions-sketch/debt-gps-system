import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PREMIUM_COOKIE_NAME, verifyPremiumCookie } from "../../lib/premiumCookie";

export const dynamic = "force-dynamic";

export async function GET() {
  const secret = process.env.ACCESS_COOKIE_SECRET;
  const cookieStore = cookies();
  const raw = cookieStore.get(PREMIUM_COOKIE_NAME)?.value;

  const premium = Boolean(secret && verifyPremiumCookie(secret, raw));

  return NextResponse.json({ premium });
}
