import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Processing payment...</h2>
        <p>If you were not redirected automatically, please return to the calculator.</p>
      </div>
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.error("Missing STRIPE_SECRET_KEY");
    return redirect("/");
  }

  try {
    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20"
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session?.payment_status === "paid") {
      return (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
sessionStorage.setItem("paid_user", "true");
setTimeout(function () {
  window.location.href = "/calculator";
}, 4000);
              `.trim()
            }}
          />
          <main
            style={{
              maxWidth: 560,
              margin: "0 auto",
              padding: "clamp(32px, 5vw, 56px) 24px 48px"
            }}
          >
            <h1
              style={{
                margin: "0 0 16px",
                fontSize: "clamp(1.35rem, 3vw, 1.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                color: "var(--text, #0f172a)"
              }}
            >
              You&apos;re In — Your Debt GPS Plan Is Ready
            </h1>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: "1.05rem",
                lineHeight: 1.55,
                color: "var(--text, #0f172a)",
                fontWeight: 600
              }}
            >
              Your payment was received and your access has been activated.
            </p>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "var(--muted, #475569)"
              }}
            >
              Open the calculator, enter your numbers, and see your full payoff strategy —
              including your exact payoff order, Banking comparison, HELOC comparison, and full
              roadmap.
            </p>
            <ul
              style={{
                margin: "0 0 24px",
                paddingLeft: "1.25rem",
                fontSize: "0.98rem",
                lineHeight: 1.6,
                color: "var(--muted, #475569)"
              }}
            >
              <li style={{ marginBottom: 8 }}>
                Build your fastest payoff plan with your real numbers
              </li>
              <li style={{ marginBottom: 8 }}>
                Compare Snowball, Avalanche, Banking, and HELOC side by side
              </li>
              <li style={{ marginBottom: 0 }}>
                See the full payoff roadmap and strategy details instantly
              </li>
            </ul>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: "0.95rem",
                fontWeight: 650,
                color: "var(--text, #0f172a)"
              }}
            >
              Start now while your numbers are fresh.
            </p>
            <Link
              href="/calculator"
              className="primary-button"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 12,
                textAlign: "center",
                textDecoration: "none"
              }}
            >
              Open My Debt GPS Plan
            </Link>
          </main>
        </>
      );
    }

    return redirect("/");
  } catch (err) {
    console.error("Stripe verification error:", err);
    return redirect("/");
  }
}
