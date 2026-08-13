/**
 * Start Stripe Checkout with an email, or restore access if that email
 * already has an active paid subscription.
 *
 * @param {{ interval?: 'month'|'year', emailForLead?: string }} [opts]
 * @returns {Promise<{ ok: boolean, error?: string, alreadyPaid?: boolean }>}
 */
export async function startPaidCheckout(opts = {}) {
  const interval = opts.interval === "year" ? "year" : "month";
  const emailForLead =
    opts.emailForLead && String(opts.emailForLead).trim()
      ? String(opts.emailForLead).trim()
      : "";

  if (!emailForLead) {
    return {
      ok: false,
      error:
        "Enter the email you used to subscribe. If you already paid, we’ll unlock this browser instead of charging again."
    };
  }

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
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      interval,
      email: emailForLead
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
  return { ok: true, alreadyPaid: Boolean(data.alreadyPaid) };
}
