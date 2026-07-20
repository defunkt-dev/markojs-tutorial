---
type: lesson
autoReload: true
template: marko-microframe
title: Single-slot SSE
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# Single-slot SSE

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you Solve a step, switch lessons, or if a notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page. Everything also works if you <strong>download the lesson</strong> and run it locally.</div>

So far the host **pulled** a remote once with `<micro-frame>`. Sometimes you want the remote
to **push** — a live stream of updates over one connection. That's **Server-Sent Events (SSE)**,
and app federation handles it with a second pair of tags:

- **`<micro-frame-sse>`** is the **faucet**. It opens one SSE stream to a URL and renders
  nothing itself — it just feeds slots. Put it near the top so the stream starts early.
- **`<micro-frame-slot>`** is a labeled **drop-box**. Each streamed chunk carries a label
  (a slot id); the chunk lands in the box whose `slot` matches. The slot's `from` ties it back
  to the faucet's `name`.

Open the remote's code in the file tree to follow along —
`remote/src/routes/remote-app-sse-single-slot/+handler.js`. It reads a mock SSE feed
(`remote/src/routes/api`), turns that byte stream into an event stream with
`createMessageEmitter` (`remote/src/message-emitter.js`), and for **each** message renders a
small notice to HTML and sends it as one SSE frame tagged with the slot id. On the host, the
`read` function turns each raw event into `[slotId, html, isDone]`:

```marko
<micro-frame-sse timeout=0 name="notices"
  src=`http://localhost:3001/remote-app-sse-single-slot?dt=${Date.now()}&slotName=main`
  read(ev) { return [ev.lastEventId, JSON.parse(ev.data), false]; }
/>
```

The faucet is already in the page. **Your job: add the box.** Drop a `<micro-frame-slot>` where
the notices should appear, wire it to the faucet, and give it a loading placeholder:

1. Add `<micro-frame-slot from="notices" slot="main" timeout=0 client-reorder>` where the comment is.
2. Give it a `<@loading>` message and a `<@catch|err|>` fallback.

Load the page: five notices stream in one by one, each into that same slot, accumulating as they
arrive. `client-reorder` lets the page paint immediately and fill the slot as chunks land. Each
notice is **interactive** — dismiss any of them with its ×.

## The render API, and renderId

The remote builds each frame's HTML with `template.render(...)`. In **Marko 5** the book used a
separate **`template.stream(...)`** here — this SSE page is about the only place that API shows up.
**Marko 6 removed `template.stream`** and folded it into `template.render`, which returns a value
you can either **`await`** (→ a finished HTML string) or **`for await`** (→ a stream of chunks).
The single-slot endpoint `await`s it for a string; the next lesson uses the `for await` form.

Notice the render also sets a `$global.renderId`. Five **interactive** notices now hydrate on the
same page, so each render gets a **unique** `renderId` to keep their scope ids from colliding. With
one slot it's easy to miss why that matters — the next lesson, with three different notices in three
slots, makes it obvious.
