---
type: lesson
autoReload: true
template: marko-microframe
title: Multi-slot SSE
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# Multi-slot SSE

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you Solve a step, switch lessons, or if a notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page. Everything also works if you <strong>download the lesson</strong> and run it locally.</div>

One faucet can feed **many** boxes. The real power of `<micro-frame-sse>` is fanning a single
stream out to **different spots on the page** — each chunk routed to its own slot by id.

The remote endpoint (`remote/src/routes/remote-app-sse-multi-slot/+handler.js`, now visible in the file tree) does two new things per message:

- it picks a **different template** for each id (an *information*, a *confirmation*, and an
  *attention* notice), and
- it tags each frame with a **different slot id** — `module_1`, `module_2`, `module_3`.

On the host, one `<micro-frame-sse>` opens the stream, and several `<micro-frame-slot>`s —
placed wherever you like — each pick up the chunk whose `slot` matches. Two are already wired.
**Your job: add the third.**

1. Add `<micro-frame-slot from="stream" slot="module_3" timeout=0 client-reorder>` in the marked spot.
2. Give it a `<@loading>` and a `<@catch|err|>`, like the other two.

Load the page: the three notices stream into their three separate slots. Each notice is
**interactive** — dismiss any with its ×.

## runtimeId, renderId, and componentIdPrefix

This is where render ids earn their keep. Three **interactive** fragments now render onto one
page, and each ships its own hydration data. If they shared scope ids they'd clash — so the
remote gives every render a **unique `renderId`**:

```js
for await (const chunk of template.render({
  messages: dataChunk,
  $global: { renderId: `m${dataChunk.id}_...` }   // unique per render
})) { /* frame it as SSE */ }
```

Three ids are in play, and they're easy to confuse:

- **`runtimeId`** (set once in the remote's `vite.config`, `'mr'`) namespaces the **whole remote
  runtime** so it can't collide with the **host's** runtime on the same page.
- **`renderId`** namespaces the scope ids of **one render**, so several renders sharing that
  runtime don't collide. That's what we set per chunk above.
- **`componentIdPrefix`** is the **Marko 5 name** for `renderId` (what the book uses via
  `$global: { componentIdPrefix }`). Marko 6 renamed it to `renderId` but still accepts
  `componentIdPrefix` for back-compat — they set the same thing.

You can see the `mr`-namespaced markers and the per-render ids in the streamed HTML with your
browser's **View Source** on the remote preview.
