---
type: lesson
title: Ranges & Objects
focus: /src/routes/+page.marko
---

# Ranges & Objects

`of=` is one of three ways `<for>` can iterate.

**Objects**, with `in=` — parameters become key and value:

```marko
<for|key, value| in={a: 1, b: 2, c: 3}>
  ${key}: ${value}
</for>
```

**Number ranges**, with `from=` / `step=` and either an exclusive
`until=` or an inclusive `to=`:

```marko
<for|num| until=5>${num}</for>          // 0 1 2 3 4
<for|num| from=3 to=7>${num}</for>      // 3 4 5 6 7
<for|num| from=2 to=10 step=2>${num}</for>  // 2 4 6 8 10
```

No counter array to build, no Object.entries dance — the tag speaks
all three natively.

The dice game scoreboard on the right needs both:

1. The score table is written out by hand — replace the three rows
   with `<for|player, score| in=scores>` around one `<tr>`, cells
   `${player}` and `${score}`.
2. The die faces below should show 1 through 6 — replace the
   hardcoded spans with `<for|n| from=1 to=6>` around one
   `<span>⚀${n}</span>`-style face (just render `[${n}]`).
3. Add a player to the `scores` object; the table follows.
