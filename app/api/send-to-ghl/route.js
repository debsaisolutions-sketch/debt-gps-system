import { NextResponse } from "next/server"

/** @see https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact */
const GHL_CONTACTS_UPSERT = "https://services.leadconnectorhq.com/contacts/upsert"
const GHL_PIPELINES =
  "https://services.leadconnectorhq.com/opportunities/pipelines"
const GHL_OPPORTUNITIES = "https://services.leadconnectorhq.com/opportunities/"

const PIPELINE_NAME = "Debt GPS Leads"
const STAGE_NAME_NEW_LEAD = "New Lead"

function ghlRequestHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    Version: "2021-07-28"
  }
}

function contactIdFromUpsert(parsed) {
  if (!parsed || typeof parsed !== "object") return ""
  return (
    parsed.contact?.id ||
    parsed.contactId ||
    parsed.id ||
    parsed.data?.contact?.id ||
    ""
  )
}

function pipelinesFromListPayload(payload) {
  if (!payload || typeof payload !== "object") return []
  if (Array.isArray(payload.pipelines)) return payload.pipelines
  if (Array.isArray(payload.data?.pipelines)) return payload.data.pipelines
  if (Array.isArray(payload.data)) return payload.data
  return []
}

/**
 * @returns {Promise<object|null>} Parsed opportunity JSON or null on skip/failure (logged).
 */
async function createDebtGpsOpportunity({
  apiKey,
  locationId,
  normalizedEmail,
  contactId
}) {
  const headers = ghlRequestHeaders(apiKey)
  const pipelinesUrl = new URL(GHL_PIPELINES)
  pipelinesUrl.searchParams.set("locationId", locationId)

  let listRes
  try {
    listRes = await fetch(pipelinesUrl, { method: "GET", headers })
  } catch (e) {
    console.error("[send-to-ghl] GET pipelines request failed", e)
    return null
  }

  const listText = await listRes.text()
  if (!listRes.ok) {
    console.error("[send-to-ghl] GET pipelines failed", {
      status: listRes.status,
      bodyPreview: listText.slice(0, 1000)
    })
    return null
  }

  let listJson
  try {
    listJson = listText ? JSON.parse(listText) : null
  } catch {
    console.error("[send-to-ghl] GET pipelines invalid JSON", {
      bodyPreview: listText.slice(0, 300)
    })
    return null
  }

  const pipelines = pipelinesFromListPayload(listJson)
  const pipeline = pipelines.find((p) => p?.name === PIPELINE_NAME)
  if (!pipeline?.id) {
    console.warn(`[send-to-ghl] pipeline "${PIPELINE_NAME}" not found`)
    return null
  }

  const stages = Array.isArray(pipeline.stages) ? pipeline.stages : []
  if (!stages.length) {
    console.warn("[send-to-ghl] pipeline has no stages")
    return null
  }

  const namedStage = stages.find((s) => s?.name === STAGE_NAME_NEW_LEAD)
  const stage = namedStage || stages[0]
  if (!stage?.id) {
    console.warn("[send-to-ghl] could not resolve pipelineStageId")
    return null
  }

  let oppRes
  try {
    oppRes = await fetch(GHL_OPPORTUNITIES, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        name: `Debt GPS Lead - ${normalizedEmail}`,
        contactId,
        pipelineId: pipeline.id,
        pipelineStageId: stage.id,
        status: "open"
      })
    })
  } catch (e) {
    console.error("[send-to-ghl] opportunity create request failed", e)
    return null
  }

  const oppText = await oppRes.text()
  if (!oppRes.ok) {
    console.error("[send-to-ghl] opportunity create failed", {
      status: oppRes.status,
      bodyPreview: oppText.slice(0, 1000)
    })
    return null
  }

  try {
    return oppText ? JSON.parse(oppText) : null
  } catch {
    return null
  }
}

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

  // Lead Connector Contact upsert rejects unknown properties (422). `plan` is not a contact field.
  const ghlPayload = {
    locationId,
    email: normalizedEmail,
    tags: ["Debt GPS"],
    source: normalizedSource
  }

  try {
    console.log("[send-to-ghl] LeadConnector upsert", {
      locationId,
      email: normalizedEmail,
      tagCount: ghlPayload.tags?.length,
      source: normalizedSource,
      planLocal: normalizedPlan || "free"
    })
    const upstream = await fetch(GHL_CONTACTS_UPSERT, {
      method: "POST",
      headers: ghlRequestHeaders(apiKey),
      body: JSON.stringify(ghlPayload)
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

    const contactId = contactIdFromUpsert(parsed)
    if (contactId) {
      await createDebtGpsOpportunity({
        apiKey,
        locationId,
        normalizedEmail,
        contactId
      })
    } else {
      console.warn(
        "[send-to-ghl] skip opportunity: no contact id in upsert response"
      )
    }

    if (normalizedPlan === "paid" && normalizedEmail) {
      const { createClient } = require("@supabase/supabase-js");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      try {
        await supabase
          .from("leads")
          .update({ plan: "paid" })
          .eq("email", normalizedEmail);
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
