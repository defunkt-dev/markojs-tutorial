---
type: lesson
title: The EventSource API
focus: /src/tags/live-feed.marko
---

# The EventSource API

Most of the web is request-and-response: the browser asks, the server
answers, done. **Server-sent events** change the shape — the browser opens
one connection and the *server* pushes messages down it whenever it likes,
for as long as it stays open. It's the simple, one-directional cousin of
WebSockets: a good fit for live prices, notifications, progress bars, a
clock.

There are two halves — a route that streams, and a browser API that
listens.

## The server half (already written)

`src/routes/api/events/+handler.js` is a normal marko-run handler that
returns a **streaming `Response`**. Instead of a string or some JSON, its
body is a `ReadableStream`, and it pushes one message a second:

```js
controller.enqueue(
  new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`),
);
```

That `data: … \n\n` is the entire SSE wire format: a `data:` line, then a
blank line to end the message. Two more details make it work — the
`Content-Type: text/event-stream` header, which tells the browser to hold
the connection open and treat what arrives as a stream rather than a
document; and `cancel()`, which the runtime calls when the client
disconnects, so the interval is cleared and nothing keeps running after
everyone's gone. No library — just web-standard streaming.

## The browser half (your job)

`EventSource` is the built-in client for this. You hand it a URL, and its
`onmessage` fires once for every `data:` line the server sends. Open
`src/tags/live-feed.marko` and fill in the `<script>`:

```marko
<script>
  if (live) {
    const source = new EventSource("/api/events");
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messages = [...messages.slice(-5), data];
    };
    $signal.onabort = () => source.close();
  }
</script>
```

Three things are doing real work here:

- A `<script>` is an **effect** — the same one you met with the stopwatch.
  It runs when the component mounts and **re-runs whenever a tag variable
  it reads changes**. It reads `live`, which matters in a moment.
- Assigning to `messages` is an ordinary reactive update, so every arriving
  event re-renders the list — the clock ticks on its own.
- `$signal.onabort` is the cleanup: when the effect re-runs or the
  component unmounts, the connection closes. That one line is why an open
  socket never leaks.

Watch the clock start ticking in the preview. Now click **Stop**: `live`
flips to `false`, the effect re-runs, `$signal` aborts — the old connection
closes and the clock freezes. Click **Subscribe** and the effect re-runs
again, opening a fresh connection. One `<let>` and one `$signal` line gave
you start-and-stop, with nothing left dangling in between.

:::info
`EventSource` also reconnects on its own if the network blips — you get
that for free. It's much lighter than a WebSocket when you only need one
direction, server → client. For two-way traffic (chat, collaborative
editing), reach for a WebSocket instead.
:::

:::tip
The server sends plain text; its shape is up to you. Here each message is
JSON, so `JSON.parse(event.data)` gives back an object — but `event.data`
is just the string after `data:`. Send whatever format you like and parse
it on arrival.
:::

That's the whole loop: a handler streaming `text/event-stream`, and a
component that subscribes, renders each event reactively, and tears the
connection down the moment it's done with it.
