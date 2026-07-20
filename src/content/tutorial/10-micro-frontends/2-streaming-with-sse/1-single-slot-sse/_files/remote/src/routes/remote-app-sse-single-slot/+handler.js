// Consumes the /api SSE stream and re-emits each message as an SSE frame carrying
// RENDERED HTML for one slot. The host's <micro-frame-slot slot="..."> drops each frame's
// HTML into the matching spot.
import template from "./notice-sse.marko";
import { createMessageEmitter } from "../../message-emitter.js";

export async function GET({ platform: { request } }) {
  const slotName = (request.query || {}).slotName || "main";

  const response = await fetch(`http://localhost:3001/api?slotName=${slotName}`, {
    headers: { Accept: "text/event-stream" },
  });
  if (!response.ok || !response.body) {
    return new Response("event: error\ndata: Failed to connect\n\n", {
      status: 500, headers: { "Content-Type": "text/event-stream" },
    });
  }

  const emitter = createMessageEmitter(response);
  const encoder = new TextEncoder();

  const sseStream = new ReadableStream({
    start(controller) {
      const pending = new Set();
      emitter.on("data", (dataChunk) => {
        const p = (async () => {
          // Marko 6 folded template.stream into template.render. Awaiting it buffers the
          // fragment to an HTML string. renderId namespaces this render's scope ids.
          const html = await template.render({
            messages: dataChunk,
            $global: { renderId: `s_${dataChunk.id}_${Date.now().toString(36)}` },
          });
          controller.enqueue(encoder.encode(`id: ${slotName}\ndata: ${JSON.stringify(String(html))}\n\n`));
        })();
        pending.add(p);
        p.finally(() => pending.delete(p));
      });
      emitter.on("done", async () => { await Promise.all([...pending]); controller.close(); });
      emitter.on("error", (err) => {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`));
        controller.close();
      });
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });
}
