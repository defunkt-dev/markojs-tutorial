---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-2-2', 'Starting dev server']
title: Loading Data
focus: /src/routes/+handler.js
---

# Loading Data

Part three loaded data with `<await>` inside templates — fine for
component-local concerns. But marko-run's canonical pattern loads data
**before** the page, in the handler, and hands it down by calling
`next` with an object:

```js
/* +handler.js */
export const GET = Run.GET((context, next) => {
  const products = loadFromSomewhere();
  return next({ products });
});
```

```marko
/* +page.marko */
<for|p| of=$global.data.products> … </for>
```

Everything passed to `next` merges into `context.data` — `$global.data`
in templates — accumulating down the chain (middleware can contribute
too, next lessons). Why prefer this over in-template fetching? The
data story lives in the request pipeline: it can inspect the request,
set headers, redirect on failure, and the page stays a pure renderer.
In-template `<await>` remains right for per-component data; the
handler owns per-route data.

The bestseller list on the right renders `$global.data.anvils` — which
nobody provides, so the page crashes:

1. Fill in `src/routes/+handler.js`: a `Run.GET` handler that returns
   `next({ anvils: TOP_SELLERS })` (the array is defined in the file).
2. Reload: handler loads, page renders, and check the shape in the
   template — no fetching code anywhere near the markup.
