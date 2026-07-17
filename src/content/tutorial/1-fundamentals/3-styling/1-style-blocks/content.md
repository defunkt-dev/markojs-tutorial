---
type: lesson
title: Style Blocks
focus: /src/tags/badge.marko
---

# Style Blocks

A component's markup and its styles like to live together. In Marko, a
`.marko` file can contain a `<style>` block:

```marko
<style>
  .badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
  }
</style>
```

Two things to know about it:

1. **It loads once.** However many times the component renders, Marko
   bundles the styles into the page's CSS a single time. Put a
   component's styles in the component's file without worrying about
   duplication.
2. **It's regular CSS — not scoped.** Class names are global, so a
   `.badge` rule styles every `.badge` on the page. Many Marko projects
   use naming conventions like BEM for this; Marko also has a built-in
   scoping answer, a few lessons ahead.

On the right, `src/tags/badge.marko` renders an unstyled span, and the
page shows three badges — one of them marked urgent.

1. Add the `<style>` block from above to `badge.marko`, and give the
   span `class="badge"`.
2. Make urgency visible: extend the class to
   `class=["badge", { urgent: input.urgent }]` — the object/array form
   you learned in the shorthands lesson — and add a `.badge.urgent`
   rule with `background: crimson; color: white;`.

This chapter is all about where styles can live and what they can do —
starting next lesson with a superpower hiding in the tag name itself.
