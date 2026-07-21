---
type: lesson
mainCommand: ['pnpm run dev --lesson-11-1-1', 'Starting dev server']
title: The Streaming Model
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# The Streaming Model

Before the demos, the idea. **Streaming** means sending HTML to the
browser **chunk-by-chunk, as soon as each piece is ready**, instead of
building the whole page and sending it at the end. That end-of-page
approach is **buffering** — the opposite. The page on the right streams
right now: the heading paints instantly, then two cards drop in on their
own timers. Reload it and watch.

## Why it's worth it

- **Faster time-to-first-byte.** Bytes leave the server the moment the
  first chunk is ready, so the browser starts parsing — and downloading
  CSS, fonts, JS — while your slow data is still loading.
- **Better perceived performance.** Users see useful content
  immediately instead of a blank screen until everything is done.
- **Lighter server.** No need to hold a whole rendered page in memory
  before sending it.

Marko has streamed HTML since 2014 — long before most of the ecosystem.

## Two shapes of streaming

- **In-order** — chunks arrive in document order. The stream simply
  *holds* at a slow section and releases everything after it once that
  section resolves.
- **Out-of-order** — each fragment is sent the instant *its* data is
  ready, even if that's out of document order, and a tiny bit of client
  JavaScript slots it into place.

## The three tags that do it

- **`<await|x|=promise>`** waits for a promise and streams that section
  when it resolves — **in-order** by default. (You met this in part
  three.)
- **`<try>` with a `<@placeholder>`** opts a section into
  **out-of-order**: it shows the placeholder immediately, then swaps in
  the real content whenever it resolves.
- **`<@catch>`** inside a `<try>` is the error boundary — if the promise
  rejects, it renders instead of the section.

## The same tag runs on the client, too

`<await>` isn't a server-only tag. This initial render *streams from the
server* — the resolved content lands in the HTML with no client
JavaScript at all. But the very same `<await>` also runs in the browser:
when a client interaction changes the promise you're awaiting, it
re-renders the new result on the client. One tag for both places — you
don't reach for a separate "client await" the way earlier versions of
Marko required.

That's the whole toolkit. The next lesson uses `<await>` to stream a
search page's results over one long response; the chapter after puts
`<await>`, `<@placeholder>`, and `<@catch>` together across a whole
page. For the background, see the docs'
[*HTML Streaming*](https://markojs.com/docs/explanation/streaming) explanation.
