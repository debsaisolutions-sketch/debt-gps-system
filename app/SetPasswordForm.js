"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Those passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Could not set password.");
      return;
    }

    window.location.href = "/calculator";
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 8,
    marginBottom: 10
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        autoComplete="new-password"
        placeholder="New password (8+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={fieldStyle}
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={fieldStyle}
      />
      <button
        type="submit"
        className="primary-button"
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          marginBottom: 12
        }}
      >
        {loading ? "Saving…" : "Save password"}
      </button>
      {message ? (
        <p className="help tight" style={{ margin: "0 0 12px", color: "#b91c1c" }} role="alert">
          {message}
        </p>
      ) : null}
      <p className="help tight" style={{ margin: 0, textAlign: "center" }}>
        <Link href="/calculator" style={{ color: "var(--accent-2)", fontWeight: 600 }}>
          Skip for now
        </Link>
      </p>
    </form>
  );
}
