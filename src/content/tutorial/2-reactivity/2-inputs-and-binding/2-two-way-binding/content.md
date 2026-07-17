---
type: lesson
title: Two-Way Binding
focus: /src/routes/+page.marko
---

# Two-Way Binding

Last lesson ended with a half-connection: events pushed input→state,
but state→input stopped after the seed. Marko closes the loop with the
`valueChange` attribute — and once both directions flow, **there is
only one state**:

```marko
<let/message="hello">
<input value=message valueChange(next) { message = next }>
```

Now typing updates `message`, and assigning `message` updates the
input. And because this reflective handler is so common, Marko gives it
a one-character spelling — the **bind shorthand**:

```marko
<input value:=message>
```

Read `:=` as "bound to." It expands to exactly the `value=` +
`valueChange` pair above. That's the *controllable* pattern: `value=`
alone is uncontrolled (seed and release), `value:=` is controlled
(locked together) — one keystroke moves between the modes. The long
form stays useful when you want to intercept or transform changes
(`valueChange(next) { message = next.toLowerCase() }`).

Rebuild yesterday's echo chamber the modern way, and grow it:

1. Replace the input's `value=` + `onInput` pair with `value:=message`.
2. The `<textarea>` below is wired to nothing — bind it:
   `<textarea value:=bio/>`.
3. Verify both directions: type (state follows), hit either reset
   button (widget follows).

One variable, one widget, zero drift — for text. Checkboxes and their
peculiar friends are next.
