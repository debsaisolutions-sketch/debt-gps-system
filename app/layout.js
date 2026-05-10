import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Debt & Capital Strategy Dashboard",
  description:
    "Snowball, Avalanche, Banking Strategy, and HELOC models with live projections and capital vehicles."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          id="leadconnector-chat-widget"
          src="https://widgets.leadconnectorhq.com/loader.js"
          strategy="afterInteractive"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="69dfa8070c3ae50a478f21f3"
        />
      </body>
    </html>
  );
}
