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

async function readBulkResponseBody(res) {
  const text = await res.text();
  if (!text) {
    return { body: null, bodyRaw: "" };
  }
  try {
    return { body: JSON.parse(text), bodyRaw: text };
  } catch {
    return { body: { _parseError: true, raw: text }, bodyRaw: text };
  }
}

export async function GET(request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const origin = request.nextUrl.origin;
    const bulkUrl = `${origin}/api/bulk-generate-articles`;

    const batches = getDailyBatchCount();
    const authHeader = `Bearer ${process.env.CRON_SECRET}`;
    const batchResponses = [];

    for (let i = 0; i < batches; i++) {
      const res = await fetch(bulkUrl, {
        headers: { Authorization: authHeader }
      });
      const { body, bodyRaw } = await readBulkResponseBody(res);

      batchResponses.push({
        batchIndex: i + 1,
        bulkUrl,
        bulkResponseStatus: res.status,
        bulkResponseOk: res.ok,
        bulkResponseBody: body,
        bulkResponseBodyRaw: bodyRaw
      });
    }

    const allBatchesOk = batchResponses.every((b) => b.bulkResponseOk);
    const failedBatches = batchResponses.filter((b) => !b.bulkResponseOk);

    return Response.json({
      success: allBatchesOk,
      message: allBatchesOk
        ? "Daily generation completed; all bulk batch calls succeeded."
        : `One or more bulk batch calls failed (${failedBatches.length} of ${batches}). See batchResponses for bulkResponseStatus and bulkResponseBody.`,
      batchesAttempted: batches,
      batchResponses,
      bulkSummary: {
        allSucceeded: allBatchesOk,
        failedCount: failedBatches.length,
        statuses: batchResponses.map((b) => ({
          batchIndex: b.batchIndex,
          bulkResponseStatus: b.bulkResponseStatus,
          bulkResponseOk: b.bulkResponseOk
        }))
      }
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
