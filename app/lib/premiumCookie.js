import crypto from "crypto";

export const PREMIUM_COOKIE_NAME = "debtgps_premium";

function cookieBaseOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  };
}

/**
 * @param {object} args
 * @param {number} args.expUnix
 * @param {string} [args.checkoutSessionId]
 * @param {string} [args.userId] v2 — enables live dgps_profiles checks
 * @param {string} [args.email]
 */
export function createPremiumCookieValue(secret, args) {
  const expUnix = args.expUnix;
  const userId = args.userId ? String(args.userId) : "";
  const payload = userId
    ? {
        v: 2,
        exp: expUnix,
        cs: args.checkoutSessionId || "",
        uid: userId,
        email: args.email ? String(args.email).trim().toLowerCase() : ""
      }
    : {
        v: 1,
        exp: expUnix,
        cs: args.checkoutSessionId || ""
      };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr, "utf8").toString("base64url");
  const sigHex = crypto.createHmac("sha256", secret).update(payloadStr).digest("hex");
  return `${payloadB64}.${sigHex}`;
}

/**
 * @param {string} secret
 * @param {string | undefined} cookieValue
 * @returns {{ v: number, exp: number, cs?: string, uid?: string, email?: string } | null}
 */
export function parsePremiumCookie(secret, cookieValue) {
  if (!secret || typeof cookieValue !== "string") return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = cookieValue.slice(0, dot);
  const sigHex = cookieValue.slice(dot + 1);
  let payloadStr;
  try {
    payloadStr = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("hex");
  try {
    const a = Buffer.from(sigHex, "hex");
    const b = Buffer.from(expectedHex, "hex");
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(payloadStr);
    if ((data.v !== 1 && data.v !== 2) || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * @param {string} secret
 * @param {string | undefined} cookieValue
 * @returns {boolean}
 */
export function verifyPremiumCookie(secret, cookieValue) {
  return Boolean(parsePremiumCookie(secret, cookieValue));
}

export function expUnixFromProfile(profile) {
  if (profile?.current_period_end) {
    return Math.floor(new Date(profile.current_period_end).getTime() / 1000);
  }
  return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
}

export function stampPremiumCookie(response, secret, profile, checkoutSessionId) {
  if (!secret || !response || !profile?.user_id) return false;
  const expUnix = expUnixFromProfile(profile);
  const maxAge = Math.max(0, expUnix - Math.floor(Date.now() / 1000));
  if (maxAge <= 0) return false;
  response.cookies.set(
    PREMIUM_COOKIE_NAME,
    createPremiumCookieValue(secret, {
      expUnix,
      checkoutSessionId:
        checkoutSessionId || profile.stripe_subscription_id || profile.user_id,
      userId: profile.user_id,
      email: profile.email
    }),
    { ...cookieBaseOptions(), maxAge }
  );
  return true;
}

export function stampLegacyPremiumCookie(response, secret, expUnix, checkoutSessionId) {
  if (!secret || !response) return false;
  const maxAge = Math.max(0, expUnix - Math.floor(Date.now() / 1000));
  if (maxAge <= 0) return false;
  response.cookies.set(
    PREMIUM_COOKIE_NAME,
    createPremiumCookieValue(secret, {
      expUnix,
      checkoutSessionId
    }),
    { ...cookieBaseOptions(), maxAge }
  );
  return true;
}

export function clearPremiumCookie(response) {
  if (!response) return;
  response.cookies.set(PREMIUM_COOKIE_NAME, "", {
    ...cookieBaseOptions(),
    maxAge: 0
  });
}
