export function GET() {
  let interval;
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        const data = {
          id: Date.now(),
          message: `Server time: ${new Date().toLocaleTimeString()}`,
        };
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
        );
      };
      send();
      interval = setInterval(send, 1000);
    },
    cancel() {
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
