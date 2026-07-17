---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-2', 'Starting dev server']
title: Typing Input
focus: /src/tags/stat-badge/index.marko
---

# Typing Input

A `.marko` file types its input by exporting an `Input` type — either
form works:

```marko
export interface Input {
  label: string;
  value: number;
  hint?: string;
}
```

That one declaration buys three checks at every call site: wrong
*types* are rejected, missing *required* attributes are rejected
(`hint?` stays optional), and *unknown* attributes are rejected —
a typo like `lable=` becomes an error instead of a silently ignored
attribute.

There's a flip side you met at the end of last lesson: under `strict`
checking, a tag with **no** `Input` gets an *empty* one. Every
`input.whatever` access inside it is then an error. That's what's
happening in `stat-badge/index.marko` right now — run `pnpm check`
and you'll see TS2339 on each `input` access, even though the preview
renders fine.

1. Add the `Input` interface above to the top of
   `stat-badge/index.marko`.
2. `pnpm check` — clean. Now break a call site on the page: change
   one `label=` to `lable=`, check again, and watch the typo get
   caught. Undo it.
3. One more: delete `value=` from a badge entirely — a *missing
   required attribute* error, pointing at the exact property.
   Restore it.

`Input` is also exportable — other files can
`import { Input as BadgeInput } from "<stat-badge>"` and extend it.

:::info
**Coming from Marko 5?** This replaces `marko-tag.json` attribute
definitions (`"attributes": { "label": "string" }` and friends).
Marko 6 builds ignore that validation config entirely — the `Input`
type *is* the attribute contract now, and `mtc` is what enforces it.
:::

You should see all three stats rendered and a silent `pnpm check`.
Next: typing the *content* between your tags.
