/**
 * Comma-separated ADMIN_EMAILS. Empty means nobody is an admin.
 * Do not hardcode addresses here.
 */
export function adminEmailAllowlist() {
  return String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return false;
  return adminEmailAllowlist().includes(normalized);
}

/**
 * Same cron check as the daily and bulk article jobs:
 * Authorization: Bearer, x-cron-secret, or ?cron_secret=
 */
export function isCronAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !request) return false;

  const authHeader = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");
  let querySecret = "";
  try {
    querySecret = new URL(request.url).searchParams.get("cron_secret") || "";
  } catch {
    querySecret = "";
  }

  return (
    authHeader === `Bearer ${secret}` ||
    headerSecret === secret ||
    querySecret === secret
  );
}
