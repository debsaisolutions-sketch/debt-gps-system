"use client";

import { useState } from "react";

export default function LoginPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/password", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Could not log in.");
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
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={fieldStyle}
      />
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
          cursor: "pointer"
        }}
      >
        {loading ? "Logging in…" : "Log in with password"}
      </button>
      {message ? (
        <p className="help tight" style={{ margin: "10px 0 0", color: "#b91c1c" }} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
