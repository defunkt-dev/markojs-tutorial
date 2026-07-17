---
type: lesson
title: Using LESS
focus: /src/tags/pricing.marko
---

# Using LESS

That `<style>` tag has a superpower in its name: add a file extension
and Marko runs the block through the matching CSS preprocessor.

```marko
<style.less>
  @primary-color: blue;

  .fancy {
    color: @primary-color;
  }
</style>
```

`<style.less>` gets LESS — variables, nesting, mixins; `<style.scss>`
gets SCSS the same way. The preprocessor just needs to be installed in
the project (this one has `less` ready).

Why bother? Look at `src/tags/pricing.marko` on the right: the same
teal appears four times, and every `.pricing`-something selector is
spelled out in full. Classic maintenance bait — change the brand color,
miss a spot.

Refactor it into LESS:

1. Change `<style>` to `<style.less>`.
2. Hoist the color: `@brand: #0f766e;` at the top, then use `@brand`
   in all four places (for the border, background, and the darkened
   footer, LESS math works too: `darken(@brand, 10%)`).
3. Nest the child rules inside `.pricing` — the `&`-free nesting turns
   `.pricing .price` into `.price { ... }` inside the `.pricing` block,
   and `.pricing:hover` becomes `&:hover`.

Same CSS out the other end, one place to change the brand, selectors
that mirror the markup's shape.
