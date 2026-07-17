---
type: lesson
title: Assignable Return
focus: /src/tags/counter.marko
---

# Assignable Return

Last lesson the parent could *read* a child's returned value. The full
circle: let the parent **assign** to it. `<return>` accepts a
`valueChange` handler — the same interception contract as everything
in part two — and with it, the returned tag variable becomes writable
from outside:

```marko
/* counter.marko */
<let/count=0>
<return=count valueChange(next) { count = next }>

<button onClick() { count++ }>${count}</button>
```

```marko
/* the parent */
<counter/count/>

<button onClick() { count = 0 }>Reset</button>
```

The parent's `count = 0` routes through the child's `valueChange`,
which updates the child's own state. Notice the design consistency:
this is `:=`'s machinery — value plus change handler — applied to a
tag variable. Marko keeps re-using one contract. (And here's a mind-
bender from the docs: `<let>` itself is conceptually just
`<return=value valueChange(...)>` around some state.)

The game page on the right embeds a `counter` and has a Reset button
assigning to its tag variable — currently a runtime error, because the
child's return is read-only:

1. In `counter.marko`, extend the return:
   `<return=count valueChange(next) { count = next }>`.
2. Play: click the counter up, hit Reset — parent writes, child obeys,
   both stay in sync through one state that lives where it belongs, in
   the child.
