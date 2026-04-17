import { NextResponse } from "next/server"

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/li7bawDeS1qlqOOTosAQ/webhook-trigger/c13d8594-b26f-4d27-813a-36b5"

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch (e) {
    console.error("[lead-webhook] invalid JSON body", e)
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const source = typeof body.source === "string" ? body.source.trim() : ""

  if (!email || !source) {
    console.error("[lead-webhook] missing email or source", {
      hasEmail: Boolean(email),
      hasSource: Boolean(source)
    })
    return NextResponse.json(
      { success: false, error: "email and source are required" },
      { status: 400 }
    )
  }

  try {
    const upstream = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source })
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "")
      console.error("[lead-webhook] GHL upstream error", {
        status: upstream.status,
        statusText: upstream.statusText,
        bodyPreview: text.slice(0, 500)
      })
      return NextResponse.json(
        {
          success: false,
          error: `Upstream webhook returned ${upstream.status}`
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[lead-webhook] fetch to GHL failed", e)
    return NextResponse.json(
      { success: false, error: "Failed to reach upstream webhook" },
      { status: 500 }
    )
  }
}
