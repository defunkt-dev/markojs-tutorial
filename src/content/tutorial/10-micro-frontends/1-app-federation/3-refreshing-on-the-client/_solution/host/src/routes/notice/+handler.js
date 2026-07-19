export async function GET() {
  const res = await fetch("http://localhost:3001/fragment");
  return new Response(await res.text(), {
    headers: { "Content-Type": "text/html" },
  });
}
