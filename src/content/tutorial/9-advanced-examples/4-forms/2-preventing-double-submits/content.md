---
type: lesson
mainCommand: ['pnpm run dev --lesson-9-4-2', 'Starting dev server']
template: marko-run-forms
title: Preventing Double Submits
focus: /src/tags/signup-form.marko
---

# Preventing Double Submits

The form from the last lesson validated instantly, but its `onSubmit`
did nothing — submitting was over before you could notice. Real submits
hit a server and **take time**, and that gap is a trap: the button still
says "Sign up" and still looks clickable, so an impatient user clicks it
again. Now you've got two signups.

This lesson's `onSubmit` is async — it waits 1.5 seconds, standing in for
a network round-trip. The fix is the standard one: **while the request is
in flight, disable the button and say so.**

## `submitting` is already tracked (setup)

You don't have to track "is it mid-submit" yourself — `final-form`
exposes it as **`submitting`**, true from the moment `onSubmit` starts
until its promise resolves. The subscribe bridge already mirrors it into
a `<let>`, right beside `values` and `errors`:

```marko
$signal.onabort = f.subscribe(
  (state) => {
    // ...values, errors, submitFailed, succeeded
    submitting = state.submitting;
  },
  { /* ..., */ submitting: true },
);
```

So `submitting` is sitting there, flipping true then false at exactly the
right moments. The button just doesn't use it yet.

## Your job: reflect it on the button

Open `src/tags/signup-form.marko` and make the submit button respond to
`submitting`:

1. Replace the button with one that disables while submitting and shows
   progress:
   ```marko
   <button type="submit" disabled=submitting>
     ${submitting ? "Submitting…" : "Sign up"}
   </button>
   ```
2. Submit a valid email. The button immediately reads **Submitting…** and
   goes dead for a second and a half, then the success line appears. Try
   to click it twice while it's working — you can't. No double signup.

`disabled=submitting` is the whole guard: a boolean attribute fed a
reactive value. When `submitting` flips true the button disables; when
the promise settles it re-enables. The user gets feedback *and* the
second click becomes impossible — one line solving both.

:::tip
The same `submitting` flag can drive more than the button — a spinner, a
dimmed form, a "please wait" line. For a form that can legitimately be
sent again, you'd re-enable on success (or reset the form) rather than
leave it disabled.
:::
