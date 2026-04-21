export async function GET() {
  try {
    const hasKey = !!process.env.OPENAI_API_KEY;

    return new Response(
      JSON.stringify({ hasKey }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Test route failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
