---
type: lesson
autoReload: true
template: marko-microframe
title: Refreshing on the Client
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# Refreshing on the Client

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you Solve a step, switch lessons, or if the notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page. Everything also works if you <strong>download the lesson</strong> and run it locally.</div>

In the last lesson the host embedded the remote and it just worked — because that fetch
happened on the **server**, before the page reached the browser. Now we want a **Refresh**
button that re-fetches the remote *without* reloading the whole page.

That hits a wall: from the browser, the host page can't reach the remote's port directly —
the two apps only see each other on the server, inside their shared environment. So we route
the request through the host instead, a pattern called a **backend-for-frontend (BFF)**. The
host exposes its own route that fetches the remote and passes the HTML back:

```js
// host/src/routes/notice/+handler.js
export async function GET() {
  const res = await fetch("http://localhost:3001/fragment");
  return new Response(await res.text(), {
    headers: { "Content-Type": "text/html" },
  });
}
```

That handler is already in place. Now `<micro-frame>` points at `/notice` — a path on the
host itself, which the browser can always reach. To re-fetch, we change the `src`: add a
counter to the URL and bump it on each click.

You'll also notice a small `cleanFetch` helper wired onto the tag with `fetch=cleanFetch`.
That's a **preview-only workaround** and already provided for you: this StackBlitz preview
injects its own runtime `<script>` into fetched HTML, which would error if it ran a second time
when the notice is re-inserted. `cleanFetch` strips that injected script and keeps the remote's
own. Outside StackBlitz you don't need it — leave it in here and move on.

> **Heads up — this file is Class API, on purpose.** `@micro-frame/marko` is a **Marko 5**
> library (that's why Part 10 runs on a Marko 5 template), and its tags can only be driven
> from Marko 5's **Class API** — not from the Marko 6 Tags API you've used so far. So the
> reactive code here looks a little different: a `class { ... }` block holds component state
> in `this.state`, methods on the class are event handlers, and `on-click("refresh")` wires
> the button to the `refresh` method (instead of `<let>` and `onClick`).

Wire it up (the `cleanFetch` helper and the `<micro-frame>` are already there):

1. Add a `class {}` block above the page with `onCreate() { this.state = { nonce: 0 }; }` and
   a `refresh() { this.state.nonce++; }` method.
2. Add a `<button on-click("refresh")>Refresh</button>`.
3. Change the `src` from `"/notice"` to `` `/notice?v=${state.nonce}` `` so every click builds a
   new URL.

Click **Refresh** and watch the timestamp in the notice change: the remote re-rendered,
was fetched fresh through the host, and swapped into the page on the client — no full reload.
The × keeps working after each refresh, too.
