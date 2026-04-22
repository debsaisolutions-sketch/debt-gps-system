export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    // run bulk generator 5 times (5 x 5 = 25 articles max per run)
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/bulk-generate-articles`);
    }

    return Response.json({
      success: true,
      message: "Daily generation completed"
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
