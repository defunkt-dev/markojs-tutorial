---
type: lesson
title: The id Tag
focus: /src/tags/signup-form.marko
---

# The id Tag

Small tag, real problem. HTML wires labels to inputs through matching
`id`/`for` attributes — but a component can render many times, and
hardcoded ids collide. You need an id that's *unique per render*, and
you need it in two places.

`<id>` is a core tag whose entire job is returning a unique string
through — what else — a tag variable:

```marko
<id/emailId/>

<label for=emailId>Email</label>
<input id=emailId type="email">
```

One generated identifier, used by both sides of the pairing, unique on
every render of the component. This is also your first taste of a
pattern next lesson generalizes: a tag whose *only output* is its tag
variable — `<id>` renders nothing at all.

The newsletter form on the right is a component used twice on the page
(header and footer), and both copies hardcode `id="email"` — click the
*footer's* label and watch focus jump to the *header's* input. Duplicate
ids, broken accessibility:

1. Open the form's markup and add `<id/fieldId/>` at the top.
2. Replace the label's `for="email"` with `for=fieldId` and the
   input's `id="email"` with `id=fieldId`.
3. Click each label — each now focuses its own input. Screen readers
   thank you.
