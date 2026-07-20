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

## Pass promises, don't await them

The bestseller array here is synchronous, so `next({ anvils })` hands
over a ready list. But when route data is loaded **asynchronously** — a
database query, a `fetch` — there's a rule worth learning: **don't
`await` it in the handler, pass the promise.** marko-run streams, so
handing down an unresolved promise lets the response start at once (the
`<head>` and static markup flush while the data is still loading), and
the template's `<await>` releases each section as its promise settles:

```js
export const GET = Run.GET((context, next) =>
  next({ products: loadProducts() }), // no await — pass the promise
);
```
```marko
<await|products|=$global.data.products>
  <for|p| of=products> … </for>
</await>
```

Every `await` *before* `next` holds back the whole response until it
resolves — forfeiting streaming and delaying even parts that never
needed the data. Keep independent sources as separate promises so their
`<await>`s flush independently.

The bestseller list on the right renders `$global.data.anvils` — which
nobody provides, so the page crashes:

1. Fill in `src/routes/+handler.js`: a `Run.GET` handler that returns
   `next({ anvils: TOP_SELLERS })` (the array is defined in the file).
2. Reload: handler loads, page renders, and check the shape in the
   template — no fetching code anywhere near the markup.
