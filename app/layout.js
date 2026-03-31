import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Debt & Capital Strategy Dashboard",
  description:
    "Snowball, Avalanche, Banking Strategy, and HELOC models with live projections and capital vehicles."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "14px 28px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 44,
                width: "100%",
                gap: 24,
              }}
            >
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  textDecoration: "none",
                  color: "#0f172a",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    display: "block",
                    height: 40,
                    width: 120,
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="True Freedom Financial"
                    fill
                    sizes="120px"
                    style={{
                      objectFit: "contain",
                      objectPosition: "left center",
                    }}
                    priority
                  />
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  True Freedom Financial
                </span>
              </Link>
              <div
                aria-hidden="true"
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  minHeight: 40,
                }}
              />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
