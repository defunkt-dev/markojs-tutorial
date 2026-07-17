---
type: lesson
title: Handling Events
focus: /src/routes/+page.marko
---

# Handling Events

You've been writing `onClick() { ... }` since lesson one — time to name
what it is. Event handlers in Marko are just attributes whose values
are functions, and the *method shorthand* from the attributes lessons
makes them read like part of the tag:

```marko
<button onClick() { count++ }>Add</button>
```

The naming rule: `on` + the DOM event name, camelCased. `onClick`,
`onInput`, `onSubmit`, `onKeydown`, `onPointermove` — if the browser
fires it, Marko can handle it. And since these are ordinary attributes,
a plain function value works too when you already have one:

```marko
<button onClick=reset>Start over</button>
```

Handlers receive the native DOM event — no wrappers. `e.target`,
`e.preventDefault()`, all the platform tools you already know:

```marko
<form onSubmit(e) { e.preventDefault(); save() }>
```

The page on the right is a color mixer missing its wiring:

1. The "More red" button does nothing — give it
   `onClick() { red += 20 }`.
2. Do the same for green and blue.
3. The swatch should react to the keyboard too: on the `<body>`, hook
   `onKeydown(e) { if (e.key === "r") red = 0 }` so pressing r resets
   red.

Mix yourself a color; every input path updates the same state.
