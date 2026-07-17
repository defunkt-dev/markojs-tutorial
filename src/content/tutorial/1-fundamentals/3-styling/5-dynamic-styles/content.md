---
type: lesson
title: Dynamic Styles
focus: /src/tags/toast.marko
---

# Dynamic Styles

Here's a trick most frameworks can't do: put a `${...}` interpolation
**inside** a style block.

```marko
<style>
  .toast {
    border-color: ${input.tone};
    animation-duration: calc(${input.delay} * 1ms);
  }
</style>

<div class="toast">Saved!</div>
```

It looks like the stylesheet re-renders per value — it doesn't. The
compiler replaces each interpolation with a **CSS custom property**,
extracts the stylesheet into the bundle once as usual, and at render
time a tiny `<style>` element assigns the property values for the
elements that follow. Static stylesheet, dynamic values, no inline
`style=` attribute spaghetti — your state-driven styling lives next to
the rest of the rules.

(And once you learn state in part two, these interpolations join the
reactive graph: value changes update only the custom property.)

The toast component on the right hardcodes its accent color, so the
success and error toasts on the page look identical:

1. In `toast.marko`, replace the hardcoded `#0f766e` in *both* rules
   with `${input.tone}`.
2. Check the preview: same stylesheet, one green toast, one red — each
   instance carrying its own value.

Every style-block feature you've learned composes with this: it works
in LESS blocks, in CSS modules, in discovered files.
