import Link from "next/link";
import { seoArticles } from "../lib/seoArticles";

export const metadata = {
  title: "Learning Hub | Debt GPS System",
  description:
    "Explore Debt GPS learning articles on payoff methods, interest strategy, and practical debt planning."
};

export default function LearnHubPage() {
  return (
    <main className="page" style={{ maxWidth: "1080px", paddingTop: "32px" }}>
      <section className="hero-dashboard" style={{ marginBottom: "24px" }}>
        <p className="hero-eyebrow" style={{ color: "rgba(248, 250, 252, 0.85)" }}>
          Debt GPS Learning Hub
        </p>
        <h1 style={{ marginBottom: "12px", color: "#f8fafc" }}>
          Learn Smarter Debt Payoff Strategies
        </h1>
        <p className="hero-lead" style={{ color: "rgba(248, 250, 252, 0.92)", maxWidth: "760px" }}>
          Browse practical guides that break down payoff sequencing, Snowball vs Avalanche
          decisions, and how interest affects your timeline.
        </p>
      </section>

      <section className="card">
        <h2 style={{ marginBottom: "8px" }}>Start with any article below</h2>
        <p className="help" style={{ marginBottom: "18px", fontSize: "1rem" }}>
          Each guide links directly into a full article page and connects to the Debt GPS
          calculator so readers can apply what they learn.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px"
          }}
        >
          {seoArticles.map((article) => (
            <article
              key={article.slug}
              style={{
                border: "1px solid var(--line)",
                borderRadius: "14px",
                background: "#f8fafc",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                minHeight: "220px"
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
                {article.title}
              </h3>
              <p className="help" style={{ marginBottom: "14px" }}>
                {article.description}
              </p>
              <div style={{ marginTop: "auto" }}>
                <Link className="button-link primary-button" href={`/learn/${article.slug}`}>
                  Read Article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
