import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Debt GPS System",
  description:
    "How Debt GPS System collects, uses, and protects your information, including cookies and third-party services."
};

const LAST_UPDATED = "May 17, 2026";
const CONTACT_EMAIL = "info@debtgpssystem.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="page" style={{ maxWidth: "760px", paddingTop: "32px", paddingBottom: "48px" }}>
      <header className="hero-dashboard" style={{ marginBottom: "24px" }}>
        <p className="hero-eyebrow" style={{ color: "rgba(248, 250, 252, 0.85)" }}>
          Legal
        </p>
        <h1 style={{ marginBottom: "12px", color: "#f8fafc" }}>Privacy Policy</h1>
        <p className="hero-lead" style={{ color: "rgba(248, 250, 252, 0.92)", maxWidth: "unset" }}>
          Debt GPS System (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates debtgpssystem.com and related
          tools. This policy explains what we collect, how we use it, and your choices.
        </p>
      </header>

      <p className="help" style={{ marginBottom: "20px", fontSize: "0.9rem", color: "var(--muted)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Information we collect</h2>
        <p className="help" style={{ marginBottom: "12px", lineHeight: 1.65 }}>
          We may collect information you provide directly, such as your name, email address,
          financial inputs you enter in the calculator (income, expenses, debts, strategy
          choices), notes, and messages you send us. If you book a call or subscribe to a
          paid plan, we may also receive billing-related identifiers from our payment
          processor (we do not store full payment card numbers on our servers).
        </p>
        <p className="help" style={{ marginBottom: 0, lineHeight: 1.65 }}>
          We automatically collect limited technical data when you use the site, such as
          browser type, device information, pages viewed, and approximate usage patterns
          needed to operate and secure the service.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>How we use your information</h2>
        <ul className="help" style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.65 }}>
          <li>Provide the Debt GPS calculator, projections, and saved scenarios</li>
          <li>Unlock free or paid access and remember your subscription status</li>
          <li>Respond to requests and send follow-up related to your account or plan</li>
          <li>Improve the product, fix errors, and prevent abuse or fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Cookies and local storage</h2>
        <p className="help" style={{ marginBottom: "12px", lineHeight: 1.65 }}>
          We use cookies and similar technologies where needed to run the site. For example,
          a signed cookie may be set after a successful paid checkout so you can access
          premium features without signing in on every visit.
        </p>
        <p className="help" style={{ marginBottom: 0, lineHeight: 1.65 }}>
          The calculator may save scenario data in your browser&apos;s <strong>local storage</strong> on
          your device so you can continue where you left off. That data stays on your device
          unless you clear it or save a copy to our cloud (when that feature is available and
          you are signed in). Third-party widgets on our site may set their own cookies; see
          Third-party services below.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Third-party services</h2>
        <p className="help" style={{ marginBottom: "12px", lineHeight: 1.65 }}>
          We use trusted providers to host data, process payments, and support marketing and
          scheduling. They process information only as needed to perform services for us and
          under their own privacy terms:
        </p>
        <ul className="help" style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.65 }}>
          <li>
            <strong>Supabase</strong> — authentication, database hosting, and stored scenarios or
            content where applicable
          </li>
          <li>
            <strong>Stripe</strong> — payment processing and subscription checkout
          </li>
          <li>
            <strong>GoHighLevel / LeadConnector</strong> — CRM, contact records, and lead routing
            when you submit your email or interact with our funnels
          </li>
          <li>
            <strong>GoHighLevel booking</strong> — scheduling strategy calls (when you book through our links)
          </li>
        </ul>
        <p className="help" style={{ marginTop: "12px", marginBottom: 0, lineHeight: 1.65 }}>
          Links to other websites (for example payment or scheduling pages) are governed by
          those sites&apos; policies, not this one.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Sharing of information</h2>
        <p className="help" style={{ marginBottom: 0, lineHeight: 1.65 }}>
          We do not sell your personal information. We share data with service providers
          listed above, when you direct us to (for example booking a call), when required by
          law, or to protect our rights and users. We may share aggregated or de-identified
          data that cannot reasonably identify you.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Data retention and security</h2>
        <p className="help" style={{ marginBottom: 0, lineHeight: 1.65 }}>
          We keep information only as long as needed for the purposes described here, unless a
          longer period is required by law. We use reasonable administrative and technical
          safeguards; no method of transmission or storage is completely secure.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Your rights and choices</h2>
        <p className="help" style={{ marginBottom: "12px", lineHeight: 1.65 }}>
          Depending on where you live, you may have rights to access, correct, delete, or
          export personal information we hold about you, to object to or restrict certain
          processing, and to withdraw consent where processing is consent-based. You can:
        </p>
        <ul className="help" style={{ marginBottom: "12px", paddingLeft: "1.25rem", lineHeight: 1.65 }}>
          <li>Clear browser local storage to remove locally saved calculator scenarios</li>
          <li>Block or delete cookies through your browser settings (some features may not work)</li>
          <li>Opt out of marketing emails using the unsubscribe link in those messages</li>
          <li>Contact us to request access, correction, or deletion of data we control</li>
        </ul>
        <p className="help" style={{ marginBottom: 0, lineHeight: 1.65 }}>
          If you are in the EEA, UK, or California, you may have additional rights under
          applicable law (including the right to lodge a complaint with a supervisory
          authority). We will not discriminate against you for exercising privacy rights.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "10px" }}>Children</h2>
        <p className="help" style={{ marginBottom: 0, lineHeight: 1.65 }}>
          The service is not directed to children under 13 (or 16 where applicable). We do not
          knowingly collect personal information from children. Contact us if you believe a
          child has provided us data.
        </p>
      </section>

      <section className="card" style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "10px" }}>Changes and contact</h2>
        <p className="help" style={{ marginBottom: "12px", lineHeight: 1.65 }}>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top
          will change when we do. Continued use of the site after changes means you accept
          the revised policy.
        </p>
        <p className="help" style={{ marginBottom: "16px", lineHeight: 1.65 }}>
          Questions or privacy requests:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <Link className="button-link primary-button" href="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}
