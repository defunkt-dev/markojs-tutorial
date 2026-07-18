---
type: lesson
title: Winning
focus: /src/routes/+page.marko
---

# Winning

Three finishing touches: announce a draw, highlight the winning line,
and colour the marks.

For the highlight, have the helper return the winning **line** — the
three indices — rather than just the mark. Then a cell knows to light up
when its own index is in that line. A draw is "every cell filled, nobody
won." Both are derived from the board:

```marko
<const/line=winningLine(board)>
<!-- a cell's background: -->
background:${line?.includes(i) ? "#bbf7d0" : "white"}
```

Everything stays inline — the cell's colour, its highlight, and a
`default` cursor once it's filled or the game is over — all computed
from state.

Finish it:

1. Change the helper to return the winning line; derive
   `<const/line=...>` and an `over` flag (a win **or** a full board).
2. Fold a draw message into the status: winner, then draw, then whose
   turn it is.
3. In each cell's `style`, derive `background` from `line?.includes(i)`,
   `color` from the mark, and `cursor` from whether the cell is still
   playable.

A complete game — turns, wins, draws, and a highlight — built from an
array, a loop, derived values, and guarded handlers. One app left.
