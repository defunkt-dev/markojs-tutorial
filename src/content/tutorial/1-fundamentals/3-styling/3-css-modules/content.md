---
type: lesson
title: CSS Modules
focus: /src/tags/profile-card.marko
---

# CSS Modules

Lesson one warned you: style blocks are global. The page on the right
proves it — the page defines a `.title` for its headline, the
`profile-card` tag defines its own `.title`, and the two rules are
currently fighting over every title on the page.

Marko's built-in fix is one slash away. Give the `<style>` tag a
name — the same slash-name you've seen on `<let>` — and it becomes a
[CSS Module](https://github.com/css-modules/css-modules):

```marko
<style/styles>
  .foo { border: 1px solid red }
  .bar { color: green }
</style>

<div class=styles.foo/>
<div class=[styles.foo, styles.bar]/>
```

Two things happen: every class name in the block gets compiled to a
unique hashed name (scoped, collision-proof), and `styles` becomes an
object mapping your names to the real ones. You stop writing class
*strings* and start referencing class *values* — typo a name and it's
`undefined`, visibly broken, instead of silently unstyled. All the
class forms you know still work: single, arrays, objects.

Fix the collision:

1. In `profile-card.marko`, change `<style>` to `<style/styles>`.
2. Update its markup: `class="card"` becomes `class=styles.card`, and
   `class="title"` becomes `class=styles.title`.
3. The page's own `.title` and the card's are now strangers — check
   the preview: big page headline, compact card titles, no bleed in
   either direction.

Global by default, scoped by choice, one slash between them.
