---
type: lesson
title: Details & Dialogs
focus: /src/routes/+page.marko
---

# Details & Dialogs

Two more native elements carry their own internal state — and Marko
makes both controllable, same pattern as everything in this chapter.

`<details>` tracks whether it's open. Bind it through `open`:

```marko
<let/open=false>
<details open:=open>
  <summary>Spoilers</summary>
  The butler did it.
</details>

<button onClick() { open = false }>Collapse</button>
```

`<dialog>` binds `open` the same way — with one honest caveat from the
docs: that covers *non-modal* dialogs. Modal ones need the element's
`.showModal()` method directly, and closing a modal that way fires the
browser's close event, but opening never fires anything — so
`openChange` can't observe an open. Bind non-modal dialogs; drive modal
ones imperatively.

The FAQ on the right is three independent `<details>` — the "Collapse
all" button is wired to state nothing else respects:

1. Give each `<details>` its binding: `open:=q1`, `open:=q2`,
   `open:=q3`.
2. Open a few, click Collapse all — state wins, all fold.
3. Note the summary line showing how many are open — it's just a
   `<const>` counting booleans, and now it live-updates as you toggle
   *by clicking the elements themselves*: the binding flows both ways.

That's the full controllable roster you'll meet in the wild: inputs,
textareas, selects, details, dialogs — one `:=` pattern across all of
them.
