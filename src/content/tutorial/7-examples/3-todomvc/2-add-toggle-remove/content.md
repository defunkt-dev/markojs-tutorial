---
type: lesson
title: Add, Toggle, Remove
focus: /src/routes/+page.marko
---

# Add, Toggle, Remove

Now the behaviour — and the second communication channel. Data goes
**down** on `input`; a child talks **back up** by calling a function
the parent passed. Marko has no `emit` — you hand the child a callback
and it calls it:

```marko
<!-- parent -->
<todo-item todo=todo onDelete() { todos = todos.filter((t) => t.id !== todo.id) }/>

<!-- child -->
<button onClick() { input.onDelete() }>Delete</button>
```

The parent owns the list, so every change is the same move you learned
for arrays — **build a new array and assign it**: `filter` to delete,
`map` with a spread to toggle one item's `done`, spread to add.

Wire it up:

1. Make `todos` a `<let>`, add a `<let/draft="">` for the input, and
   bind the input with `value:=draft`.
2. Add an **Add** button that appends a new todo —
   `todos = [...todos, { id: Date.now(), text: draft.trim(), done: false }]` —
   and clears the draft.
3. Pass `onToggle` and `onDelete` handlers to each `<todo-item>`; in the
   child, call `input.onToggle()` from the checkbox's `onChange` and
   `input.onDelete()` from the button.
4. Derive the count — `<const/remaining=...>` over the undone todos —
   and make **Clear completed** drop the done ones.

Add, check off, delete — a working list. One channel down, one up.
