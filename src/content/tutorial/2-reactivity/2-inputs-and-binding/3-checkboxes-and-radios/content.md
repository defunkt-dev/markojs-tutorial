---
type: lesson
title: Checkboxes & Radios
focus: /src/routes/+page.marko
---

# Checkboxes & Radios

Text inputs bind their `value`. Checkboxes and radios track something
else — whether they're **checked** — so they bind differently.

A lone checkbox binds a boolean through `checked`:

```marko
<let/subscribed=false>
<input type="checkbox" checked:=subscribed>
```

For *groups*, Marko adds a `checkedValue=` attribute: each input keeps
its own `value=`, and whichever matches `checkedValue` is checked.
Bind it and the group drives one variable:

```marko
// radios — one string, one winner
<let/size="medium">
<input type="radio" value="small" checkedValue:=size>
<input type="radio" value="medium" checkedValue:=size>

// checkboxes — an array, many winners
<let/toppings=["cheese"]>
<input type="checkbox" value="cheese" checkedValue:=toppings>
<input type="checkbox" value="olives" checkedValue:=toppings>
```

String for radios, array for checkboxes — the same attribute, and no
per-input handlers juggling array pushes yourself.

The pizza order on the right is all manual wiring and half broken:

1. The gift-wrap checkbox: replace its `checked=` + `onChange` pair
   with `checked:=giftWrap`.
2. The three size radios: give each `checkedValue:=size` (keep their
   `value=` attributes; delete the onChange handlers).
3. The two topping checkboxes: same move — `checkedValue:=toppings`.

The order summary below updates itself from all three bindings. Toggle
everything; watch one source of truth hold.
