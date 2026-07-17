---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-3-3', 'Starting dev server']
title: API Routes
focus: /src/routes/api/quotes/+handler.js
---

# API Routes

A handler with no page beside it is a pure API endpoint — same
routing, same context, same validators, JSON out. Convention: park
them under `/api`:

```text
src/routes/
  api/
    quotes/
      +handler.js     → GET/POST /api/quotes
```

Everything from this chapter composes: verb exports for methods,
`json:` option for parsing POST bodies, `context.params` under dynamic
directories, middleware guarding whole API subtrees, `+meta`
annotating them. Your server-rendered pages and your API share one
router, one pipeline, one mental model — and the pages themselves can
be the API's first consumer.

The quote board on the right does exactly that: the page lists quotes
and posts new ones from a client-side form via `fetch("/api/quotes")`.
The endpoint half is missing:

1. In `api/quotes/+handler.js`, export `GET` returning
   `Response.json(quotes)`.
2. Export `POST` built with the `json` body option —
   `{ json(value) { return { text: String(value.text || "").trim() }; } }`
   — awaiting `context.body`, rejecting empties with a 400, pushing
   the rest, returning `Response.json(q, { status: 201 })`.
3. Add a quote in the page — the round trip is yours end to end:
   fetch → router → validator → handler → JSON → state update →
   re-render. Five parts of tutorial in one button click.
