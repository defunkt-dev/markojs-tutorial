---
type: lesson
title: In-Order, Out-of-Order & Single-Chunk
focus: /src/tags/section/index.marko
template: marko-progressive-render
autoReload: true
---

# In-Order, Out-of-Order & Single-Chunk

The last chapter streamed one long list. This one streams a whole **page** —
four independent sections that finish at different times — and shows the three
ways Marko can deliver them. Two words that get muddled first:

- **Streaming** is the *delivery*: sending HTML in chunks as it becomes ready.
- **Progressive rendering** is the *strategy*: showing each piece as soon as
  it's done.

Progressive rendering is built *on* streaming. The three modes here — chosen by
the `?mode=` links at the top — sit at different points on that spectrum.

## How the modes are plumbed (already written)

- **`src/routes/index/index.ts`** reads the mode and, for **single-chunk**,
  `await`s the render and sends the finished string in one piece — *buffered*,
  the opposite of streaming. The other two modes `.pipe(res)` to stream.
- **`src/routes/index/template.marko`** lays out four `<Section>`s — Header
  (750ms), Nav (500ms), Main (3s), Footer (1s) — each with a delayed promise.
- **`src/tags/fragment/index.marko`** is a section's content: a small
  **component** with a "click me" button (a separate component on purpose — see
  below).

Open the preview and click **in-order**, then **single-chunk**:

- **In-order** — a bare `<await>` per section holds the stream in document
  order. Heading, then Header + Nav, then a **three-second wait on Main** before
  Footer can appear. Correct order, but a slow section blocks everything after
  it.
- **Single-chunk** — nothing until *everything* is ready (~3s), then the whole
  page at once. Buffered.

Now click **out-of-order** — the default. Notice it currently behaves *exactly
like in-order*: Footer still waits behind Main. That's what you'll fix.

## Your job: opt out-of-order *into* out-of-order

Open `src/tags/section/index.marko`. The out-of-order branch already wraps its
`<await>` in a `<try>` — but a bare `<try>` still streams **in order**. The one
thing that unlocks out-of-order is a **`<@placeholder>`**: it renders instantly
in the section's slot, and Marko then streams the real content whenever it
resolves, injecting a small client script to move it into place.

1. Where the `TODO` is (between `</await>` and `<@catch>`), add:
   ```marko
   <@placeholder>
     <div class="fragment placeholder">Loading ${input.label}…</div>
   </@placeholder>
   ```
2. Reload with **out-of-order** selected. Now every section shows a placeholder
   immediately, and the real content drops in **as each promise resolves** — Nav
   (0.5s) and Footer (1s) appear **before** Main (3s), even though Main sits
   above Footer in the document. The slow section no longer blocks the fast ones.

The `<@placeholder>` is the **opt-in** to out-of-order — the same `<try>` /
`@placeholder` pair from part three, now doing its work across a whole page.

## Each section stays interactive

Click "click me" in any resolved section and it flips to "Clicked!" — even in
out-of-order, where the section was streamed late and moved into place by that
client script. The rule: the interactive part must be its **own component**
(`<fragment>`), not inline markup inside the `<await>`. Reordered content
carrying inline reactive state won't hydrate; wrapped in a component, it does.

(Main also races a 5-second timeout inside that same `<try>`; if its data were
ever that slow, the `<@catch>` would show instead. It resolves at 3s, so you
won't see it fire — but that's how you'd guard a slow section, mirroring the
original demo's `timeout`.)

:::info
`.pipe(res)` streams; `await render()` buffers; `<@placeholder>` turns an
in-order stream into an out-of-order one. Same page, same data, three
experiences — a Marko 6 rebuild of the original progressive-rendering demo's
`renderMode` switch, with no framework in the middle.
:::

:::tip
Expect a brief blank flash while the client bundle loads, then the page renders.
If the preview looks stale after you Solve or switch modes, reload it — or
download the lesson and run it locally.
:::
