import { NextResponse } from "next/server";
import { bookLocation } from "../lib/bookingUrl";

export const dynamic = "force-dynamic";

function bookRedirect(request) {
  const response = new NextResponse(null, { status: 307 });
  response.headers.set("Location", bookLocation(request.url));
  return response;
}

export function GET(request) {
  return bookRedirect(request);
}

export function HEAD(request) {
  return bookRedirect(request);
}
