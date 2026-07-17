---
type: lesson
title: Derived Values
focus: /src/routes/+page.marko
---

# Derived Values

Some values aren't state of their own — they're *computed from* state.
A doubled count. A filtered list. A total. For those, Marko has
`<const>`:

```marko
<let/count=1>
<const/doubleCount=count * 2>
```

Whenever `count` changes, `doubleCount` recomputes. You never assign to
it — it's derived, always correct, impossible to forget to update.
That's the division of labor: `<let>` for values you change, `<const>`
for values that follow.

(Don't confuse it with `static const` from part one: `static` runs once
when the template loads and can't react to anything. `<const>` is
per-instance and lives inside the reactive graph.)

The page on the right sells tickets and does its math inline — the
price appears in two places, written out twice, one of them already
wrong. Fix the duplication:

1. Under the `<let>` declarations, derive once:
   `<const/total=tickets * PRICE>`.
2. Replace both inline calculations with `${total}` — including the
   broken one.

Now bump the ticket count: one derivation, both places correct, forever.
