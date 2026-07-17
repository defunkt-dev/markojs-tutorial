---
type: lesson
title: Transforming Bound Values
focus: /src/routes/+page.marko
---

# Transforming Bound Values

Here's a classic papercut: number inputs hand you **strings**. Bind
`value:=quantity` on `<input type="number">` and after one keystroke
your "number" is `"3"` — then `quantity * price` does string math
somewhere and your total reads like a phone number.

You could fall back to the long form and convert in the handler. But
this need is so common the bind shorthand has a slot for it — a
**refining function**, named between the colons:

```marko
<input type="number" value:Number:=quantity>
```

Read it as: bound to `quantity`, refined through `Number`. It expands
to:

```marko
<input type="number" value=quantity valueChange(next) { quantity = Number(next) }>
```

Any function that takes the raw value and returns what you want stored
can sit in that slot — `Number`, `parseFloat`, `Math.round`, or one of
your own:

```marko
static const clamp = (v) => Math.min(100, Math.max(0, Number(v)));
<input type="number" value:clamp:=percent>
```

The order form on the right is doing phone-number math right now:

1. Type a quantity and look at the total — string concatenation in the
   wild.
2. Fix it: change `value:=quantity` to `value:Number:=quantity`.
3. The percent-off input has the same disease with worse symptoms —
   apply the provided `clamp` refiner: `value:clamp:=discount`. Now try
   typing 150.

One identifier between two colons: type-correct state at the door.
