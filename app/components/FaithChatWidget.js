"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { BOOKING_URL } from "../lib/bookingUrl";

const FAITH_LOGO_URL =
  "https://truefreedomfinancial.com/wp-content/uploads/2023/03/logopng-300x300.png";

const WELCOME = "Hi! 👋 How may I help you today?";

const QUICK_REPLIES = [
  "How does Debt GPS work?",
  "What is Infinite Banking?",
  "Tell me about annuities",
  "Book a consultation"
];

const BOOKING_INTENT_MESSAGE = "I want to book a consultation";
const BOOKING_CONFIRMED_MESSAGE =
  "Got you booked! 🎉 If you have any questions before your call with Deb, I'm right here!";

function FaithAvatar({ size, className = "" }) {
  return (
    <img
      src={FAITH_LOGO_URL}
      alt=""
      width={size}
      height={size}
      className={["faith-chat__avatar-img", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

const BOOKING_QUICK_PICKS = ["📅 This Week", "📅 Next Week", "📅 Pick a Time"];

function FaithBookingActions({ onScheduleClick, onBookingLinkOpen }) {
  return (
    <div className="faith-chat__booking-group">
      <button
        type="button"
        className="faith-chat__booking-btn"
        onClick={onScheduleClick}
      >
        📅 Schedule a Free Call
      </button>
      <div className="faith-chat__booking-picks">
        {BOOKING_QUICK_PICKS.map((label) => (
          <button
            key={label}
            type="button"
            className="faith-chat__booking-pick"
            onClick={onBookingLinkOpen}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function stripMarkdownArtifacts(text) {
  return String(text ?? "").replace(/\*\*/g, "");
}

function stripOrphanedPointerEmojis(text) {
  return String(text)
    .replace(/^\s*👉\s*$/gm, "")
    .replace(/\s+👉\s*(?=[.!?,;:\n]|$)/g, "")
    .replace(/(?:^|\n)\s*👉\s+(?=\n)/g, "\n");
}

function stripBookingUrlAndPointer(text) {
  const escaped = BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const markdownLink = new RegExp(
    `(?:👉\\s*)*\\[[^\\]]*\\]\\(\\s*${escaped}\\s*\\)`,
    "gi"
  );

  let result = String(text ?? "")
    .replace(markdownLink, " ")
    .replace(new RegExp(`👉[\\s\\S]{0,40}?${escaped}`, "gi"), " ")
    .replace(new RegExp(`(?:👉\\s*)+${escaped}`, "gi"), " ")
    .replace(new RegExp(`${escaped}\\s*(?:👉\\s*)+`, "gi"), " ")
    .replace(new RegExp(escaped, "gi"), " ");

  return stripOrphanedPointerEmojis(result);
}

const PHONE_CALL_LINE_PATTERN =
  /(?:📞|☎️|📱|tel:|mailto:|\(\d{3}\)|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|toll[- ]?free|\blocal\s*:|\blocal\s+kerrville|\bphone\b|\bcall\b|reach\s+out(?:\s+directly)?|questions?\s+before\s+your\s+appointment)/i;

const EMAIL_LINE_PATTERN = /(?:@|📧|✉️|\be-?mail\b)/i;

function isContactOrCallLine(line) {
  const trimmed = String(line).trim();
  if (!trimmed) return true;
  return PHONE_CALL_LINE_PATTERN.test(trimmed) || EMAIL_LINE_PATTERN.test(trimmed);
}

function stripContactInfoFromBookingResponse(text) {
  return String(text)
    .split(/\r?\n/)
    .filter((line) => !isContactOrCallLine(line))
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseFaithMessage(content) {
  const escaped = BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const markdownLink = new RegExp(`\\[[^\\]]*\\]\\(\\s*${escaped}\\s*\\)`, "gi");
  const normalized = String(content ?? "").replace(markdownLink, BOOKING_URL);
  const hasBooking = normalized.toLowerCase().includes(BOOKING_URL.toLowerCase());

  let text = stripBookingUrlAndPointer(normalized);
  if (hasBooking) {
    text = stripContactInfoFromBookingResponse(text);
  }

  const displayText = stripMarkdownArtifacts(
    text
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim()
  );

  return { hasBooking, displayText };
}

function containsBookingLink(content) {
  return parseFaithMessage(content).hasBooking;
}

function FaithMessageContent({ content, onScheduleClick, onBookingLinkOpen }) {
  const { hasBooking, displayText } = parseFaithMessage(content);

  return (
    <div className="faith-chat__message-body">
      {displayText ? <span>{displayText}</span> : null}
      {hasBooking ? (
        <FaithBookingActions
          onScheduleClick={onScheduleClick}
          onBookingLinkOpen={onBookingLinkOpen}
        />
      ) : null}
    </div>
  );
}

const AssistantMessage = forwardRef(function AssistantMessage(
  { content, children, className = "", onScheduleClick, onBookingLinkOpen },
  ref
) {
  const body = content ?? children;

  return (
    <div ref={ref} className="faith-chat__row faith-chat__row--assistant">
      <FaithAvatar size={32} className="faith-chat__avatar-img--message" />
      <div
        className={["faith-chat__bubble", "faith-chat__bubble--assistant", className]
          .filter(Boolean)
          .join(" ")}
      >
        {typeof body === "string" ? (
          <FaithMessageContent
            content={body}
            onScheduleClick={onScheduleClick}
            onBookingLinkOpen={onBookingLinkOpen}
          />
        ) : (
          body
        )}
      </div>
    </div>
  );
});

export default function FaithChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const lastAssistantMessageRef = useRef(null);

  const showQuickReplies = messages.length === 0 && !loading;

  useEffect(() => {
    if (!open || !listRef.current) return;

    const lastMessage = messages[messages.length - 1];
    const scrollToFaithReply =
      !loading &&
      lastMessage?.role === "assistant" &&
      lastAssistantMessageRef.current;

    if (scrollToFaithReply) {
      requestAnimationFrame(() => {
        lastAssistantMessageRef.current?.scrollIntoView({
          block: "start",
          behavior: "smooth"
        });
      });
      return;
    }

    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages, loading]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const raw = String(text ?? "").trim();
    if (!raw || loading) return;

    const trimmed =
      raw === "Book a consultation" ? BOOKING_INTENT_MESSAGE : raw;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/faith-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleBookingLinkOpen = useCallback(() => {
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: BOOKING_CONFIRMED_MESSAGE }
    ]);
  }, []);

  const triggerBookingResponse = useCallback(() => {
    void sendMessage(BOOKING_INTENT_MESSAGE);
  }, [sendMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="faith-chat" aria-live="polite">
      {open ? (
        <div
          className="faith-chat__panel"
          role="dialog"
          aria-label="Faith chat assistant"
        >
          <header className="faith-chat__header">
            <div className="faith-chat__header-text">
              <FaithAvatar size={40} className="faith-chat__avatar-img--header" />
              <div>
                <strong className="faith-chat__title">Faith</strong>
                <span className="faith-chat__subtitle">True Freedom Financial</span>
              </div>
            </div>
            <button
              type="button"
              className="faith-chat__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="faith-chat__messages" ref={listRef}>
            <AssistantMessage content={WELCOME} />
            {messages.map((msg, i) =>
              msg.role === "assistant" ? (
                <AssistantMessage
                  key={`${msg.role}-${i}`}
                  content={msg.content}
                  ref={i === messages.length - 1 ? lastAssistantMessageRef : null}
                  onScheduleClick={triggerBookingResponse}
                  onBookingLinkOpen={handleBookingLinkOpen}
                />
              ) : (
                <div
                  key={`${msg.role}-${i}`}
                  className="faith-chat__bubble faith-chat__bubble--user"
                >
                  {stripMarkdownArtifacts(msg.content)}
                </div>
              )
            )}
            {loading ? (
              <AssistantMessage className="faith-chat__typing">
                Faith is typing…
              </AssistantMessage>
            ) : null}
            {error ? <p className="faith-chat__error">{error}</p> : null}
          </div>

          {showQuickReplies ? (
            <div className="faith-chat__quick">
              {QUICK_REPLIES.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="faith-chat__quick-btn"
                  onClick={() => sendMessage(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          <form className="faith-chat__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="faith-chat__input"
              placeholder="Ask Faith anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              aria-label="Message Faith"
            />
            <button
              type="submit"
              className="faith-chat__send"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className="faith-chat__launcher"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close Faith chat" : "Open Faith chat"}
      >
        <FaithAvatar size={52} className="faith-chat__avatar-img--launcher" />
      </button>
    </div>
  );
}
