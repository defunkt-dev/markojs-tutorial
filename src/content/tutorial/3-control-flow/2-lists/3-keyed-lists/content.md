---
type: lesson
title: Keyed Lists
focus: /src/routes/+page.marko
---

# Keyed Lists

Here's a bug every framework has, and every framework solves the same
way. When a list reorders, Marko needs to know which rendered item
corresponds to which data item. Without help, it matches **by
position** — first row is first row — and anything living inside the
rows (state, form values, DOM) stays put while the data moves under it.

Watch it happen on the right: each crew member's row has its own
"aboard" checkbox (a `<let>` per iteration — loop content gets its own
state per pass). Check Ada's box, then hit Sort by name. The check
stays on the *first row* — now Alan's. The state didn't follow Ada;
it stayed at position zero.

The fix is the `by=` attribute — a key telling Marko each item's
identity:

```marko
<for|user| of=users by=user => user.id>
```

And when items have the key as a property, a string shorthand:

```marko
<for|user| of=users by="id">
```

Fix the crew list: add `by="id"` to the `<for>`. Check Ada, sort,
shuffle — the check now travels with Ada wherever her row goes.

Rule of thumb: any list that can reorder, insert, or remove — and
holds anything stateful — gets a `by=`. Position-keying is only safe
for append-only, stateless rendering.
