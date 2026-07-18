---
type: lesson
title: List & Item
focus: /src/routes/+page.marko
---

# List & Item

The last app is a to-do list — and the first one big enough to split
into a **child component**. Each row is its own tag, `<todo-item>`,
living in `src/tags/`. The list just loops and hands each todo down:

```marko
<for|todo| of=todos by="id">
  <todo-item todo=todo/>
</for>
```

Everything a parent gives a child arrives on `input`, so the item reads
`input.todo`:

```marko
<!-- src/tags/todo-item.marko -->
<li>
  <input type="checkbox" checked=input.todo.done>
  <span>${input.todo.text}</span>
  <button>Delete</button>
</li>
```

Static for now — a checkbox reflecting `done`, the text, and a delete
button that does nothing yet. Build the shape:

1. In `todo-item.marko`, render the checkbox
   (`checked=input.todo.done`), the `${input.todo.text}`, and a
   `Delete` button.
2. In the page, loop the `todos` with `<for ... by="id">` and render a
   `<todo-item todo=todo/>` for each.
3. The header input, the "N left" line, and the filter buttons are
   there already — leave them static.

A list of items, each its own component. Next we make them do things.
