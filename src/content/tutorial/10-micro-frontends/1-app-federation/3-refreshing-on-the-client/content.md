---
type: lesson
template: marko-microframe
title: Refreshing on the Client
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Starting the host and remote servers']
---

# Refreshing on the Client

:::tip
These lessons render on the **server**, so the preview doesn't always refresh by itself. If it looks stale after you Solve a step or switch lessons, hit **reload** on the preview.
:::

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

> **Heads up — this file is Class API, on purpose.** `@micro-frame/marko` is a **Marko 5**
> library (that's why Part 10 runs on a Marko 5 template), and its tags can only be driven
> from Marko 5's **Class API** — not from the Marko 6 Tags API you've used so far. So the
> reactive code here looks a little different: a `class { ... }` block holds component state
> in `this.state`, methods on the class are event handlers, and `on-click("refresh")` wires
> the button to the `refresh` method (instead of `<let>` and `onClick`).

Wire it up:

1. Add a `class {}` block above the page with `onCreate() { this.state = { nonce: 0 }; }` and
   a `refresh() { this.state.nonce++; }` method.
2. Add a `<button on-click("refresh")>Refresh</button>`.
3. Change the `src` to `` `/notice?v=${state.nonce}` `` so every click builds a new URL.

Click **Refresh** and watch the timestamp in the notice change: the remote re-rendered,
was fetched fresh through the host, and swapped into the page on the client — no full reload.
