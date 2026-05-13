'use client';
import Link from "next/link";
import Image from "next/image";
const CALENDLY_URL = "https://calendly.com/debsaisolutions/30min";
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/4gM00k3KP2I94IQfPn28804";

const trustPoints = [
  "Compare four payoff routes side by side",
  "Built for real household cash flow",
  "Start free, upgrade when ready",
  "See your next move clearly",
  "Month-by-month timeline you can follow"
];

const howSteps = [
  {
    n: "01",
    icon: "clipboard",
    title: "Enter your debts",
    body: "Add balances, rates, and payments in one place."
  },
  {
    n: "02",
    icon: "compare",
    title: "Compare your options",
    body: "See Snowball and Avalanche first, then unlock advanced paths like HELOC and Banking Strategy when you're ready."
  },
  {
    n: "03",
    icon: "timeline",
    title: "Follow the plan",
    body: "See what gets paid next, month by month — so you are not guessing."
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
    body: "Run both standard paths on the same debts so you can weigh quick wins against interest-efficient sequencing — with your numbers, not guesswork.",
    accent: "var(--accent-2)"
  },
  {
    title: "Banking Strategy modeling",
    body: "For those who qualify, see how policy-backed mechanics can sit next to traditional paydown — capital, cash flow, and payoff in one workspace (not a fit for everyone).",
    accent: "#6d28d9"
  },
  {
    title: "HELOC scenario comparison",
    body: "If a HELOC is an option for you, model it with your limit and cash flow next to standard routes — without juggling spreadsheets.",
    accent: "#0d9488"
  },
  {
    title: "Live payoff timeline",
    body: "A clear, month-by-month view of status and next target — so the sequence is not a black box when life gets noisy.",
    accent: "var(--accent)"
  }
];

function HowStepIcon({ name }) {
  const stroke = "var(--accent)";
  const svgProps = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true
  };
  if (name === "clipboard") {
    return (
      <svg {...svgProps}>
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 12h6M9 16h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "compare") {
    return (
      <svg {...svgProps}>
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg {...svgProps}>
      <path
        d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LANDING_PREMIUM_CSS = `
.landing-page .landing-page-header-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 28px;
  margin-bottom: clamp(24px, 4vw, 40px);
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}
.landing-page .landing-nav-link {
  color: rgba(248, 250, 252, 0.94);
  font-size: 0.9375rem;
  font-weight: 700;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 10px;
  text-shadow: 0 1px 2px rgba(15, 23, 42, 0.22);
  transition: background 0.15s ease, color 0.15s ease;
}
.landing-page .landing-nav-link:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
.landing-page .landing-nav-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #0b1220 !important;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.landing-page .landing-nav-pill:hover {
  transform: translateY(-1px);
  background: #fff;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.22);
}
.landing-page .landing-cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 188px;
  padding: 15px 28px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.2;
  color: #fff !important;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background: linear-gradient(180deg, #2f92f0 0%, #1d6bc4 100%);
  box-shadow:
    0 10px 28px rgba(15, 23, 42, 0.38),
    0 1px 0 rgba(255, 255, 255, 0.14) inset;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}
.landing-page .landing-cta-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow:
    0 14px 38px rgba(29, 107, 196, 0.48),
    0 1px 0 rgba(255, 255, 255, 0.18) inset;
}
.landing-page .landing-cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 188px;
  padding: 15px 28px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.2;
  color: #0f172a !important;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.landing-page .landing-cta-secondary:hover {
  transform: translateY(-2px);
  background: #fff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
}
.landing-page .premium-card {
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 14px rgba(15, 23, 42, 0.06);
  border: 1px solid var(--line);
}
.landing-page .premium-card:hover {
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.1);
  border-color: rgba(29, 107, 196, 0.22);
  transform: translateY(-3px);
}
.landing-page .premium-feature-card {
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 14px rgba(15, 23, 42, 0.06);
  border: 1px solid var(--line);
}
.landing-page .premium-feature-card:hover {
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.1);
  border-color: rgba(29, 107, 196, 0.2);
  transform: translateY(-3px);
}
.landing-page .landing-trust-chip {
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.landing-page .landing-trust-chip:hover {
  border-color: rgba(29, 107, 196, 0.35);
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);
}
.landing-page .landing-footer-premium {
  margin-top: 28px;
  margin-bottom: 16px;
  padding: 28px 20px 22px;
  border-top: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.65) 0%, transparent 100%);
  border-radius: 16px 16px 0 0;
}
.landing-page .landing-footer-premium-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px 32px;
  margin-bottom: 22px;
  text-align: left;
}
.landing-page .landing-footer-brand-title {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text);
}
.landing-page .landing-footer-trust {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--muted);
  font-weight: 500;
  max-width: 320px;
}
.landing-page .landing-footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  align-items: center;
}
.landing-page .landing-footer-nav a {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}
.landing-page .landing-footer-nav a:hover {
  text-decoration: underline;
}
.landing-page .landing-footer-bottom {
  padding-top: 18px;
  border-top: 1px solid var(--line);
  text-align: center;
}
.landing-page .landing-hero-mockup-outer {
  flex: 1 1 280px;
  max-width: min(100%, 400px);
  min-width: min(100%, 260px);
}
@media (min-width: 900px) {
  .landing-page .landing-hero-mockup-outer {
    flex: 1 1 300px;
    max-width: min(100%, 452px);
  }
}
.landing-page .landing-hero-mockup-card {
  border-radius: 18px;
  padding: clamp(20px, 2.2vw, 28px) clamp(18px, 2vw, 26px);
}
`;

export default function LandingPage() {
  const year = new Date().getFullYear();
  return (
    <main className="page landing-page" style={{ maxWidth: "1160px", paddingTop: "32px" }}>
      <style dangerouslySetInnerHTML={{ __html: LANDING_PREMIUM_CSS }} />
      {/* Hero */}
      <header
        className="hero hero-dashboard"
        style={{
          marginBottom: "44px",
          padding: "clamp(28px, 4vw, 48px) clamp(22px, 3vw, 40px)",
          borderRadius: "22px"
        }}
      >
        <div className="landing-page-header-bar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              minWidth: 0
            }}
          >
            <Image src="/logo.png" alt="" width={36} height={36} style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "#f8fafc",
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 1.15,
                  textShadow: "0 1px 2px rgba(15, 23, 42, 0.2)"
                }}
              >
                Debt GPS System
              </div>
              <div
                style={{
                  color: "rgba(248, 250, 252, 0.9)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: 1.38,
                  marginTop: 3
                }}
              >
                Debt strategy modeling for real-world payoff decisions
              </div>
            </div>
          </div>
          <nav
            aria-label="Page sections"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 4,
              justifyContent: "flex-end"
            }}
          >
            <a className="landing-nav-link" href="#features">
              Features
            </a>
            <a className="landing-nav-link" href="#how-it-works">
              How it works
            </a>
            <a className="landing-nav-link" href="#pricing">
              Pricing
            </a>
            <Link className="landing-nav-pill" href="/calculator">
              See your strategy
            </Link>
          </nav>
        </div>
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
              Smarter debt payoff clarity
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
              {"Don't Just Get Out of Debt. Build a Plan That Helps You Stay Out."}
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
              Debt GPS helps you compare Snowball, Avalanche, HELOC, and Banking Strategy using
              your real numbers — so you can see your payoff options, build capital where possible,
              and stop guessing your way out of debt.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center"
              }}
            >
              <Link className="landing-cta-primary" href="/calculator">
                Run My Debt GPS Calculator
              </Link>
              <a
                className="landing-cta-secondary"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Free Strategy Call
              </a>
            </div>
            <p
              style={{
                margin: "14px 0 0",
                fontSize: "0.9rem",
                lineHeight: 1.55,
                color: "rgba(248, 250, 252, 0.9)",
                maxWidth: "560px",
                fontWeight: 500
              }}
            >
              You are not left alone with a calculator. After running your numbers, you can
              schedule a free consultation to review your options with a real person.
            </p>
            <p
              className="help tight"
              style={{
                margin: "12px 0 0",
                fontSize: "0.85rem",
                lineHeight: 1.45,
                color: "rgba(248, 250, 252, 0.85)",
                maxWidth: "560px"
              }}
            >
              Start with a 7-day free trial. Founding Member access is $47/month while this
              launch offer is open — save $20/month compared with the regular $67/month price if
              you cancel and return later.
            </p>
          </div>

          {/* Mockup / value card */}
          <div className="landing-hero-mockup-outer">
            <div
              className="landing-hero-mockup-card"
              style={{
                background: "rgba(255,255,255,0.97)",
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

      {/* Founder promo video */}
      <section
        aria-labelledby="promo-video-heading"
        style={{
          marginBottom: "48px",
          padding: "clamp(14px, 2.2vw, 22px) clamp(18px, 3vw, 28px)",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          boxShadow: "var(--shadow-xs)"
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <h2
            id="promo-video-heading"
            style={{
              margin: "0 0 10px",
              fontSize: "clamp(1.35rem, 3vw, 1.65rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.2
            }}
          >
            See How Debt GPS Works
          </h2>
          <p
            style={{
              margin: "0 auto 16px",
              maxWidth: "560px",
              fontSize: "clamp(0.98rem, 2vw, 1.05rem)",
              lineHeight: 1.62,
              color: "var(--muted)",
              fontWeight: 450
            }}
          >
            In less than a minute, see how Debt GPS helps you start with your numbers, compare
            payoff routes, and understand when a free consultation may help.
          </p>
          <div
            style={{
              width: "100%",
              maxWidth: "min(100%, 360px)",
              margin: "0 auto 16px",
              aspectRatio: "9 / 16",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--line)",
              background: "#0f172a"
            }}
          >
            <video
              controls
              playsInline
              preload="metadata"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "contain"
              }}
            >
              <source src="/videos/debt-gps-founder-video.mp4" type="video/mp4" />
            </video>
          </div>
          <Link className="landing-cta-primary" href="/calculator">
            Run My Debt GPS Calculator
          </Link>
        </div>
      </section>

      {/* Problem: plans vs life */}
      <section
        id="problem"
        aria-labelledby="problem-heading"
        style={{
          marginBottom: "48px",
          padding: "clamp(26px, 3vw, 36px) clamp(22px, 3vw, 32px)",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          boxShadow: "var(--shadow-xs)"
        }}
      >
        <h2
          id="problem-heading"
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(1.2rem, 2.6vw, 1.45rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.25,
            maxWidth: "720px"
          }}
        >
          Most debt payoff plans only answer one question: Which debt should I pay first?
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
          {"But they do not answer the bigger question: What happens if life happens before I'm done?"}
        </p>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "1rem",
            lineHeight: 1.62,
            color: "var(--muted)",
            maxWidth: "720px"
          }}
        >
          Car repairs. Medical bills. Job changes. Family emergencies.
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--muted)",
            maxWidth: "720px"
          }}
        >
          Traditional payoff plans can work, but they can also leave people financially fragile
          if the plan does not account for emergencies, cash flow, and capital.
        </p>
      </section>

      {/* Trust strip */}
      <section
        aria-label="Product highlights"
        style={{
          marginBottom: "56px",
          padding: "22px 26px",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12
          }}
        >
          <p className="landing-trust-lead">
            For households who want payoff clarity — without shame, hype, or a one-size-fits-all script
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px 12px",
              rowGap: 12
            }}
          >
            {trustPoints.map((text) => (
              <span key={text} className="landing-trust-chip">
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ marginBottom: "76px" }}>
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
            margin: "0 0 40px",
            textAlign: "center",
            fontSize: "clamp(1.35rem, 3vw, 1.65rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.2
          }}
        >
          From your numbers to a clearer next step
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "28px"
          }}
        >
          {howSteps.map((step) => (
            <div
              key={step.n}
              className="card premium-card"
              style={{
                margin: 0,
                padding: "34px 28px 36px",
                position: "relative",
                overflow: "hidden",
                borderRadius: 16
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 14
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--accent-soft)",
                    border: "1px solid rgba(29, 107, 196, 0.15)",
                    flexShrink: 0
                  }}
                >
                  <HowStepIcon name={step.icon} />
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    color: "var(--accent-2)"
                  }}
                >
                  {step.n}
                </span>
              </div>
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
                  fontSize: "0.96rem",
                  lineHeight: 1.62,
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
      <section id="features" style={{ marginBottom: "76px" }}>
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
            fontSize: "1rem",
            color: "var(--muted)",
            lineHeight: 1.6
          }}
        >
          Same inputs, four strategies — with sequence and cash flow surfaced, not hidden behind
          a single headline.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "28px"
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="card premium-feature-card"
              style={{
                margin: 0,
                padding: "32px 28px 34px",
                borderTop: `3px solid ${f.accent}`,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderRadius: 16
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
                  fontSize: "0.96rem",
                  lineHeight: 1.62,
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
        className="card premium-card"
        style={{
          marginBottom: "76px",
          padding: "clamp(32px, 4vw, 44px) clamp(26px, 3vw, 40px)",
          background:
            "linear-gradient(180deg, var(--accent-soft) 0%, var(--card) 42%)",
          border: "1px solid #d4e4f5",
          boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08)",
          borderRadius: 18
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
          Debt GPS compares Snowball, Avalanche, HELOC Strategy, and Banking Strategy side by
          side — using the same inputs — so you can see how each route behaves for your
          situation.
        </p>
        <p
          style={{
            margin: "0 0 18px",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--text)",
            maxWidth: "720px",
            fontWeight: 600
          }}
        >
          Not everyone qualifies for every option, but you deserve to see what is possible
          before guessing.
        </p>
        <ul
          style={{
            margin: "0 0 18px",
            paddingLeft: "1.25rem",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "var(--text)",
            maxWidth: "700px"
          }}
        >
          <li style={{ marginBottom: 8 }}>Snowball — quick wins and momentum</li>
          <li style={{ marginBottom: 8 }}>Avalanche — interest-smart sequencing</li>
          <li style={{ marginBottom: 8 }}>HELOC Strategy — when a line of credit is an option for you</li>
          <li style={{ marginBottom: 0 }}>
            Banking Strategy — for those who qualify, modeled next to traditional paydown
          </li>
        </ul>
        <p
          style={{
            margin: 0,
            fontSize: "0.98rem",
            lineHeight: 1.62,
            color: "var(--muted)",
            maxWidth: "700px",
            fontWeight: 500
          }}
        >
          No single path fits everyone. The goal is clarity, fit, and a plan that still makes
          sense when life does not go perfectly to script.
        </p>
      </section>

      {/* Banking Strategy — curiosity (not for everyone) */}
      <section
        id="banking-strategy"
        aria-labelledby="banking-heading"
        style={{
          marginBottom: "48px",
          padding: "clamp(26px, 3vw, 36px) clamp(22px, 3vw, 32px)",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          boxShadow: "var(--shadow-xs)"
        }}
      >
        <h2
          id="banking-heading"
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(1.15rem, 2.4vw, 1.35rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.25,
            maxWidth: "720px"
          }}
        >
          Curious about Banking Strategy?
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--muted)",
            maxWidth: "720px"
          }}
        >
          For those who qualify, the Banking Strategy may help you build capital while paying off
          debt — and because it is built around properly designed life insurance, it can also
          create protection for your family if something serious happens. It is not a guarantee
          of results, and it is not the right fit for everyone. Debt GPS lets you see how it
          compares when it applies to your situation — without pressure to choose it.
        </p>
      </section>

      {/* Free consultation */}
      <section
        id="consultation"
        aria-labelledby="consultation-heading"
        style={{
          marginBottom: "48px",
          padding: "clamp(26px, 3vw, 36px) clamp(22px, 3vw, 32px)",
          background:
            "linear-gradient(180deg, var(--accent-soft) 0%, var(--card) 42%)",
          border: "1px solid #d4e4f5",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08)"
        }}
      >
        <h2
          id="consultation-heading"
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(1.2rem, 2.6vw, 1.45rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.25,
            maxWidth: "640px"
          }}
        >
          Numbers are helpful. Guidance matters too.
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "1.02rem",
            lineHeight: 1.65,
            color: "var(--text)",
            maxWidth: "640px",
            fontWeight: 500
          }}
        >
          After using Debt GPS, you can schedule a free consultation so a real person can help
          you understand what your results mean.
        </p>
      </section>

      {/* Founding member offer */}
      <section
        id="founding-offer"
        aria-labelledby="founding-heading"
        className="card premium-card"
        style={{
          marginBottom: "48px",
          padding: "clamp(28px, 3.5vw, 40px) clamp(24px, 3vw, 36px)",
          borderRadius: 18
        }}
      >
        <h2
          id="founding-heading"
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(1.2rem, 2.6vw, 1.45rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.25
          }}
        >
          Founding Member pricing
        </h2>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "1.02rem",
            lineHeight: 1.65,
            color: "var(--text)",
            maxWidth: "720px",
            fontWeight: 600
          }}
        >
          Founding Member access is currently available for $47/month while this launch offer is
          open. Keep your founding price as long as your subscription stays active.
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.98rem",
            lineHeight: 1.62,
            color: "var(--muted)",
            maxWidth: "720px"
          }}
        >
          Start with a 7-day free trial. The regular price is $67/month if you cancel and return
          later — Founding Member pricing saves $20/month while your founding subscription stays
          active.
        </p>
      </section>

      {/* Final CTA */}
      <section
        id="pricing"
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
          Start With Your Numbers. Find Your Route.
        </h2>
        <p
          style={{
            margin: "0 auto 24px",
            maxWidth: "560px",
            fontSize: "1.02rem",
            lineHeight: 1.62,
            color: "rgba(248, 250, 252, 0.88)"
          }}
        >
          Find the payoff strategy that makes sense for your numbers, your cash flow, and your
          life — so you can get out of debt without staying one emergency away from starting over.
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
          <Link className="landing-cta-primary" href="/calculator">
            Run My Debt GPS Calculator
          </Link>
          <a
            className="landing-cta-secondary"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a Free Strategy Call
          </a>
        </div>
      </section>

      <footer className="landing-footer landing-footer-premium">
        <div className="landing-footer-premium-grid">
          <div>
            <p className="landing-footer-brand-title">Debt GPS System</p>
            <p className="landing-footer-trust">
              Modeling and comparison tools for household payoff decisions — explore scenarios,
              not one-size-fits-all advice.
            </p>
          </div>
          <nav className="landing-footer-nav" aria-label="Site links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link href="/calculator">Calculator</Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </nav>
        </div>
        <div className="landing-footer-bottom">
          <nav className="landing-footer-links" aria-label="Legal and contact links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="mailto:info@debtgpssystem.com">info@debtgpssystem.com</a>
          </nav>
          <p className="landing-footer-copy">© {year} Debt GPS System. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
