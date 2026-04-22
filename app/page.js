'use client';
import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
const CALENDLY_URL = "https://calendly.com/debsaisolutions/30min";
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/5kQeVe5SX5Ul8Z6fPn28800";

const trustPoints = [
  "Compare 4 payoff strategies",
  "See your next move instantly",
  "Visual month-by-month timeline",
  "Built for real decisions"
];

const howSteps = [
  {
    n: "01",
    title: "Enter your debts",
    body: "Add balances, rates, and payments in one place."
  },
  {
    n: "02",
    title: "Compare strategies",
    body: "See Snowball, Avalanche, Banking, and HELOC side by side."
  },
  {
    n: "03",
    title: "Follow the plan",
    body: "Watch what gets paid off next, month by month."
  }
];

const heroTimelinePreview = [
  { month: "Month 1", line: "Credit Card A" },
  { month: "Month 4", line: "Credit Card B paid off" },
  { month: "Month 7", line: "Debt snowball accelerates" }
];

const features = [
  {
    title: "Snowball vs Avalanche",
    body: "Run both Standard paths on the same debts so you can choose between quick wins and interest-efficient sequencing—with numbers, not guesswork.",
    accent: "var(--accent-2)"
  },
  {
    title: "Banking Strategy Modeling",
    body: "Layer policy-backed mechanics next to traditional paydown so you can see how capital-building and creditor payoff interact in one workspace.",
    accent: "#6d28d9"
  },
  {
    title: "HELOC Scenario Comparison",
    body: "Model HELOC acceleration with your limit and cash flow, stacked against Standard routes, without switching tools or spreadsheets.",
    accent: "#0d9488"
  },
  {
    title: "Live Payoff Timeline",
    body: "A clear, month-by-month view of status, next target, and modeled payoff timing—so the sequence is never a black box.",
    accent: "var(--accent)"
  }
];

export default function LandingPage() {
  return (
    <main className="page landing-page" style={{ maxWidth: "1160px", paddingTop: "32px" }}>
      {/* Hero */}
      <header
        className="hero hero-dashboard"
        style={{
          marginBottom: "44px",
          padding: "clamp(28px, 4vw, 48px) clamp(22px, 3vw, 40px)",
          borderRadius: "22px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(28px, 4vw, 44px)"
          }}
        >
          <div style={{ flex: "1 1 300px", maxWidth: "580px", minWidth: 0 }}>
            <p
              className="hero-eyebrow"
              style={{ color: "rgba(248, 250, 252, 0.9)", marginBottom: "10px" }}
            >
              Smarter Debt Payoff Planning
            </p>
            <h1
              style={{
                margin: "0 0 18px",
                fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.12,
                color: "#f8fafc"
              }}
            >
              Know Exactly What to Pay Next — and When You&apos;ll Be Debt Free
            </h1>
            <p
              style={{
                margin: "0 0 30px",
                fontSize: "clamp(1.02rem, 2.1vw, 1.15rem)",
                lineHeight: 1.62,
                color: "rgba(248, 250, 252, 0.9)",
                maxWidth: "560px",
                fontWeight: 450
              }}
            >
              Most tools show totals. Debt GPS shows the sequence — which debt gets paid
              next, when each one disappears, and how your strategy actually plays out month
              by month.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center"
              }}
            >
              <a
                className="secondary-button"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "15px 24px",
                  fontSize: "1rem",
                  fontWeight: 650,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.14)",
                  color: "#f8fafc",
                  border: "1px solid rgba(255,255,255,0.32)"
                }}
              >
                Book a Free Strategy Call
              </a>
            </div>
          </div>

          {/* Mockup / value card */}
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: "400px",
              minWidth: "min(100%, 260px)"
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.97)",
                borderRadius: 16,
                padding: "22px 20px",
                boxShadow: "0 24px 48px rgba(15, 23, 42, 0.25)",
                border: "1px solid rgba(255,255,255,0.5)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                  paddingBottom: "14px",
                  borderBottom: "1px solid var(--line)"
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)"
                  }}
                >
                  Timeline preview
                </span>
                <Link href="/" style={{ lineHeight: 0 }} aria-label="Debt GPS System home">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={44}
                    height={44}
                    style={{ objectFit: "contain", opacity: 0.95 }}
                  />
                </Link>
              </div>
              <div style={{ position: "relative", paddingLeft: 4 }}>
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 11,
                    top: 10,
                    bottom: 10,
                    width: 2,
                    borderRadius: 1,
                    background: "linear-gradient(180deg, var(--accent-2), var(--good))"
                  }}
                />
                {heroTimelinePreview.map((row, idx) => (
                  <div
                    key={row.month}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      marginBottom: idx < heroTimelinePreview.length - 1 ? 18 : 0,
                      position: "relative"
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "var(--card)",
                        border: "2px solid var(--accent-2)",
                        marginTop: 4,
                        flexShrink: 0,
                        zIndex: 1
                      }}
                    />
                    <div style={{ minWidth: 0, paddingTop: 1 }}>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          marginBottom: 4
                        }}
                      >
                        {row.month}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--text)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.35
                        }}
                      >
                        <span style={{ color: "var(--muted)", fontWeight: 500 }}>→ </span>
                        {row.line}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust strip */}
      <section
        aria-label="Product highlights"
        style={{
          marginBottom: "56px",
          padding: "18px 22px",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          boxShadow: "var(--shadow-xs)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px 6px",
            rowGap: 10
          }}
        >
          {trustPoints.map((text, i) => (
            <Fragment key={text}>
              {i > 0 ? (
                <span
                  aria-hidden
                  style={{ color: "var(--line)", fontWeight: 300, userSelect: "none" }}
                >
                  ·
                </span>
              ) : null}
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--muted)",
                  letterSpacing: "0.01em"
                }}
              >
                {text}
              </span>
            </Fragment>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: "60px" }}>
        <p
          className="hero-eyebrow"
          style={{
            color: "var(--accent)",
            marginBottom: "8px",
            textAlign: "center",
            opacity: 1
          }}
        >
          How it works
        </p>
        <h2
          style={{
            margin: "0 0 36px",
            textAlign: "center",
            fontSize: "clamp(1.35rem, 3vw, 1.65rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.2
          }}
        >
          From your numbers to your next payment
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "20px"
          }}
        >
          {howSteps.map((step) => (
            <div
              key={step.n}
              className="card"
              style={{
                margin: 0,
                padding: "26px 22px 28px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "var(--accent-2)",
                  marginBottom: "12px"
                }}
              >
                {step.n}
              </span>
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                  color: "var(--text)"
                }}
              >
                {step.title}
              </h3>
              <p
                className="help tight"
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1.55,
                  color: "var(--muted)"
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: "60px" }}>
        <p
          className="hero-eyebrow"
          style={{
            color: "var(--accent)",
            marginBottom: "8px",
            textAlign: "center",
            opacity: 1
          }}
        >
          Capabilities
        </p>
        <h2
          style={{
            margin: "0 0 10px",
            textAlign: "center",
            fontSize: "clamp(1.35rem, 3vw, 1.65rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.2
          }}
        >
          Everything in one modeling workspace
        </h2>
        <p
          className="help tight"
          style={{
            margin: "0 auto 34px",
            textAlign: "center",
            maxWidth: "580px",
            fontSize: "0.95rem",
            color: "var(--muted)",
            lineHeight: 1.5
          }}
        >
          Same inputs, four strategies — with sequence and timing surfaced, not hidden behind
          a single payoff number.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "20px"
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="card"
              style={{
                margin: 0,
                padding: "24px 22px 26px",
                borderTop: `3px solid ${f.accent}`,
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  lineHeight: 1.3
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1.55,
                  color: "var(--muted)"
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why different */}
      <section
        className="card"
        style={{
          marginBottom: "60px",
          padding: "clamp(28px, 4vw, 40px) clamp(22px, 3vw, 36px)",
          background:
            "linear-gradient(180deg, var(--accent-soft) 0%, var(--card) 42%)",
          border: "1px solid #d4e4f5",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <h2
          style={{
            margin: "0 0 18px",
            fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.25
          }}
        >
          Why Debt GPS System is different
        </h2>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "1.05rem",
            lineHeight: 1.65,
            color: "var(--text)",
            maxWidth: "720px",
            fontWeight: 600
          }}
        >
          Most debt tools stop at a payoff date.
        </p>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: "1.02rem",
            lineHeight: 1.6,
            color: "var(--text)",
            maxWidth: "720px",
            fontWeight: 500
          }}
        >
          Debt GPS shows the path:
        </p>
        <ul
          style={{
            margin: "0 0 18px",
            paddingLeft: "1.25rem",
            fontSize: "0.98rem",
            lineHeight: 1.65,
            color: "var(--text)",
            maxWidth: "700px"
          }}
        >
          <li style={{ marginBottom: 8 }}>Which debt gets paid next</li>
          <li style={{ marginBottom: 8 }}>When each balance disappears</li>
          <li style={{ marginBottom: 0 }}>How your cash flow builds momentum</li>
        </ul>
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: "var(--muted)",
            maxWidth: "700px",
            fontWeight: 500
          }}
        >
          So you&apos;re never guessing what to do next.
        </p>
      </section>

      {/* Final CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "clamp(36px, 5vw, 52px) 24px",
          marginBottom: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1d6bc4 100%)",
          borderRadius: 20,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)"
        }}
      >
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(1.45rem, 3.2vw, 1.85rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            lineHeight: 1.2
          }}
        >
          Get Out of Debt Faster — With the Right Strategy
        </h2>
        <p
          style={{
            margin: "0 auto 16px",
            maxWidth: "560px",
            fontSize: "1.02rem",
            lineHeight: 1.55,
            color: "rgba(248, 250, 252, 0.88)"
          }}
        >
          Unlock your full Debt GPS payoff plan, including your exact payoff order, Banking
          strategy comparison, HELOC comparison, and the complete roadmap to eliminate debt
          faster and reduce interest.
        </p>
        <ul
          style={{
            margin: "0 auto 16px",
            paddingLeft: "1.25rem",
            maxWidth: "520px",
            textAlign: "left",
            fontSize: "0.98rem",
            lineHeight: 1.6,
            color: "rgba(248, 250, 252, 0.9)"
          }}
        >
          <li style={{ marginBottom: 8 }}>See your exact fastest payoff path</li>
          <li style={{ marginBottom: 8 }}>
            Compare Snowball, Avalanche, Banking, and HELOC side by side
          </li>
          <li style={{ marginBottom: 0 }}>Unlock the full step-by-step payoff roadmap</li>
        </ul>
        <p
          style={{
            margin: "0 auto 30px",
            maxWidth: "520px",
            fontSize: "0.95rem",
            lineHeight: 1.5,
            color: "rgba(248, 250, 252, 0.82)",
            fontWeight: 500
          }}
        >
          Start today and see your full strategy instantly.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Link
            className="primary-button"
            href="/calculator"
            style={{
              padding: "15px 28px",
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: 12,
              boxShadow: "0 6px 22px rgba(29, 107, 196, 0.5)",
              minWidth: "168px",
              textAlign: "center"
            }}
          >
            Start Your Plan
          </Link>
          <a
            className="secondary-button"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "15px 24px",
              fontSize: "1rem",
              fontWeight: 650,
              borderRadius: 12,
              background: "rgba(255,255,255,0.14)",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.32)"
            }}
          >
            Book a Free Strategy Call
          </a>
        </div>
      </section>
    </main>
  );
}
