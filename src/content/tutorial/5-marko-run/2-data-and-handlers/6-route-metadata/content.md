---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-2-6', 'Starting dev server']
title: Route Metadata
focus: /src/routes/reports/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/routes/**']
---

# Route Metadata

Some facts about a route are *static* — a title, a required role, a
cache policy. `+meta.*` files attach exactly that: their content
(JSON, or any module's default export) appears on `context.meta` for
the route, and `$global.meta` in its templates. No plumbing.

```json
/* src/routes/reports/+meta.json */
{ "title": "Reports", "requiresRole": "analyst" }
```

Two semantics worth pinning (verified against this very setup):

**Per-route, not inherited** — a `+meta` file serves the routes of its
own directory; a sibling directory's routes don't see it.

**Verb-specific overrides** — top-level keys named `GET`, `POST`, etc.
merge over the base for requests of that method:

```json
{ "title": "Reports", "POST": { "title": "Submitting report" } }
```

A `GET` sees `title: "Reports"`; a `POST` sees the override. Handy
when one route's methods mean different things — and it composes with
everything: middleware can read `context.meta.requiresRole` and
enforce it generically, one auth middleware serving many routes'
declared needs.

The reports page on the right renders `$global.meta.title` — currently
undefined, and the gate middleware lets everyone in because
`context.meta.requiresRole` is missing:

1. Create `src/routes/reports/+meta.json` (tree unlocked) with the
   first JSON above.
2. Reload `/reports`: the title appears, and the middleware — which
   already checks `meta.requiresRole` against the `?role=` query —
   starts enforcing. Try `?role=analyst` and without.
