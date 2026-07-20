---
type: lesson
mainCommand: ['pnpm run dev --lesson-2-3-6', 'Starting dev server']
template: marko-run-inspect
title: Fine-Grained Bundling
focus: /src/routes/+page.marko
---

# Fine-Grained Bundling

You've seen that a fully static page ships no JavaScript. This lesson
sharpens that into the real rule — and it's finer than it first looks. The
question every server-rendering framework answers is *what JS reaches the
browser?* The popular answer is **islands**: mark a component interactive,
ship the whole component. Marko ships less. Three kinds of code **stay off
the client**:

- **static markup** — it's HTML, not JS;
- **server-only computation** — logic that runs while rendering (loops,
  formatting, derived values) executes on the server; only its *result*
  lands in the HTML, never the code;
- ...leaving only the **interactive pieces** as the sole thing that ships.

The page on the right has all three ingredients: static text and a spec
list, a **server-side price calculation** (`formatPrice`, plus an in-stock
check), and — after your edit — one interactive button.

## First, the static page

Run this in the terminal:

```sh
node inspect.mjs
```

It builds the app unminified (into its own `dist-inspect/`, so the preview
is untouched) and reports what shipped. Right now:

```
── Your page's client bundle ──
(nothing — this page shipped NO page-specific client JavaScript)
```

No interactivity, no bundle at all — not even the code that formats the
price. That computation already ran during render; the HTML just contains
the finished string `$299.00`.

## Your job: add one interactive piece

1. In `src/routes/+page.marko`, add a like counter. Near the top:
   ```marko
   <let/likes=0>
   ```
   ...and at the bottom of the `<body>`:
   ```marko
   <button onClick() { likes++ }>♥ Like (${likes})</button>
   ```
2. Run `node inspect.mjs` again — and read the *whole* report this time:
   ```
   ── Your page's client bundle ──
   var $likes = _let(...);  _script("a0", ... $likes ...);

   ── Stayed on the server — NOT shipped ──
     Static markup:      "Premium wireless"  · not shipped
     Server-only logic:  "formatPrice"       · not shipped
                         "toFixed"           · not shipped
   ── Shipped to the browser ──
     The interactive piece:  "likes"  ▸ SHIPPED
   ```

The bundle now exists — and it holds the counter and **nothing else.** The
static markup stayed HTML. Your `formatPrice` function and the in-stock
check ran during render and **never left the server.** Only the one
reactive button shipped.

## Beyond islands

This is the full "fine-grained" story. Static content — *and* any
computation that only runs at render time — cost **zero** client bytes, even
on a page that does ship some JavaScript. An islands framework draws the
line at the whole component; Marko draws it around each interactive piece.
That's why the pages you build stay so light: you pay for interactivity, not
for markup and not for server logic. The docs'
[*Fine-Grained Bundling*](https://markojs.com/docs/explanation/fine-grained-bundling)
explanation covers how the compiler splits each template in two.
