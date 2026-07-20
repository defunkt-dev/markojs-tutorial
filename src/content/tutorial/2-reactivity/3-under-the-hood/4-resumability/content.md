---
type: lesson
title: Resumability
focus: /src/routes/+page.marko
---

# Resumability

The last lesson left you looking at the server's output, dotted with `_el_resume` markers. This
lesson shows what they're for — and it's the thing that most sets Marko apart.

## Hydration by replay

A server sends the browser a finished HTML page. But that HTML is inert — the buttons don't do
anything yet. To wake it up, most frameworks **re-run your component code on the client**:
re-executing render functions, rebuilding a virtual tree, re-attaching everything. The server
already did that work; the client does it *again* just to reattach behavior. That's hydration by
**replay**.

## Marko resumes instead

Marko doesn't re-run your render code on the client. The server serializes just enough state — the
`_el_resume` markers you saw last lesson — for the browser to **pick up exactly where the server
left off**: it wires event handlers straight to the DOM that's already on the page. No re-render,
no replayed work.

## See it for yourself

This page has a button (so it's interactive) and, in the paragraph below it, a `console.log` that
runs *while the page renders*:

```marko
${(() => {
  console.log("[server render] this code ran once — on the server");
  return "This paragraph was rendered on the server.";
})()}
```

Try this:

1. **Watch the terminal**, then reload the preview. You'll see `[server render]` printed — the
   render code ran on the **server**.
2. **Open the browser console** (in the preview's own tab). It's **not there**. The render code did
   not run again on the client.
3. **Click the button.** It counts up — so the page really is interactive. Marko attached that
   handler by *resuming*, not by re-running your code.

In a replay framework, that one `console.log` would fire **twice** — once on the server, once in
the browser. With Marko, it fires **once**.

## Why it matters

Replaying render work is expensive, and it grows with the size of your page — the more you render,
the more the client redoes before anything is interactive. By resuming, Marko skips that entirely:
the server's work is never thrown away, so pages become interactive sooner, especially large ones
and on slower devices.

:::info
This is a read-only demonstration — a running example to observe. The server's log shows up in the
**terminal**, not the browser console, so watch both.
:::
