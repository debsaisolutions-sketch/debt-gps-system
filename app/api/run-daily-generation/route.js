import { generateSeoArticleBatch } from "../../lib/generateSeoArticleBatch";

function requireCronAuth(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const authHeader = request.headers.get("authorization");
  const xCronSecret = request.headers.get("x-cron-secret");
  const querySecret = new URL(request.url).searchParams.get("cron_secret");
  const bearerOk = authHeader === `Bearer ${secret}`;
  const secretHeaderOk = xCronSecret === secret;
  const queryOk = querySecret === secret;
  if (!bearerOk && !secretHeaderOk && !queryOk) {
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
    const batches = getDailyBatchCount();
    const batchResponses = [];

    for (let i = 0; i < batches; i++) {
      const batch = await generateSeoArticleBatch();
      batchResponses.push({
        batchIndex: i + 1,
        success: batch.success,
        processed: batch.processed,
        results: batch.results,
        message: batch.message,
        error: batch.error,
        httpStatus: batch.httpStatus
      });
    }

    const allBatchesOk = batchResponses.every((b) => b.success !== false);
    const failedBatches = batchResponses.filter((b) => b.success === false);

    return Response.json({
      success: allBatchesOk,
      message: allBatchesOk
        ? "Daily generation completed; all batches succeeded."
        : `One or more batches failed (${failedBatches.length} of ${batches}). See batchResponses for details.`,
      batchesAttempted: batches,
      batchResponses,
      bulkSummary: {
        allSucceeded: allBatchesOk,
        failedCount: failedBatches.length,
        statuses: batchResponses.map((b) => ({
          batchIndex: b.batchIndex,
          success: b.success,
          httpStatus: b.httpStatus
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
