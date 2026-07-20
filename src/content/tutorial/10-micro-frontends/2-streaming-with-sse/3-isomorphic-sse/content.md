---
type: lesson
autoReload: true
template: marko-microframe
title: Isomorphic SSE
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# Isomorphic SSE

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you Solve a step, switch lessons, or if a notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page. Everything also works if you <strong>download the lesson</strong> and run it locally.</div>

The SSE stream so far runs **on the server** during the first render — the notices arrive, get
placed, and ship as part of the page. "Isomorphic" means the **same** setup can also re-run
**on the client**: a **Refresh** button re-opens the stream and re-fills the slot, without a full
page reload. Same tags, same slot — the only new part is host-side state that changes the faucet's
`src`.

There's one wrinkle, the same as the earlier Refreshing lesson: from the browser, the host can't
reach the remote's port directly. So the faucet points at a **same-origin host route**,
`/sse-stream`, which proxies the remote's SSE endpoint back to the browser (a backend-for-frontend).
That handler is already in place.

> **Heads up — this file is Class API, on purpose.** `@micro-frame/marko` is a **Marko 5** library,
> and its tags can only be driven from Marko 5's **Class API**. So the reactive bits look different
> from Marko 6 Tags API: a `class { ... }` block holds state in `this.state`, methods are event
> handlers, and `on-click("reload")` wires the button to the `reload` method.

Wire it up:

1. Add a `class {}` block above the page with `onCreate() { this.state = { time: 0 }; }` and a
   `reload() { this.state.time = Date.now(); }` method.
2. Add a `<button on-click("reload")>Refresh</button>`.
3. Change the faucet's `src` to include the changing value:
   ``src=`/sse-stream?slotName=main&dt=${state.time}```. Each click builds a new URL, which re-opens
   the stream on the client.

Click **Refresh**: the stream re-runs and the notices re-appear with fresh timestamps — rendered by
the remote, streamed through the host, swapped in on the client.
