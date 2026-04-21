"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function GenerateArticlePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [article, setArticle] = useState(null);

  const canGenerate = useMemo(() => topic.trim().length > 0 && !loading, [topic, loading]);
  const canSave = Boolean(article) && !saving;

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Generation failed");
      }

      setArticle(payload.article);
      setSuccess("Article generated. Review it, then save.");
    } catch (err) {
      setArticle(null);
      setError(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!article) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", article })
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Save failed");
      }

      setSuccess("Article saved to seoArticles.js.");
      setArticle(payload.article);
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page" style={{ maxWidth: "980px", paddingTop: "32px" }}>
      <section className="hero-dashboard" style={{ marginBottom: "24px" }}>
        <p className="hero-eyebrow" style={{ color: "rgba(248, 250, 252, 0.85)" }}>
          Debt GPS Content Engine
        </p>
        <h1 style={{ marginBottom: "12px", color: "#f8fafc" }}>Generate SEO Learning Articles</h1>
        <p className="hero-lead" style={{ color: "rgba(248, 250, 252, 0.92)", maxWidth: "760px" }}>
          Create article drafts from a topic, review structured output, and save into the existing
          Learning Hub article system.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Article Topic</h2>
        <p className="help" style={{ marginBottom: "12px" }}>
          Example: <em>how to pay off debt with irregular income</em>
        </p>
        <div className="field">
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter an SEO topic"
          />
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="primary-button"
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            {loading ? "Generating..." : "Generate Article"}
          </button>
          <Link className="secondary-button" href="/learn">
            Back to Learning Hub
          </Link>
        </div>
        {error ? <p className="status error">{error}</p> : null}
        {success ? <p className="status success">{success}</p> : null}
      </section>

      {article ? (
        <section className="card">
          <p className="step-badge" style={{ marginBottom: "8px" }}>
            Generated Output
          </p>
          <h2 style={{ marginBottom: "8px" }}>{article.title}</h2>
          <p className="help" style={{ marginBottom: "8px" }}>
            <strong>Slug:</strong> {article.slug}
          </p>
          <p className="help" style={{ marginBottom: "14px" }}>
            {article.description}
          </p>

          <section style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 6px" }}>Intro</h3>
            <p className="help" style={{ marginBottom: 0, fontSize: "1rem", color: "var(--text)" }}>
              {article.intro}
            </p>
          </section>

          <section style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 8px" }}>Sections</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {article.sections?.map((section) => (
                <div
                  key={section.heading}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    padding: "12px 14px"
                  }}
                >
                  <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>{section.heading}</h4>
                  <p className="help" style={{ marginBottom: 0 }}>
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 8px" }}>FAQ</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {article.faq?.map((item) => (
                <div
                  key={item.question}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    padding: "12px 14px"
                  }}
                >
                  <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>{item.question}</h4>
                  <p className="help" style={{ marginBottom: 0 }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 6px" }}>CTA</h3>
            <p className="help" style={{ marginBottom: "6px" }}>
              <strong>{article.ctaTitle}</strong>
            </p>
            <p className="help" style={{ marginBottom: 0 }}>
              {article.ctaText}
            </p>
          </section>

          <div className="top-actions" style={{ marginTop: 0 }}>
            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              disabled={!canSave}
            >
              {saving ? "Saving..." : "Save Article"}
            </button>
            <Link className="secondary-button" href={`/learn/${article.slug}`}>
              View Saved Route
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
