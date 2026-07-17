---
type: lesson
title: Inspecting State
focus: /src/routes/+page.marko
---

# Inspecting State

When state misbehaves, you want to *watch* it. Marko bakes two
inspection tools into the language as core tags.

`<log>` is a `console.log` that lives in your template and re-runs
whenever what it watches changes:

```marko
<let/count=0>
<log=`Current count: ${count}`>
```

That logs once on the server during the initial render, once in the
browser, and again on every change — a running commentary on your
state, with no handler wiring. Delete the tag when you're done; nothing
else changes.

`<debug/>` drops a `debugger` breakpoint into the template — the
browser's devtools pause right in your component with its variables in
scope. Give it a value and it re-triggers when that value changes:

```marko
<debug=user.name>
```

Try them on the thermostat to the right:

1. Add `<log=`temp is ${temp}`>` under the `<let>`. Open the browser
   console (right-click the preview → Inspect), click the buttons, and
   watch the commentary. Notice the log you see in the terminal pane
   below the preview too — that's the *server* render logging the
   initial value.
2. Optional, if you enjoy a good pause: add `<debug=temp>` with
   devtools open, click, and step around.

Two tags, zero setup, delete when done.
