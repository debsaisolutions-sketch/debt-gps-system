function requireCronAuth(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const expected = `Bearer ${secret}`;
  const authHeader = request.headers.get("authorization");
  if (authHeader !== expected) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function getDailyBatchCount() {
  const raw = process.env.DAILY_ARTICLE_BATCHES;
  if (raw === undefined || raw === "") {
    return 1;
  }
  const n = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return n;
}

export async function GET(request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      return Response.json(
        { success: false, error: "NEXT_PUBLIC_SITE_URL is not configured" },
        { status: 500 }
      );
    }

    const batches = getDailyBatchCount();
    const authHeader = `Bearer ${process.env.CRON_SECRET}`;
    const batchResponses = [];

    for (let i = 0; i < batches; i++) {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/bulk-generate-articles`, {
        headers: { Authorization: authHeader }
      });
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      batchResponses.push({
        batchIndex: i + 1,
        status: res.status,
        ok: res.ok,
        body
      });
    }

    return Response.json({
      success: true,
      message: "Daily generation completed",
      batchesAttempted: batches,
      batchResponses
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
