---
type: lesson
title: State in Lists
focus: /src/routes/+page.marko
---

# State in Lists

The keyed-list crew had per-row state that only the row cared about —
**local state**, and a `<let>` inside the loop was the whole answer.
But sometimes the *page* needs to know what's happening inside rows.
The to-do list on the right wants a "remaining" counter — and it can't
count checkboxes it can't see.

The move is **hoisting**: the done-ness lives in the `todos` array
itself, and each row gets a *controllable* let bridging its checkbox
to the shared array — part two's interception pattern, now earning its
keep:

```marko
<let/done=todo.done valueChange(done) {
  todos = todos.toSpliced(i, 1, { ...todo, done });
}>
<input type="checkbox" checked:=done>
```

Read it: seed from the array; when the checkbox changes, write a new
array with that one item replaced. All updates flow through the
hoisted `todos`; the counter just derives from it.

That `toSpliced`/spread dance is honest but noisy — this is immer's
other moment (the import is ready):

```marko
<let/done=todo.done valueChange(done) {
  todos = produce(todos, (draft) => { draft[i].done = done });
}>
```

Your turn — the checkboxes on the right are local `<let/done=false>`,
so the counter is stuck at 3:

1. Replace each row's let with the controllable form above — the immer
   version, using the row's `todo` and `i` parameters.
2. Check items off; the counter follows. Delete buttons already splice
   the array — note they only enable once done, and now that state is
   shared, they can.

Local when only the row cares; hoisted when the page does — and the
official Marko docs walk this exact ladder (with a third rung for
complex trees) in the nested-reactivity deep-dive.
