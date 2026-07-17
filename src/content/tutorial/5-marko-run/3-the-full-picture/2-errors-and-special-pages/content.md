---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-3-2', 'Starting dev server']
title: Errors & Special Pages
focus: /src/routes/store/+handler.js
editor:
  fileTree:
    allowEdits: ['/src/routes/**']
---

# Errors & Special Pages

Things go wrong; marko-run gives wrongness a home. Two special pages,
defined only at the routes root:

**`+404.marko`** — served (with a real 404 status) when a request
accepting HTML matches nothing.

**`+500.marko`** — served (status 500) when an uncaught error escapes
from the request pipeline — a handler or middleware throwing before
the page starts. A sharp distinction learned the hard way: once a page
is *streaming*, the status line is long gone — errors mid-render are
`<try>`'s territory (part three), not this page's. Boundary inside the
stream, `+500` outside it.

Both are ordinary pages — the root layout wraps them, `$global` works.
And for wrongness you *choose*, the context's response helpers:
`context.redirect("/new-home")` (relative paths resolved),
`context.back(fallback)` (return-to-referer).

The site on the right is limping:

1. Visit `/anything-wrong` — the bare default 404. Create
   `src/routes/+404.marko` (tree unlocked): a friendly heading and a
   link home.
2. Visit `/kaboom` — its *handler* throws on purpose (peek at
   `kaboom/+handler.js`). Create `+500.marko`: "Something broke, it's
   us not you."
3. The old `/store` URL should live at `/`: fill in
   `store/+handler.js` with a `Run.GET` returning
   `context.redirect("/")` — click the stale link, land home, and
   check the network tab's 30x if you're curious.
