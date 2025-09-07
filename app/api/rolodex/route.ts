export const runtime = "nodejs"; // ensure Node runtime (SMTP libs need Node sometimes)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expecting: action, user_external_id, and other fields per your branches
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.N8N_BASIC_AUTH) headers["Authorization"] = process.env.N8N_BASIC_AUTH;

    const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (e: any) {
    return new Response("Proxy error: " + e?.message, { status: 500 });
  }
}1  