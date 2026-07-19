---
type: lesson
template: marko-run-forms
title: A Validated Form
focus: /src/tags/signup-form.marko
---

# A Validated Form

A form is a little pile of state: the current values, which fields have
errors, whether it's been submitted, whether it's mid-submit. You *can*
track all of that with `<let>`s by hand — but validation rules,
touched-vs-untouched, submit handling and the rest pile up quickly.
`final-form` is a tiny, framework-agnostic library that owns exactly that
state, and it bridges into Marko the same way the signals store did:
subscribe, and push its state into `<let>`s.

## Wiring it up (already done)

`createForm({ onSubmit, validate })` builds a form instance. One catch:
that instance isn't serializable, so it can't be created during
server-side rendering and shipped to the browser. So the component builds
it **client-side**, inside the `<script>`, and keeps the reference in a
`<let>` that starts out `null`:

```marko
<let/form=null>
<script>
  const f = createForm({ onSubmit, validate });
  form = f;
  $signal.onabort = f.subscribe((state) => {
    values = state.values;
    errors = state.errors;
    // ...submitFailed, submitSucceeded
  }, { values: true, errors: true, submitFailed: true, submitSucceeded: true });
</script>
```

`f.subscribe` is the now-familiar bridge: it fires with the latest form
state on every change and returns the unsubscribe you hand to
`$signal.onabort`. With that in place, the template just reads those
`<let>`s and calls back into the form — the input's `onInput` calls
`form.change("email", …)`, and the form's `onSubmit` calls `form.submit()`.
The page renders on the server with an empty field; the form wakes up in
the browser after hydration.

## The one thing left: validation (your job)

`createForm` takes a `validate` function, and its contract is simple:
given the current `values`, return an **errors object** — a key for each
field that's wrong, empty when everything's fine. final-form runs it on
every change and blocks `submit` while any error stands.

Open `src/tags/signup-form.marko` and fill it in — require an email, and
check it at least looks like one:

```js
validate(values) {
  const errors = {};
  if (!values.email) errors.email = "Email is required";
  else if (!values.email.includes("@")) errors.email = "Enter a valid email";
  return errors;
}
```

Now try the form. Empty or malformed, **Sign up** shows the error and
refuses to submit; a real address goes through and you get the success
line. You never wrote a submit guard or an error-display toggle —
final-form tracks `errors` and `submitFailed`, your `<let>`s mirror them,
and the template reacts.

:::info
The error appears only *after* a submit attempt here, because the template
gates it on `submitFailed`. Swap that for final-form's per-field `touched`
state (register fields with `form.registerField`) and you get
"validate as you leave the field" instead — same data, different moment.
:::

:::tip
`validate` is just a function returning an object, so it's an easy place
for real rules: cross-field checks (password vs. confirmation), async
lookups (is this username taken?), or a schema library like Zod or Yup —
hand back its errors in the same `{ field: message }` shape.
:::

That's client-side form handling in Marko: a library owns the form's
state, the subscribe bridge flows it into your component, and your only
real job is the rules.
