import { TFF_SYSTEM } from "../../lib/tffFaithSystemPrompt";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
/** claude-sonnet-4-20250514 is not a valid API model id; Sonnet 4.6 is the current Sonnet 4 release. */
const DEFAULT_MODEL = "claude-sonnet-4-6";

export const runtime = "nodejs";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured. Please try again later." },
      { status: 503 }
    );
  }

  const model =
    process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const anthropicMessages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? "").trim()
    }))
    .filter((m) => m.content);

  if (!anthropicMessages.length) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        system: TFF_SYSTEM,
        messages: anthropicMessages
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Anthropic API error:", {
        status: res.status,
        model,
        type: data?.error?.type,
        message: data?.error?.message
      });
      return Response.json(
        { error: "Sorry, I could not respond right now. Please try again." },
        { status: 502 }
      );
    }

    const text = data?.content?.find((block) => block.type === "text")?.text?.trim();
    if (!text) {
      console.error("Anthropic API returned no text content", { model });
      return Response.json(
        { error: "Sorry, I could not respond right now. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ reply: text });
  } catch (err) {
    console.error("Faith chat error:", err);
    return Response.json(
      { error: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
