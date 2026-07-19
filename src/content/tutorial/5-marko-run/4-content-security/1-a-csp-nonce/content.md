---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-4-1', 'Starting dev server']
title: A CSP Nonce
focus: /src/routes/+middleware.js
---

# A CSP Nonce

A strict Content-Security-Policy is one of the best defenses against
cross-site scripting: you tell the browser "only run scripts I've explicitly
blessed," and any injected `<script>` simply doesn't execute. The usual way
to bless the scripts *you* meant to include is a **nonce** — a random,
unguessable token minted fresh for each response and attached to every
legitimate script and style.

That's a challenge for a framework that emits its own scripts. Marko's
hydration ships inline `<script>` tags to resume your app in the browser;
under a strict CSP with no nonce, the browser would block them, and your
page would render but never come alive.

Marko solves this through a special global: **`$global.cspNonce`**. Set it,
and Marko stamps that exact nonce onto every `<script>` and `<style>` it
renders — hydration scripts, asset tags, all of it. In marko-run, `$global`
*is* the request context, so the natural place to mint the nonce is
**middleware**, which runs on every request.

**Set the nonce.** Open `src/routes/+middleware.js` and give each request a
fresh one:

```js
context.cspNonce = crypto.randomUUID();
```

Reload the preview and view the page source. Every script and style Marko
emitted now carries `nonce="…"`, all sharing the single value minted for
this request — reload again and the value changes. That's exactly what a
`Content-Security-Policy: script-src 'nonce-…'` header would check each
script against.

:::info
A nonce must be **unpredictable and per-response** — that's the entire
security property, so `crypto.randomUUID()` (or any cryptographic random) is
right, and a fixed string is not. Marko handles putting it everywhere it
renders; you're responsible for minting it and, in production, sending the
matching CSP header carrying the same value.
:::

:::tip
`cspNonce` is one of a handful of "magic" `$global` properties Marko reads by
name. Because you set it in middleware, it's request-scoped and reaches every
route and component through `$global` — no prop-drilling, no per-page wiring.
:::

That's CSP integration in one line: mint a nonce per request in middleware,
and Marko secures every script and style it renders with it.
