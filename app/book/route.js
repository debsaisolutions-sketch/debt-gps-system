import { NextResponse } from "next/server";
import { BOOKING_URL } from "../lib/bookingUrl";
import { requestHasCalculatorUnlock } from "../lib/calculatorUnlock";

export const dynamic = "force-dynamic";

function gateOrCalendar(request) {
  if (requestHasCalculatorUnlock(request)) {
    return NextResponse.redirect(BOOKING_URL, 307);
  }
  const dest = request.nextUrl.clone();
  dest.pathname = "/calculator";
  dest.search = "";
  dest.searchParams.set("booking", "1");
  return NextResponse.redirect(dest, 307);
}

export function GET(request) {
  return gateOrCalendar(request);
}

export function HEAD(request) {
  return gateOrCalendar(request);
}
