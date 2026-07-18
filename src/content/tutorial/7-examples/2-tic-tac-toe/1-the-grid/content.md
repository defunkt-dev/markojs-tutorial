---
type: lesson
title: The Grid
focus: /src/routes/+page.marko
---

# The Grid

Second app: tic-tac-toe. A board is nine cells, so start with an array
of nine and render it — no need to write nine buttons by hand:

```marko
static const board = ["", "", "", "", "", "", "", "", ""];

<for|cell| of=board>
  <button>${cell}</button>
</for>
```

A CSS grid of three columns turns that flat list into a square. Each
cell is a `<button>` (they'll be clickable soon), and an empty string
renders as a blank square. Add a status line and a reset button too —
static for now.

Lay it out:

1. Add a `static const board` of nine empty strings.
2. Render the cells with `<for|cell| of=board>`, each a `<button>`.
3. Wrap them in a `<div>` styled
   `display:grid;grid-template-columns:repeat(3, 64px);gap:4px`, and
   give each button a fixed `width` and `height`.
4. Add a `<p>` reading `X's turn` and a `Reset` button.

Nine blank squares. Next we make them play.
