import Link from "next/link";
import SetPasswordForm from "../SetPasswordForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Set a password — Debt GPS System",
  description: "Choose a password so you can reopen your paid plan without a login email next time."
};

export default function SetPasswordPage() {
  return (
    <main className="page dashboard" style={{ maxWidth: 560 }}>
      <header className="hero hero-dashboard" style={{ marginBottom: 24, padding: "28px 24px" }}>
        <p className="hero-eyebrow">Debt GPS System</p>
        <h1 style={{ margin: "0 0 8px" }}>Set a password</h1>
        <p style={{ margin: 0, opacity: 0.92, lineHeight: 1.5 }}>
          You are signed in. Choose a password so next time you can log in from any
          device without waiting on an email.
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
        <SetPasswordForm />
      </div>
      <p className="help tight" style={{ marginTop: 16 }}>
        <Link href="/login" style={{ color: "var(--accent-2)", fontWeight: 600 }}>
          Back to log in
        </Link>
      </p>
    </main>
  );
}
