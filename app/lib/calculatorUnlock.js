/** Browser flag set when the calculator email unlock succeeds. */
export const CALCULATOR_UNLOCK_COOKIE = "dgps_calculator_unlock";

export const BOOKING_GATE_NOTE =
  "Run your numbers first so we can make the most of your call.";

/** /book sends visitors here when the unlock flag is missing. */
export const CALCULATOR_BOOKING_GATE_PATH = "/calculator?booking=1";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function markCalculatorUnlocked() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CALCULATOR_UNLOCK_COOKIE, "1");
  } catch {
    /* private mode / blocked storage */
  }
  document.cookie = `${CALCULATOR_UNLOCK_COOKIE}=1; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}

export function hasCalculatorUnlockClient() {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(CALCULATOR_UNLOCK_COOKIE) === "1") return true;
  } catch {
    /* ignore */
  }
  return document.cookie.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === CALCULATOR_UNLOCK_COOKIE && value === "1";
  });
}

export function requestHasCalculatorUnlock(request) {
  return request.cookies.get(CALCULATOR_UNLOCK_COOKIE)?.value === "1";
}
