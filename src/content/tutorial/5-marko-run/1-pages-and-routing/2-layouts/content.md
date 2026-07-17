---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-1-2', 'Starting dev server']
title: Layouts
focus: /src/routes/+layout.marko
---

# Layouts

Both pages from last lesson repeat the html/head/body shell and the
nav. marko-run's answer is `+layout.marko`: a component that **wraps
every page at its level and below**, receiving the nested page as —
you know this one — `input.content`:

```marko
/* src/routes/+layout.marko */
<!DOCTYPE html>
<html lang="en">
  <head><title>Acme</title></head>
  <body>
    <nav><a href="/">Home</a> <a href="/about">About</a></nav>
    <${input.content}/>
  </body>
</html>
```

Layouts nest: a `+layout.marko` in a subdirectory wraps inside the
root one. And here's the insight from marko-run's own diagrams: the
layouts and page are **combined at build time into a single
component** — nesting costs nothing at runtime; it's part four's
content mechanism, applied by the router.

:::info
Older marko-run examples name the nested page `input.renderBody` —
Marko 5's name for content. Under Marko 6 it's `input.content`, as
you've learned; if you see `renderBody` in the wild, translate.
:::

The two pages on the right still carry their duplicated shells:

1. Create `src/routes/+layout.marko` with the shell above (the file
   is provided as a stub — fill in `<${input.content}/>` where the
   TODO sits).
2. Strip both pages down to just their unique content — the `<h1>`
   and paragraphs, no doctype, no body, no nav.
3. Both URLs now share one shell; edit the nav in the layout and both
   pages follow.
