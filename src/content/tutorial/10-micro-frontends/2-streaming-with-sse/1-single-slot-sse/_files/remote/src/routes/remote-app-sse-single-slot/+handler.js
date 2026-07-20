// Consumes the /api SSE stream and streams a single PAGE render whose <await> recurses, emitting one
// notice per message. Each streamed chunk is re-framed as an SSE frame tagged with the slot id; the
// host's <micro-frame-slot slot="..."> assembles them. Because it's ONE render (notices nested as
// branches), the notices hydrate independently and each × works.
import template from "./+page.marko";
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
    async start(controller) {
      try {
        // Marko 6 has no template.stream; template.render() returns a value you can `for await`
        // to STREAM its chunks (or `await` for a string). renderId namespaces this whole render.
        for await (const chunk of template.render({
          messageStream: emitter,
          $global: { renderId: `sse_${Date.now().toString(36)}` },
        })) {
          controller.enqueue(encoder.encode(`id: ${slotName}\ndata: ${JSON.stringify(String(chunk))}\n\n`));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`));
      }
      controller.close();
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });
}
