---
type: lesson
title: Using SCSS
focus: /src/tags/note.marko
template: marko-scss
---

# Using SCSS

Back in the LESS lesson you met the trick: name a `<style>` block after
a preprocessor, and Marko runs it through that preprocessor. **SCSS** —
the most common flavour of Sass — works exactly the same way, with
`<style.scss>`. The only setup difference is which package is installed:
this project has `sass` instead of `less`.

The syntax will feel familiar, with one thing to remember — Sass
variables start with `$`, not `@`:

```marko
<style.scss>
  $accent: #7c3aed;

  .note {
    border-left: 4px solid $accent;

    .title { color: $accent; }
    &:hover { box-shadow: 0 2px 8px $accent; }
  }
</style>
```

Nesting, the `&` parent selector, and one place to change a value — all
the same as LESS.

`src/tags/note.marko` has that same violet written out over and over.
Refactor it:

1. Change `<style>` to `<style.scss>`.
2. Hoist the colour into `$accent: #7c3aed;` and use it everywhere.
3. Nest `.title` and `.tag` inside `.note`, and turn `.note:hover` into
   `&:hover`.

Same CSS out the other end — pick `$` (SCSS) or `@` (LESS) to taste;
both are just Marko style blocks with an extension.
