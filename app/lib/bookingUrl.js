/** In-app paid checkout section on the calculator. */
export const PAYOFF_PLAN_PATH = "/calculator#pricing";

/**
 * Suspended Agent CRM booking widget. Recognized only so chat text can
 * strip it. Never use this as a link destination.
 */
export const LEGACY_AGENT_CRM_BOOKING_URL =
  "https://link.agent-crm.com/widget/booking/3g7EgtS4IewV5fuPcKO8";

/**
 * Optional future GOALL partner calendar. Empty unless the env var is set
 * to an http(s) URL, so the link stays hidden by default.
 */
export function goallCalendarUrl() {
  const value = String(process.env.NEXT_PUBLIC_GOALL_CALENDAR_URL || "").trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

/** /book target: partner calendar when configured, otherwise calculator pricing. */
export function bookRedirectTarget() {
  return goallCalendarUrl() || PAYOFF_PLAN_PATH;
}

/** Absolute Location value, including a hash when the target is in-app. */
export function bookLocation(requestUrl) {
  const target = bookRedirectTarget();
  if (/^https?:\/\//i.test(target)) return target;
  return new URL(target, requestUrl).toString();
}
