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
      redirect("/calculator?access=paid");
    }

    return redirect("/");
  } catch (err) {
    console.error("Stripe verification error:", err);
    return redirect("/");
  }
}
