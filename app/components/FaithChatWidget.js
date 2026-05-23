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

const BOOKING_LINK_PROPS = {
  href: BOOKING_URL,
  target: "_blank",
  rel: "noopener noreferrer"
};

function FaithBookingActions() {
  return (
    <div className="faith-chat__booking-group">
      <a className="faith-chat__booking-btn" {...BOOKING_LINK_PROPS}>
        📅 Schedule a Free Call
      </a>
      <div className="faith-chat__booking-picks">
        {BOOKING_QUICK_PICKS.map((label) => (
          <a key={label} className="faith-chat__booking-pick" {...BOOKING_LINK_PROPS}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function containsBookingLink(content) {
  const escaped = BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const markdownLink = new RegExp(`\\[[^\\]]*\\]\\(\\s*${escaped}\\s*\\)`, "gi");
  const normalized = String(content ?? "").replace(markdownLink, BOOKING_URL);
  return normalized.toLowerCase().includes(BOOKING_URL.toLowerCase());
}

function FaithMessageContent({ content }) {
  const escaped = BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const markdownLink = new RegExp(`\\[[^\\]]*\\]\\(\\s*${escaped}\\s*\\)`, "gi");
  const normalized = String(content).replace(markdownLink, BOOKING_URL);
  const parts = normalized.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <div className="faith-chat__message-body">
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.toLowerCase() === BOOKING_URL.toLowerCase()) {
          return <FaithBookingActions key={`booking-${i}`} />;
        }
        return <span key={`text-${i}`}>{part}</span>;
      })}
    </div>
  );
}

const AssistantMessage = forwardRef(function AssistantMessage(
  { content, children, className = "" },
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
        {typeof body === "string" ? <FaithMessageContent content={body} /> : body}
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
  const bookingMessageRef = useRef(null);

  const showQuickReplies = messages.length === 0 && !loading;

  useEffect(() => {
    if (!open || !listRef.current) return;

    const lastMessage = messages[messages.length - 1];
    const scrollToBookingMessage =
      !loading &&
      lastMessage?.role === "assistant" &&
      containsBookingLink(lastMessage.content) &&
      bookingMessageRef.current;

    if (scrollToBookingMessage) {
      requestAnimationFrame(() => {
        const row = bookingMessageRef.current;
        const bookingBlock =
          row?.querySelector(".faith-chat__booking-group") ?? row;
        bookingBlock?.scrollIntoView({ block: "start", behavior: "smooth" });
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
    const trimmed = String(text ?? "").trim();
    if (!trimmed || loading) return;

    if (trimmed === "Book a consultation") {
      window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    }

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
                  ref={
                    i === messages.length - 1 && containsBookingLink(msg.content)
                      ? bookingMessageRef
                      : null
                  }
                />
              ) : (
                <div
                  key={`${msg.role}-${i}`}
                  className="faith-chat__bubble faith-chat__bubble--user"
                >
                  {msg.content}
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
