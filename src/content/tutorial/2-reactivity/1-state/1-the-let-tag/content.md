---
type: lesson
title: The let Tag
focus: /src/routes/+page.marko
---

# The let Tag

Back in lesson one you clicked a counter and were told "later." It's
later. The `<let>` tag declares **state** — a value that can change,
where every change updates the page:

```marko
<let/count=1>

<button onClick() { count++ }>
  Current count: ${count}
</button>
```

Read `<let/count=1>` as: create a state variable named `count`,
starting at 1. The name after the slash is a *tag variable* — the tag's
way of giving you something to hold. When you assign to `count` —
`count++`, `count = 5`, anything — every expression that uses it
re-runs. That's the whole reactive system: **assignment is the
trigger.** No setter functions, no wrappers; the compiler tracks it.

One subtlety worth knowing early: the `=1` is only the *initial* value.
If it came from something that later changes, `count` doesn't follow it
— state updates through assignment alone. (There's an advanced form
that changes this; it arrives at the end of this chapter's binding
lessons.)

The page on the right is a broken applause meter — clapping does
nothing because `claps` is an ordinary constant. Fix it:

1. Replace `static const claps = 0;` with `<let/claps=0>` placed just
   inside `<body>`.
2. Make the button's handler count: `onClick() { claps++ }`.

Clap away. The count climbs; the page keeps up.
