import { isCronAuthorized } from "../../lib/adminAccess";
import { generateSeoArticleBatch } from "../../lib/generateSeoArticleBatch";

function requireCronAuth(request) {
  if (isCronAuthorized(request)) return null;
  return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
