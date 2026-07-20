// Bridges a fetch Response body (an SSE byte stream) into a Node EventEmitter that
// emits "data" (one parsed JSON message), "error", and "done". This is the book's
// createMessageEmitter: it turns a data stream into an event stream the handler can react to.
import { EventEmitter } from "node:events";

export function createMessageEmitter(response) {
  const emitter = new EventEmitter();
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // SSE messages are delimited by a blank line (\n\n)
        const messages = buffer.split("\n\n");
        // keep the last (possibly incomplete) piece in the buffer
        buffer = messages.pop();
        for (const raw of messages) {
          const msg = raw.trim();
          if (!msg.startsWith("data:")) continue;
          const dataLine = msg.slice(msg.indexOf(":") + 1).trim();
          try {
            emitter.emit("data", JSON.parse(dataLine));
          } catch {
            emitter.emit("error", new Error("Failed to parse JSON: " + dataLine));
          }
        }
      }
      emitter.emit("done");
    } catch (err) {
      emitter.emit("error", err);
    } finally {
      try { await reader.cancel(); } catch {}
    }
  })();

  return emitter;
}
