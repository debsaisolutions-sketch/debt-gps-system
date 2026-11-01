import { timingSafeEqual } from "crypto";

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * CRON_SECRET via header only (Authorization: Bearer, or x-cron-secret).
 * Query-string secrets are ignored on purpose.
 * @param {{ get(name: string): string | null }} headers
 */
export function isCronHeaderAuthorized(headers) {
  const secret = String(process.env.CRON_SECRET || "");
  if (!secret) return false;
  const authorization = headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const headerSecret = headers.get("x-cron-secret") || "";
  return safeEqual(bearer, secret) || safeEqual(headerSecret, secret);
}

export function adminEmails() {
  return String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return false;
  return adminEmails().includes(normalized);
}

/**
 * @param {{ get(name: string): string | null }} headers
 * @param {() => Promise<{ email?: string | null } | null>} getUser
 * @returns {Promise<{ ok: true, via: "cron" | "admin" } | { ok: false, status: 401 | 403 }>}
 */
export async function authorizeArticleGenerator(headers, getUser) {
  if (isCronHeaderAuthorized(headers)) {
    return { ok: true, via: "cron" };
  }

  let user = null;
  try {
    user = await getUser();
  } catch {
    user = null;
  }

  if (!user) {
    return { ok: false, status: 401 };
  }

  if (!isAdminEmail(user.email)) {
    return { ok: false, status: 403 };
  }

  return { ok: true, via: "admin" };
}
