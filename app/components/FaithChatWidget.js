"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOKING_URL } from "../lib/bookingUrl";

const WELCOME = "Hi! 👋 How may I help you today?";

const QUICK_REPLIES = [
  "How does Debt GPS work?",
  "What is Infinite Banking?",
  "Tell me about annuities",
  "Book a consultation"
];

export default function FaithChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const showQuickReplies = messages.length === 0 && !loading;

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
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
              <span className="faith-chat__avatar" aria-hidden="true">
                🕊️
              </span>
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
            <div className="faith-chat__bubble faith-chat__bubble--assistant">
              {WELCOME}
            </div>
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={`faith-chat__bubble faith-chat__bubble--${msg.role}`}
              >
                {msg.content}
              </div>
            ))}
            {loading ? (
              <div className="faith-chat__bubble faith-chat__bubble--assistant faith-chat__typing">
                Faith is typing…
              </div>
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
        <span className="faith-chat__launcher-icon" aria-hidden="true">
          🕊️
        </span>
      </button>
    </div>
  );
}
