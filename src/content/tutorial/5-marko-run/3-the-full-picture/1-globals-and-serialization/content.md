---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-3-1', 'Starting dev server']
title: Globals & Serialization
focus: /src/routes/+middleware.js
---

# Globals & Serialization

`$global` deserves its full story. It's the render-globals object —
Marko 5 veterans knew its ancestor as `out.global` — and in marko-run
it *is* the request context: `params`, `url`, `meta`, `data`, plus
anything middleware attaches (`context.tenant = "acme"`).

Now the subtle part: the **server→browser crossing**. During SSR,
templates read any global freely. After hydration, client-side code
(handlers, effects) can only read what was **serialized** across.
marko-run serializes `params` and `url` by default; everything else
needs the whitelist:

```js
context.tenant = "acme";
context.serializedGlobals = ["tenant"];
```

Why a whitelist and not everything? Two reasons. Size — globals can
hold big server-side objects the page doesn't need shipped. And
**serializability**: not every value survives the crossing. Plain
data, dates, Map/Set — yes. Even most functions and closures — yes,
because Marko *resumes* rather than re-runs, serializing references
into its state graph (this is how every counter since part two kept
working after hydration). What can't cross: class instances, DOM
nodes, closures over arbitrary foreign values. State that hydrates is
state that serializes — true for every `<let>` you've written, just
never visible until now.

The page on the right prints `$global.tenant` twice — once during
render, once from a client-side effect after hydration:

1. Reload as-is: the SSR line shows "acme"; open the console — the
   client line logs `undefined`. The global died at the border.
2. In the middleware, add
   `context.serializedGlobals = ["tenant"];` under the assignment.
3. Reload: console now logs "acme". One whitelist entry, one value
   granted a passport.
