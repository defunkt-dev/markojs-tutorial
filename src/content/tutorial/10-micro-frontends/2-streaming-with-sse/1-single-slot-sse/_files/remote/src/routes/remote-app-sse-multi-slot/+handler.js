// Like single-slot, but each incoming id picks a DIFFERENT fragment template and a DIFFERENT
// slot (module_1/2/3). Because several interactive fragments render onto one page, each render
// gets a UNIQUE renderId so their hydration scope ids never collide — this is where renderId
// (Marko 5 called it componentIdPrefix) earns its keep.
import fragmentOne from "./fragment-one.marko";     // information
import fragmentTwo from "./fragment-two.marko";     // confirmation
import fragmentThree from "./fragment-three.marko"; // attention
import { createMessageEmitter } from "../../message-emitter.js";

export async function GET() {
  const response = await fetch("http://localhost:3001/api-multi-chunk-id", {
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
        const id = parseInt(dataChunk.id, 10);
        const template = id % 3 === 1 ? fragmentOne : id % 3 === 2 ? fragmentTwo : fragmentThree;
        const p = (async () => {
          // for-await streams the render's chunks (the other form of Marko 6's render API).
          for await (const chunk of template.render({
            messages: dataChunk,
            $global: { renderId: `m${dataChunk.id}_${Date.now().toString(36)}` },
          })) {
            controller.enqueue(encoder.encode(`id: module_${dataChunk.id}\ndata: ${JSON.stringify(String(chunk))}\n\n`));
          }
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
