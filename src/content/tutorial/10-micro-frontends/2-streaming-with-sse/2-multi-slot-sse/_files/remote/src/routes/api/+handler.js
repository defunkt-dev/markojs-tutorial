// A mock SSE data source: emits 5 JSON messages, one per second, then closes.
// Each frame is `data: {"id","message"}\n\n`. `id` echoes the requested slotName.
export async function GET({ platform: { request } }) {
  const slotName = (request.query || {}).slotName || "main";
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      const max = 5;
      const encoder = new TextEncoder();
      const interval = setInterval(() => {
        const data = { id: slotName, message: `Server time ${new Date().toLocaleTimeString()} (#${count + 1})` };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        if (++count >= max) { clearInterval(interval); controller.close(); }
      }, 1000);
      request._interval = interval;
    },
    cancel() { if (request._interval) clearInterval(request._interval); },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" },
  });
}
