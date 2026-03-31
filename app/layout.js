import "./globals.css";

export const metadata = {
  title: "Debt & Capital Strategy Dashboard",
  description:
    "Snowball, Avalanche, Banking Strategy, and HELOC models with live projections and capital vehicles."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
