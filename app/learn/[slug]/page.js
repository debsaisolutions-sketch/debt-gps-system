import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CALENDLY_URL = "https://calendly.com/debsaisolutions/30min";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { data: dbArticle } = await supabase
    .from("seo_articles")
    .select("title, description")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!dbArticle) {
    return {
      title: "Article Not Found | Debt GPS System"
    };
  }

  return {
    title: `${dbArticle.title} | Debt GPS System`,
    description: dbArticle.description
  };
}

export default async function LearnArticlePage({ params }) {
  const { data: article } = await supabase
    .from("seo_articles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <main className="page" style={{ maxWidth: "960px", paddingTop: "32px" }}>
      <article style={{ display: "grid", gap: "24px" }}>
        <header className="hero-dashboard" style={{ marginBottom: 0 }}>
          <p className="hero-eyebrow" style={{ color: "rgba(248, 250, 252, 0.85)" }}>
            Debt GPS Learning Hub
          </p>
          <h1 style={{ marginBottom: "12px", color: "#f8fafc" }}>{article.title}</h1>
          <p className="hero-lead" style={{ color: "rgba(248, 250, 252, 0.92)", maxWidth: "unset" }}>
            {article.description}
          </p>
        </header>

        <section className="card">
          <p className="help" style={{ marginBottom: 0, fontSize: "1rem", color: "var(--text)" }}>
            {article.intro}
          </p>
        </section>

        {article.sections.map((section) => (
          <section key={section.heading} className="card">
            <h2 style={{ marginBottom: "12px" }}>{section.heading}</h2>
            <p className="help" style={{ marginBottom: 0, fontSize: "1rem", lineHeight: 1.7 }}>
              {section.body}
            </p>
          </section>
        ))}

        <section
          className="card"
          style={{
            border: "1px solid rgba(29, 107, 196, 0.28)",
            background: "linear-gradient(180deg, rgba(232, 241, 251, 0.7), #ffffff)"
          }}
        >
          <p className="step-badge" style={{ marginBottom: "10px" }}>
            Calculator Embed Block (Placeholder)
          </p>
          <h2 style={{ marginBottom: "10px" }}>
            See your personalized payoff timeline inside the Debt GPS calculator.
          </h2>
          <p className="help" style={{ marginBottom: "16px" }}>
            This block is ready to be replaced by a full calculator embed in a future iteration.
          </p>
          <Link className="button-link primary-button" href="/calculator">
            Open Calculator
          </Link>
        </section>

        <section className="card">
          <h2>Frequently Asked Questions</h2>
          <div style={{ display: "grid", gap: "14px", marginTop: "14px" }}>
            {article.faq.map((item) => (
              <div
                key={item.question}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  padding: "14px 16px"
                }}
              >
                <h3 style={{ margin: "0 0 6px", fontSize: "1rem", letterSpacing: "-0.01em" }}>
                  {item.question}
                </h3>
                <p className="help" style={{ marginBottom: 0 }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ borderColor: "rgba(29, 107, 196, 0.45)" }}>
          <h2 style={{ fontWeight: 800 }}>{article.cta_title}</h2>
          <p className="help" style={{ fontSize: "1rem", marginBottom: "16px" }}>
            {article.cta_text}
          </p>
          <div className="top-actions" style={{ marginTop: 0 }}>
            <Link className="button-link primary-button" href="/calculator">
              Launch Calculator
            </Link>
            <a
              className="secondary-button"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Free Strategy Call
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
