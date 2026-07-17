---
type: lesson
title: Objects & Arrays in State
focus: /src/routes/+page.marko
---

# Objects & Arrays in State

State isn't always a number. Put an object or an array in a `<let>` and
one rule carries over unchanged: **assignment is the trigger.** Marko
reacts when you assign to the tag variable — not when you reach inside
and mutate what it holds.

```marko
<let/user={ name: "Alice", visits: 1 }>

// ✅ triggers an update — the variable was assigned
<button onClick() { user = { ...user, visits: user.visits + 1 } }>

// ❌ silent — mutation, no assignment
<button onClick() { user.visits++ }>
```

So the working style is: build the next value, assign it. Spreads for
objects; for arrays, the non-mutating tools — `concat`, `filter`,
`map`, `toSorted` — or spread-and-modify:

```marko
<let/items=["a", "b"]>
<button onClick() { items = [...items, "c"] }>Add</button>
<button onClick() { items = items.filter((x) => x !== "a") }>Drop a</button>
```

The page on the right is a reading log with two dead buttons — both
mutate. Repair them with assignment:

1. "Log a page": replace `book.pagesRead++` with
   `book = { ...book, pagesRead: book.pagesRead + 1 }`.
2. "Add genre": replace `book.tags.push("classic")` with
   `book = { ...book, tags: [...book.tags, "classic"] }`.

If that nested spread felt clunky — good instinct. Deeply nested
updates get noisy, and there are patterns (and a library) that clean
them up; the reactivity deep-dive at the end of this part and the
state-in-lists lesson in part three pick that up.
