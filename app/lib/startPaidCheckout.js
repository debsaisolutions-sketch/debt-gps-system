/**
 * Start Stripe Checkout with an email only — no login/session required.
 *
 * @param {{ interval?: 'month'|'year', emailForLead?: string }} [opts]
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function startPaidCheckout(opts = {}) {
  const interval = opts.interval === "year" ? "year" : "month";
  const emailForLead =
    opts.emailForLead && String(opts.emailForLead).trim()
      ? String(opts.emailForLead).trim()
      : "";

  if (emailForLead) {
    try {
      await fetch("/api/send-to-ghl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailForLead,
          source: "Debt GPS",
          plan: "paid"
        })
      });
    } catch (err) {
      console.warn("[leads] paid lead send-to-ghl error", err);
    }
  }

  const res = await fetch("/api/checkout/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      interval,
      email: emailForLead || undefined
    })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.url) {
    return {
      ok: false,
      error: data.error || "Could not start checkout. Please try again."
    };
  }

  window.location.href = data.url;
  return { ok: true };
}
