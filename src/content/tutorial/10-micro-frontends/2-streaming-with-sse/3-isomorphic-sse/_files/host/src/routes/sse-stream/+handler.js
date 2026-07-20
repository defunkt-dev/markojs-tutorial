// BFF for the isomorphic SSE lesson: the browser can't reach the remote's port directly, so
// the client re-fetch of the stream goes through the host, which proxies the remote's SSE
// endpoint back to it (same-origin). Server-side it does the same hop.
export async function GET({ platform: { request } }) {
  const slotName = (request.query || {}).slotName || "main";
  const upstream = await fetch(
    `http://localhost:3001/remote-app-sse-single-slot?slotName=${slotName}&dt=${Date.now()}`,
    { headers: { Accept: "text/event-stream" } }
  );
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" },
  });
}
