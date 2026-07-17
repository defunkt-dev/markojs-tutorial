---
type: lesson
title: Binding Your Own Tags
focus: /src/tags/stepper.marko
---

# Binding Your Own Tags

Everything binding has done for native inputs, it does for **your**
tags — because `:=` was never input magic. On any tag,
`value:=count` expands to `value=count` plus a `valueChange` handler.
Which means a custom tag joins the party by doing two things: read
`input.value`, call `input.valueChange`.

There's a `<let>` form built exactly for this — the bind shorthand on
the state itself:

```marko
/* stepper.marko */
<let/count:=input.count>

<button onClick() { count-- }>-</button>
${count}
<button onClick() { count++ }>+</button>
```

`<let/count:=input.count>` means: initialize from `input.count`, and if
the parent supplied a `countChange` handler, route my updates through
it. That one line makes the tag **controllable** — usable both ways:

```marko
// uncontrolled — stepper keeps its own state
<stepper count=1/>

// controlled — parent owns the state, stepper drives it
<let/players=2>
<stepper count:=players/>
```

The page on the right has two steppers: the uncontrolled one already
works; the bottom one *should* share the page's `players` state, but
`stepper.marko` hardcodes `<let/count=0>` — so the page's Reset button
and summary ignore it.

1. In `stepper.marko`, change `<let/count=0>` to
   `<let/count:=input.count>`.
2. In the page, change the second stepper's `count=players` to
   `count:=players`.

Step it, reset it, read the summary: parent and child, one state.
