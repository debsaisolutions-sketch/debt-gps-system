import { NextResponse } from "next/server"

/** @see https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact */
const GHL_CONTACTS_UPSERT = "https://services.leadconnectorhq.com/contacts/upsert"

export async function GET() {
  return NextResponse.json({ ok: true, route: "send-to-ghl" })
}

export async function POST(request) {
  const apiKey = process.env.GHL_API_KEY?.trim()
  const locationId = process.env.GHL_LOCATION_ID?.trim()

  if (!apiKey) {
    console.error("[send-to-ghl] GHL_API_KEY is missing; set it in the server environment (e.g. .env.local)")
    return NextResponse.json(
      { success: false, error: "Server configuration error: GHL_API_KEY not set" },
      { status: 500 }
    )
  }

  if (!locationId) {
    console.error("[send-to-ghl] GHL_LOCATION_ID is missing; set it in the server environment (sub-account location id)")
    return NextResponse.json(
      { success: false, error: "Server configuration error: GHL_LOCATION_ID not set" },
      { status: 500 }
    )
  }

  let email
  let source
  let plan
  try {
    ({ email, source, plan } = await request.json())
  } catch (e) {
    console.error("[send-to-ghl] invalid JSON body", e)
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const normalizedEmail = typeof email === "string" ? email.trim() : ""
  const normalizedSource = typeof source === "string" ? source.trim() : ""
  const normalizedPlan = typeof plan === "string" ? plan.trim() : ""

  if (!normalizedEmail || !normalizedSource) {
    console.error("[send-to-ghl] missing email or source", {
      hasEmail: Boolean(normalizedEmail),
      hasSource: Boolean(normalizedSource)
    })
    return NextResponse.json(
      { success: false, error: "email and source are required" },
      { status: 400 }
    )
  }

  const payload = {
    locationId: locationId,
    email: normalizedEmail,
    tags: ["Debt GPS"],
    source: normalizedSource,
    plan: normalizedPlan || "free"
  }

  try {
    console.log("GHL DEBUG", { apiKey, locationId, payload });
    const upstream = await fetch(GHL_CONTACTS_UPSERT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28"
      },
      body: JSON.stringify(payload)
    })

    const text = await upstream.text()

    if (!upstream.ok) {
      console.error("[send-to-ghl] GHL contacts upsert failed", {
        status: upstream.status,
        statusText: upstream.statusText,
        bodyPreview: text.slice(0, 1000)
      })
      return NextResponse.json(
        {
          success: false,
          error: `GHL API returned ${upstream.status}`,
          details: text.slice(0, 300)
        },
        { status: 502 }
      )
    }

    let parsed = null
    try {
      parsed = text ? JSON.parse(text) : null
    } catch {
      /* non-JSON success body is ok */
    }

    if (plan === "paid" && email) {
      const { createClient } = require("@supabase/supabase-js");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      try {
        await supabase
          .from("leads")
          .update({ plan: "paid" })
          .eq("email", email.toLowerCase());
      } catch (err) {
        console.warn("[leads] supabase paid update failed", err);
      }
    }

    return NextResponse.json({ success: true, ghl: parsed })
  } catch (e) {
    console.error("[send-to-ghl] fetch to GHL failed", e)
    return NextResponse.json(
      { success: false, error: "Failed to reach GHL API" },
      { status: 500 }
    )
  }
}
