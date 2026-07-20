// Pipe the remote app's asset requests through the host, so the browser (which can reach the
// host) can load the remote's JS/CSS even though it can't reach the remote's port directly.
export async function GET(context) {
  const path = context.url.pathname.replace(/^\/remote-assets\//, "");
  const upstream = await fetch(`http://localhost:3001/assets/${path}`);
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") || "application/octet-stream" },
  });
}
