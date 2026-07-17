---
type: lesson
title: Reading Inputs
focus: /src/routes/+page.marko
---

# Reading Inputs

Form elements are where state meets the real world — and where Marko
makes a deliberate choice worth understanding before the shortcuts
arrive.

By default, inputs are **uncontrolled**: `value=` seeds the starting
value, then the browser owns the input.

```marko
<input value="hello">
```

In some frameworks that's a read-only input. In Marko you can type
freely — the browser manages it natively. But mix in state and you'll
meet the trap the page on the right demonstrates:

```marko
<let/message="hello">
<input value=message>
<div>${message}</div>
```

Type in the input: the div doesn't change. Click the reset button: the
div changes but the input doesn't. **Two states, updating
independently** — Marko's `message` and the input's own internal value,
seeded once and then estranged.

For now, wire it up the manual way you already know — events:

1. Give the input `onInput(e) { message = e.target.value }`.
2. Type again — now the div follows. The reset button still leaves the
   input behind, though: events flow input→state, but nothing flows
   state→input after the seed.

That remaining half-connection is precisely what the next lesson's
binding solves in one character. Feel the friction first; the shorthand
means more that way.
