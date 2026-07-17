---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-2-3', 'Starting dev server']
title: Validating Params & Search
focus: /src/routes/anvils/$id/+handler.js
---

# Validating Params & Search

Everything arriving from a URL is a string — `$global.params.id`,
every query value. The `Run` helpers accept an **options object**
whose `params` and `search` validators transform (and vet) those
values before your code sees them:

```js
export const GET = Run.GET(
  {
    params(value) {
      return { id: Number(value.id) };
    },
    search(value) {
      return { page: Number(value.page) || 0 };
    },
  },
  (context, next) => {
    context.params.id;   // a number now
    context.search.page; // defaulted, typed
    return next();
  },
);
```

A validator is a plain function — replace the value with whatever you
return — or a Standard Schema (Zod, Valibot, ArkType…), which yields a
`[value, issues]` tuple instead; functions keep this tutorial
dependency-free. The transformed values flow everywhere downstream:
`context.params` in handlers, `$global.params` in templates. And
validation options *merge* along the route — declare shared rules once
in a middleware (even options-only, no function) and every route below
inherits them.

The paginated anvil archive on the right does string math —
`/anvils/9?page=2` shows "page NaN of" nonsense because `page`
arrives as `"2"` and `id` as `"9"`:

1. In the handler, add the options object as the first argument to
   `Run.GET`: `params` converting `id` with `Number`, `search`
   defaulting `page` as above.
2. Revisit with `?page=2`, and without any query at all — numbers in,
   numbers out, and the template never learned strings were involved.
