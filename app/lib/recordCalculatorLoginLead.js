const LEAD_CONNECTOR_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/li7bawDeS1qlqOOTosAQ/webhook-trigger/c13d8594-b26f-4d27-813a-36b5"

/**
 * Fire-and-forget; failures only logged (does not affect login).
 * @param {string} userEmail normalized email
 */
function postLeadConnectorWebhook(userEmail) {
  void fetch(LEAD_CONNECTOR_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail,
      source: "Debt GPS"
    })
  })
    .then((res) => {
      if (!res.ok) {
        console.warn("[leads] webhook returned", res.status)
      }
    })
    .catch((err) => {
      console.warn("[leads] webhook failed", err)
    })
}

/**
 * After a successful magic-link request, record the email in `leads` if new.
 * Skips insert when this email already exists (any row). Implemented in DB via
 * `try_insert_calculator_login_lead` so RLS does not require public SELECT on `leads`.
 * Never throws — failures are logged so auth UX is unaffected.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} email
 */
export async function recordCalculatorLoginLead(supabase, email) {
  const trimmed = String(email).trim().toLowerCase()
  if (!trimmed) return

  const { error } = await supabase.rpc("try_insert_calculator_login_lead", {
    p_email: trimmed
  })

  if (error) {
    console.warn("[leads] record failed", error.message)
    return
  }

  postLeadConnectorWebhook(trimmed)
}
