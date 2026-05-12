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

export async function GET(request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) {
    return unauthorized;
  }

  const batch = await generateSeoArticleBatch();

  if (batch.httpStatus === 500) {
    return Response.json({ success: false, error: batch.error }, { status: 500 });
  }

  if (batch.success && batch.processed === 0 && batch.message) {
    return Response.json({
      success: true,
      message: batch.message,
      processed: batch.processed
    });
  }

  return Response.json({
    success: true,
    processed: batch.processed,
    results: batch.results
  });
}
