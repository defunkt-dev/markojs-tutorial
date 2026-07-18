---
type: lesson
title: Taking Turns
focus: /src/routes/+page.marko
---

# Taking Turns

Make the board real state, then handle clicks. Two things fall out of
the board array on their own, so **derive** them rather than track them
separately: whose turn it is (count the filled cells — X on even, O on
odd) and whether anyone has won.

Winner-checking is the same maths every render, so it belongs in a
`static` helper fed a board. The eight winning lines are just data:

```marko
static const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

static const winnerOf = (b) => {
  for (const [x, y, z] of LINES) {
    if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x];
  }
  return null;
};
```

Clicking a cell places the current player's mark — but remember
**assignment is the trigger**, so build a new board and assign it
rather than mutating in place. And guard it: no overwriting a filled
cell, no moves after a win.

```marko
onClick() { if (!cell && !winner) board = board.map((c, idx) => idx === i ? player : c) }
```

Wire it up:

1. Add `LINES` and the `winnerOf` helper.
2. Make `board` a `<let>` of nine empty strings; derive
   `<const/winner=winnerOf(board)>` and a `<const/player=...>` from the
   count of filled cells.
3. Give each cell the guarded `onClick` above — you'll need the index,
   so switch to `<for|cell, i| of=board>`.
4. Show the status —
   `${winner ? winner + " wins!" : player + "'s turn"}` — and make
   Reset assign a fresh empty board.

It plays. Someone can win — the board just doesn't say so loudly yet.
