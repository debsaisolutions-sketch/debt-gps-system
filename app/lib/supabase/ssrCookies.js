/**
 * Must be identical on browser + server clients.
 * tokens-only keeps access/refresh in cookies and drops the user object
 * so the session cookie stays well under browser send limits.
 */
export const SSR_COOKIE_ENCODE = "tokens-only";
