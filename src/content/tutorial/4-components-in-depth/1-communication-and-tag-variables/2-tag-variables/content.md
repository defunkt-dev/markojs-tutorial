---
type: lesson
title: Tag Variables
focus: /src/routes/+page.marko
---

# Tag Variables

The slash-name has been hiding in plain sight since `<let/count=0>`.
Time for the general rule: **a tag variable exposes a value *from* a
tag to the rest of the template.** Slash, then any identifier — or
even a destructuring pattern:

```marko
<my-tag/foo/>
<my-other-tag/{ bar, baz }/>
```

`<let>`'s state, `<const>`'s derived value, CSS Modules' `styles`
object — all tag variables. And here's the new power: **native tags
have one too.** It's an implicit return of the element itself:

```marko
<input/emailInput/>

<button onClick() { emailInput().focus() }>
  Go to email
</button>
```

Note the call — `emailInput()` — the variable is a *getter* for the
element (it can't exist until the browser mounts it). Two scope rules
worth knowing: tag variables are hoisted, readable anywhere in the
template regardless of nesting; and one declared inside a `<for>`
becomes iterable from outside — a list of per-iteration values.

The signup form on the right has a "Fix it" link in its error summary
that should jump focus to the offending field:

1. Name the email input's element: `<input/emailField type="email" …>`.
2. Wire the link: `onClick(e) { e.preventDefault(); emailField().focus(); }`.
3. Click it — focus lands in the field, no `document.querySelector` in
   sight, and the reference lives happily *outside* the form that
   contains the input, courtesy of hoisting.

Next lesson: what happens when *custom* tags want a slash-name of
their own.
