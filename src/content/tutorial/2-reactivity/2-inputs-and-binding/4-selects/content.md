---
type: lesson
title: Selects
focus: /src/routes/+page.marko
---

# Selects

The `<select>` element is HTML's odd one out: its state lives in the
`selected` attribute of whichever `<option>` won. Marko smooths that
over — a `value=` attribute on the `<select>` itself mirrors the
selected option, and it binds like any other:

```marko
<let/lang="en">
<select value:=lang>
  <option value="en">English</option>
  <option value="pt-br">Portuguese (Brazil)</option>
  <option value="it">Italian</option>
</select>
```

No `selected` juggling, no change handler mapping — the variable *is*
the selection, both directions.

Multi-selects follow the checkbox precedent: with `multiple`, bind an
**array** and every selected option lives in it:

```marko
<let/teams=["red"]>
<select multiple value:=teams>
  <option value="red">Red</option>
  <option value="blue">Blue</option>
</select>
```

The shipping form on the right still does it the hard way:

1. The country dropdown tracks selection via `onChange` and marks an
   option with a ternary on `selected=` — replace all of that with
   `value:=country` on the `<select>` (options keep only their
   `value=`).
2. The interests multi-select is wired to nothing: bind it with
   `value:=interests`.
3. The "Ship to Italy" button already assigns `country = "it"` — click
   it and confirm the dropdown follows state, not just the reverse.

One attribute, both select flavors, no ceremony.
