---
type: lesson
title: Filtering & Polish
focus: /src/routes/+page.marko
---

# Filtering & Polish

The classic TodoMVC finish: filter by All / Active / Completed, an empty
state, and a strike-through on done items.

Filtering is just another piece of derived state. Keep a `filter`
variable and derive the list you actually render from it — the full
`todos` stays intact underneath:

```marko
<let/filter="all">
<const/shown=applyFilter(todos, filter)>

<for|todo| of=shown by="id"> ... </for>
```

The filter buttons set `filter`; the `<for>` loops `shown` instead of
`todos`. An `<if>` covers the empty case, and the item component strikes
through completed text with a derived inline style.

Finish it:

1. Add a `<let/filter="all">` and an `applyFilter` helper, derive
   `<const/shown=...>`, and loop it instead of `todos`.
2. Wire the **All / Active / Completed** buttons to set `filter`.
3. Add an `<if=(shown.length === 0)>` empty message.
4. In `todo-item.marko`, strike through the text when
   `input.todo.done` — a derived `style`.

That's TodoMVC — child components, two-way communication, dynamic lists,
and derived filtering — and the end of Part 7. You've assembled a real
app entirely from the pieces the earlier parts gave you.
