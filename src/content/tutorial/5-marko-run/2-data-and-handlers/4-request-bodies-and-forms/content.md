---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-2-4', 'Starting dev server']
title: Request Bodies & Forms
focus: /src/routes/signup/+handler.js
---

# Request Bodies & Forms

Time for the classic: an HTML form POSTing to the server — no fetch,
no JS, progressive enhancement's favorite child.

```marko
<form method="post">
  <input name="name">
  <button>Join</button>
</form>
```

On the receiving side, a `POST` handler declares how to read the body
with the `form` option (its sibling `json` handles JSON requests).
With either configured, `context.body` becomes a promise for the
parsed — and validated — body:

```js
export const POST = Run.POST(
  {
    form(value) {
      return { name: String(value.name || "").trim() };
    },
  },
  async (context, next) => {
    const { name } = await context.body;
    if (!name) return next({ error: "Name required" });
    subscribers.push(name);
    return next({ welcomed: name });
  },
);
```

The last piece is what `next()` means in a `POST` with a page present:
**it renders the page** — so the same URL can respond to the
submission with HTML, showing errors or success with full state. (The
other classic ending, redirect-after-post, is one
`context.redirect("/thanks")` away; both are legitimate, this lesson
uses render.)

The signup form on the right posts into the void — a 404, since no
handler accepts POST:

1. Fill in the handler as above (skeleton provided; the
   `subscribers` array is module-level, your first in-memory
   "database").
2. Submit empty → the page renders the error from `$global.data`.
   Submit a name → welcomed, and the count grows. Refresh — the count
   persists for the server's lifetime. All without one line of client
   JavaScript.
