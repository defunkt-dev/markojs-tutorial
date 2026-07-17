---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-2-5', 'Starting dev server']
title: Middleware
focus: /src/routes/+middleware.js
---

# Middleware

Handlers answer one route. `+middleware.*` files wrap **every route at
their level and below** — the request pipeline's layers. A middleware
default-exports a handler (built with `Run.ALL` to run for every
method, or a verb helper to filter), receives the same `context`, and
calls `next()` to pass control inward:

```js
/* src/routes/+middleware.js */
export default Run.ALL(async (context, next) => {
  const started = Date.now();
  const response = await next();          // everything inside runs here
  console.log(`${context.method} ${context.url.pathname} — ${Date.now() - started}ms`);
  return response;
});
```

The execution order is an onion — marko-run's own diagram, in text:

```text
root middleware → nested middleware → handler → layouts+page render
        response streams back out through each, in reverse
```

Code before `next()` runs on the way in; code after runs on the way
out, response in hand — timing, logging, auth checks, header stamping
all fall out of that shape. Middleware also joins the two systems you
know: it can pass data (`next({ user })` merges into `$global.data`)
and declare shared validation options for everything below.

The site on the right has a root middleware stub and an `admin/`
section with its own:

1. Complete the root middleware with the timer above.
2. Complete `admin/+middleware.js`: before `next()`, check
   `context.url.searchParams.get("key") === "letmein"` — if not,
   `return new Response("Forbidden", { status: 403 })`.
3. Open the **terminal tab** and watch: `/` logs one line;
   `/admin` without the key is rejected *before* the handler ever
   runs; `/admin?key=letmein` passes and logs from both layers in
   onion order.
