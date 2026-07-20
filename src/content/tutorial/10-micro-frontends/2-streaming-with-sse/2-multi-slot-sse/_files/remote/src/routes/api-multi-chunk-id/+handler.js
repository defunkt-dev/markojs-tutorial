// A mock SSE data source for the multi-slot demo: emits 3 JSON messages with ids 1, 2, 3
// (one per second). The handler maps each id to a different slot and template.
export async function GET({ platform: { request } }) {
  const stream = new ReadableStream({
    start(controller) {
      let count = 1;
      const max = 4; // emits ids 1, 2, 3
      const encoder = new TextEncoder();
      const interval = setInterval(() => {
        const data = { id: `${count}`, message: `Server time ${new Date().toLocaleTimeString()} (Module #${count})` };
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
