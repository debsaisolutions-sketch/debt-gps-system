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
    const secret = process.env.CRON_SECRET;
    const bulkPath = "/api/bulk-generate-articles";
    const bulkUrl = `${origin}${bulkPath}?cron_secret=${encodeURIComponent(secret)}`;

    const batches = getDailyBatchCount();
    const batchResponses = [];

    console.log({
      route: "run-daily-generation",
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      bulkPath,
      bulkUrlIncludesCronSecretParam: bulkUrl.includes("cron_secret="),
      sendingAuthorizationHeader: true,
      sendingXCronSecretHeader: true,
      origin: request.nextUrl.origin
    });

    for (let i = 0; i < batches; i++) {
      const res = await fetch(bulkUrl, {
        headers: {
          Authorization: `Bearer ${secret}`,
          "X-Cron-Secret": secret
        }
      });
      const { body, bodyRaw } = await readBulkResponseBody(res);

      batchResponses.push({
        batchIndex: i + 1,
        bulkPath,
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
