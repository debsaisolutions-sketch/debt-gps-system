import crypto from "crypto";

export const PREMIUM_COOKIE_NAME = "debtgps_premium";

/**
 * @param {string} secret
 * @param {number} expUnix seconds since epoch
 * @param {string} checkoutSessionId Stripe Checkout Session id (audit / uniqueness)
 */
export function createPremiumCookieValue(secret, expUnix, checkoutSessionId) {
  const payload = JSON.stringify({
    v: 1,
    exp: expUnix,
    cs: checkoutSessionId
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sigHex = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payloadB64}.${sigHex}`;
}

/**
 * @param {string} secret
 * @param {string | undefined} cookieValue
 * @returns {boolean}
 */
export function verifyPremiumCookie(secret, cookieValue) {
  if (!secret || typeof cookieValue !== "string") return false;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = cookieValue.slice(0, dot);
  const sigHex = cookieValue.slice(dot + 1);
  let payloadStr;
  try {
    payloadStr = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("hex");
  try {
    const a = Buffer.from(sigHex, "hex");
    const b = Buffer.from(expectedHex, "hex");
    if (a.length !== b.length) return false;
    if (!crypto.timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const data = JSON.parse(payloadStr);
    if (data.v !== 1 || typeof data.exp !== "number") return false;
    if (data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}
