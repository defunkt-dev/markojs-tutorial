---
type: lesson
title: Per-Item Styles
focus: /src/routes/+page.marko
---

# Per-Item Styles

Remember dynamic styles from the styling chapter — `${...}` inside a
`<style>` block, compiled to CSS custom properties that apply to the
elements after the tag? Put one *inside a loop* and that "after"
becomes per-iteration: each pass renders its own tiny value
assignment, so every item carries its own numbers in a shared,
static stylesheet.

```marko
<for|brand| of=brands>
  <style>
    .brand {
      color: ${brand.color};
    }
  </style>
  <a class="brand" href=brand.url>${brand.name}</a>
</for>
```

One stylesheet, one `.brand` rule, three colors — the interpolation
resolves per item.

A caveat straight from the docs, worth committing to memory: each
iteration renders a real `<style>` element *among* the items, so
positional selectors like `:nth-child` count those style elements and
miss their targets. Use `:nth-of-type`, which counts only same-tag
elements and skips the interlopers.

The tag cloud on the right renders every topic the same size and
color, ignoring the `weight` and `hue` in the data:

1. Inside the `<for>`, before the `<span>`, add a `<style>` block with
   a `.topic` rule using both:
   `font-size: calc(${topic.weight} * 0.5rem);` and
   `color: hsl(${topic.hue}, 70%, 40%);`
2. Give the span `class="topic"`.

Six topics, six sizes, six hues, one rule.
