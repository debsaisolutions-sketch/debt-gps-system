const LEAD_GHL_SOURCE = "Debt GPS"

/**
 * Fire-and-forget to internal API; failures only logged (does not affect login).
 * @param {string} normalizedEmail normalized email
 */
function postLeadToGhl(normalizedEmail) {
  console.log("[leads] posting to /api/send-to-ghl", normalizedEmail)
  void fetch("/api/send-to-ghl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizedEmail,
      source: LEAD_GHL_SOURCE
    })
  })
    .then(async (res) => {
      if (!res.ok) {
        let detail = ""
        try {
          const data = await res.json()
          detail = data?.error ? String(data.error) : JSON.stringify(data)
        } catch {
          /* ignore */
        }
        console.warn("[leads] send-to-ghl failed", res.status, detail)
      }
    })
    .catch((err) => {
      console.warn("[leads] send-to-ghl request failed", err)
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
  const normalizedEmail = String(email).trim().toLowerCase()
  if (!normalizedEmail) return

  const { error } = await supabase.rpc("try_insert_calculator_login_lead", {
    p_email: normalizedEmail
  })

  if (error) {
    console.warn("[leads] record failed", error.message)
    return
  }

  postLeadToGhl(normalizedEmail)
}
