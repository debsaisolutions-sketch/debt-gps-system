import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default async function LearnHubPage() {
  const { data: articles, error } = await supabase
    .from("seo_articles")
    .select("slug, title, description, intro");

  return (
    <main className="page" style={{ maxWidth: "1080px", paddingTop: "32px" }}>
      <section className="hero-dashboard" style={{ marginBottom: "24px" }}>
        <p className="hero-eyebrow" style={{ color: "rgba(248, 250, 252, 0.85)" }}>
          Debt GPS Learning Hub
        </p>
        <h1 style={{ marginBottom: "12px", color: "#f8fafc" }}>Debt GPS Learning Center</h1>
        <p className="hero-lead" style={{ color: "rgba(248, 250, 252, 0.92)", maxWidth: "760px" }}>
          Explore practical guidance on debt payoff, cash flow, banking strategy, and
          financial education so you can make faster, smarter money decisions.
        </p>
      </section>

      <section className="card">
        <h2 style={{ marginBottom: "8px" }}>Latest Articles</h2>
        <p className="help" style={{ marginBottom: "18px", fontSize: "1rem" }}>
          Browse clear, beginner-friendly lessons and jump into any guide to apply it with
          your Debt GPS plan.
        </p>

        {error ? (
          <p className="help" style={{ marginBottom: 0 }}>
            We could not load learning articles right now. Please try again in a moment.
          </p>
        ) : !articles || articles.length === 0 ? (
          <p className="help" style={{ marginBottom: 0 }}>
            No learning articles are published yet. Check back soon for new guides.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px"
            }}
          >
            {articles.map((article) => (
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
                  <Link href={`/learn/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="help" style={{ marginBottom: "14px" }}>
                  {article.description || article.intro || "Read this guide in the learning center."}
                </p>
                <div style={{ marginTop: "auto" }}>
                  <Link className="button-link primary-button" href={`/learn/${article.slug}`}>
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card" style={{ marginTop: "18px", borderColor: "rgba(29, 107, 196, 0.45)" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "10px" }}>
          Ready to See Your Best Debt Payoff Path?
        </h2>
        <p className="help" style={{ marginBottom: "16px", fontSize: "1rem" }}>
          Use the calculator to map your timeline, compare strategies, and choose your next best step.
        </p>
        <Link className="button-link primary-button" href="/calculator">
          Open Calculator
        </Link>
      </section>
    </main>
  );
}
