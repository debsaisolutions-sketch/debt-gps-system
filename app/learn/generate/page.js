"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function GenerateArticlePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasDraft, setHasDraft] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [intro, setIntro] = useState("");
  const [sections, setSections] = useState([]);
  const [faq, setFaq] = useState([]);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaText, setCtaText] = useState("");

  const canGenerate = useMemo(() => topic.trim().length > 0 && !loading, [topic, loading]);
  const canSave = hasDraft && !saving;

  function updateSection(index, field, value) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function updateFaqItem(index, field, value) {
    setFaq((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

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

      const a = payload.article;
      setTitle(a.title ?? "");
      setSlug(a.slug ?? "");
      setDescription(a.description ?? "");
      setIntro(a.intro ?? "");
      setSections(
        Array.isArray(a.sections)
          ? a.sections.map((s) => ({
              heading: s.heading ?? "",
              body: s.body ?? ""
            }))
          : []
      );
      setFaq(
        Array.isArray(a.faq)
          ? a.faq.map((item) => ({
              question: item.question ?? "",
              answer: item.answer ?? ""
            }))
          : []
      );
      setCtaTitle(a.ctaTitle ?? "");
      setCtaText(a.ctaText ?? "");
      setHasDraft(true);
      setSuccess("Article generated. Review it, then save.");
    } catch (err) {
      setHasDraft(false);
      setTitle("");
      setSlug("");
      setDescription("");
      setIntro("");
      setSections([]);
      setFaq([]);
      setCtaTitle("");
      setCtaText("");
      setError(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!hasDraft) return;

    const article = {
      title,
      slug,
      description,
      intro,
      sections,
      faq,
      ctaTitle,
      ctaText
    };

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
      const saved = payload.article;
      if (saved) {
        setTitle(saved.title ?? "");
        setSlug(saved.slug ?? "");
        setDescription(saved.description ?? "");
        setIntro(saved.intro ?? "");
        setSections(
          Array.isArray(saved.sections)
            ? saved.sections.map((s) => ({
                heading: s.heading ?? "",
                body: s.body ?? ""
              }))
            : []
        );
        setFaq(
          Array.isArray(saved.faq)
            ? saved.faq.map((item) => ({
                question: item.question ?? "",
                answer: item.answer ?? ""
              }))
            : []
        );
        setCtaTitle(saved.ctaTitle ?? "");
        setCtaText(saved.ctaText ?? "");
      }
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

      {hasDraft ? (
        <section className="card">
          <p className="step-badge" style={{ marginBottom: "8px" }}>
            Generated Output
          </p>
          <div className="field" style={{ marginBottom: "8px" }}>
            <label htmlFor="article-title">Title</label>
            <input
              id="article-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: "8px" }}>
            <label htmlFor="article-slug">Slug</label>
            <input
              id="article-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: "14px" }}>
            <label htmlFor="article-description">Description</label>
            <textarea
              id="article-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <section style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 6px" }}>Intro</h3>
            <textarea
              className="help"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={6}
              style={{
                marginBottom: 0,
                fontSize: "1rem",
                color: "var(--text)",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          </section>

          <section style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 8px" }}>Sections</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {sections.map((section, index) => (
                <div
                  key={`section-${index}`}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    padding: "12px 14px"
                  }}
                >
                  <div className="field" style={{ marginBottom: "8px" }}>
                    <label htmlFor={`section-heading-${index}`}>Heading</label>
                    <input
                      id={`section-heading-${index}`}
                      value={section.heading}
                      onChange={(e) => updateSection(index, "heading", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`section-body-${index}`}>Body</label>
                    <textarea
                      id={`section-body-${index}`}
                      className="help"
                      value={section.body}
                      onChange={(e) => updateSection(index, "body", e.target.value)}
                      rows={5}
                      style={{ marginBottom: 0, width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 8px" }}>FAQ</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {faq.map((item, index) => (
                <div
                  key={`faq-${index}`}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    padding: "12px 14px"
                  }}
                >
                  <div className="field" style={{ marginBottom: "8px" }}>
                    <label htmlFor={`faq-q-${index}`}>Question</label>
                    <input
                      id={`faq-q-${index}`}
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`faq-a-${index}`}>Answer</label>
                    <textarea
                      id={`faq-a-${index}`}
                      className="help"
                      value={item.answer}
                      onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                      rows={4}
                      style={{ marginBottom: 0, width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 6px" }}>CTA</h3>
            <div className="field" style={{ marginBottom: "6px" }}>
              <label htmlFor="cta-title">CTA title</label>
              <input
                id="cta-title"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="cta-text">CTA text</label>
              <textarea
                id="cta-text"
                className="help"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                rows={4}
                style={{ marginBottom: 0, width: "100%", boxSizing: "border-box" }}
              />
            </div>
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
            <Link className="secondary-button" href={`/learn/${slug}`}>
              View Saved Route
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
