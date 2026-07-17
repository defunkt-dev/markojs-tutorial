---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-2-1', 'Starting dev server']
title: Handlers & the Context
focus: /src/routes/status/+handler.js
---

# Handlers & the Context

Pages answer `GET` with HTML. For everything else — JSON, other HTTP
methods, redirects — there's `+handler.*`: a JS module beside (or
instead of) a page, exporting functions named after HTTP verbs,
created with marko-run's global `Run` helpers:

```js
/* src/routes/status/+handler.js */
export const GET = Run.GET((context) => {
  return Response.json({ ok: true });
});
```

No imports needed — `Run` is ambient in route files. Each handler
receives the **context**, the same object templates see as `$global`:

- `context.request` — the standard WHATWG Request
- `context.url`, `context.method`, `context.route`
- `context.params` — the dynamic segments from last lesson
- `context.meta`, `context.data`, `context.body` — each about to get
  its own lesson

and response helpers: `context.render(template, input)`,
`context.redirect(to)`, `context.back()`. Handlers return a standard
`Response` (or throw one — useful deep in helper code), and the web
platform does the rest.

The uptime widget on the right fetches `/status` and gets a 404 —
nobody answers that URL:

1. Fill in `src/routes/status/+handler.js`: export a `GET` built with
   `Run.GET` returning
   `Response.json({ ok: true, method: context.method, path: context.url.pathname })`.
2. The page's Check button shows the JSON — your first non-HTML
   route, and the context's basics visible in the payload.
