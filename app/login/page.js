import Link from "next/link";
import LoginBoxSimple from "../LoginBoxSimple";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Log in — Debt GPS System",
  description: "Email yourself a login link to reopen your paid Debt GPS plan on this device."
};

export default function LoginPage({ searchParams }) {
  const hasError = Boolean(searchParams?.error);

  return (
    <main className="page dashboard" style={{ maxWidth: 560 }}>
      <header className="hero hero-dashboard" style={{ marginBottom: 24, padding: "28px 24px" }}>
        <p className="hero-eyebrow">Debt GPS System</p>
        <h1 style={{ margin: "0 0 8px" }}>Already a member?</h1>
        <p style={{ margin: 0, opacity: 0.92, lineHeight: 1.5 }}>
          Enter the email you used at checkout. We’ll send a login link so you can
          open your paid plan on this browser or device.
        </p>
      </header>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          padding: 20
        }}
      >
        {hasError ? (
          <p className="help tight" style={{ margin: "0 0 12px", color: "#b91c1c" }} role="alert">
            That login link expired or could not be used. Request a new one below.
          </p>
        ) : null}
        <LoginBoxSimple redirectTo="/calculator" />
      </div>

      <p className="help tight" style={{ marginTop: 16 }}>
        New here?{" "}
        <Link href="/calculator" style={{ color: "var(--accent-2)", fontWeight: 600 }}>
          Run the calculator
        </Link>
      </p>
    </main>
  );
}
