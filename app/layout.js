import "./globals.css";
import FaithChatWidget from "./components/FaithChatWidget";
import SuppressExternalChatWidgets from "./components/SuppressExternalChatWidgets";

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
        <SuppressExternalChatWidgets />
        <FaithChatWidget />
      </body>
    </html>
  );
}
