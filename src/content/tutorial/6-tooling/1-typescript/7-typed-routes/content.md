---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-7', 'Starting dev server']
title: Typed Routes
focus: /src/routes/products/$id/+handler.ts
---

# Typed Routes

Part 5's whole routing story gets types for free. Because this
project has a `tsconfig.json`, marko-run generates
`.marko-run/routes.d.ts` on every build — dev included — describing
*your actual routes*. That file (already in the tsconfig's `include`)
is what makes the ambient `Run` namespace smart:

- In a route file, `Run.Context` knows the **exact params** of the
  routes that file serves — `context.params.id` here is a `string`
  because the folder is `$id`, and `context.params.slug` simply
  doesn't exist.
- `Run.GET`, `Run.POST`, and friends infer everything through:
  validated `search`/`body` types and the data passed to `next(...)`
  flow into downstream handlers, layouts, and pages.
- `Run.href("/products/:id", ...)` type-checks URLs against the
  routes the app actually serves.

The handler on the right doesn't believe any of that yet — it assigns
`context.params.id` to a `number`. Run `pnpm check`: TS2322, straight
from the generated route types.

1. Fix the handler: params are strings, so parse it —
   `const idNum = Number(context.params.id);`
2. Keep the guard: non-numeric ids already `return new Response(...)`
   with a 404.
3. `pnpm check` — silent. Click a product link in the preview: the
   page reads the same param via `$global.params.id`.

:::info
App-wide context (a database handle, a session helper) can be typed
once via interface merging:
`declare module "@marko/run" { interface Context { db: Db } }` —
then every route's `context.db` is typed. The adapter-provided
`Platform` interface extends the same way. Route-*specific* data
should keep flowing through `next(data)` instead, which types itself
per route.
:::

Curious what's inside `.marko-run/routes.d.ts`? Open it. Two layers,
deliberately: a `declare module "@marko/run"` block registers your
app's *whole route table* with the framework's types (that's what
powers `Run.href`), and then one `declare module` per routable file
grants that file its ambient `Run` namespace, narrowed to *its*
routes — which is why `context.params` differs per handler. You'll
also spot a `MarkoRun` namespace marked deprecated: that's the same
thing under its older name, kept so existing code keeps checking.

You should see the product pages serving with their ids, and a quiet
check. One lesson left in this chapter: the corners of the `Marko`
namespace you haven't met yet.
