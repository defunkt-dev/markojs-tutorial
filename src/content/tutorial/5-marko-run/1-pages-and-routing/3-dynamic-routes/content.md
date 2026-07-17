---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-1-3', 'Starting dev server']
title: Dynamic Routes
focus: /src/routes/anvils/$id/+page.marko
---

# Dynamic Routes

Real apps have URLs like `/anvils/classic-9` — one page template, many
addresses. In marko-run, a directory named with a leading dollar sign
is a **dynamic segment**: `$id` matches any value there and captures
it as the parameter `id`.

```text
src/routes/
  anvils/
    $id/
      +page.marko    →  /anvils/anything
```

Inside the page, the captured values live on `$global.params` — your
first working `$global`, the render-globals object part four
foreshadowed; the router fills it per request:

```marko
<h1>Anvil: ${$global.params.id}</h1>
```

(The full path family, next lesson: `$` captures one segment; `$$`
catches all remaining ones; `_underscore` directories organize files
without affecting the URL.)

The catalog on the right links three anvils to `/anvils/<id>`, but the
detail page under `anvils/$id/` ignores the URL and shows a hardcoded
model:

1. In `anvils/$id/+page.marko`, replace the hardcoded `"classic-9"`
   lookup with `$global.params.id`.
2. Click each catalog link — one template, three pages, each showing
   its own model (and try an id that isn't in the catalog: the
   template's not-found branch renders, an `<if>` from part three
   doing honest work).
