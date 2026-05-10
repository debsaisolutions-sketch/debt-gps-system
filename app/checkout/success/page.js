import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Processing payment...</h2>
        <p>If you were not redirected automatically, please return to the calculator.</p>
      </div>
    );
  }

  redirect(
    `/api/checkout/complete?session_id=${encodeURIComponent(sessionId)}`
  );
}
