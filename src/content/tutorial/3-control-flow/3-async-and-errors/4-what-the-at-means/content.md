---
type: lesson
title: What the @ Means
focus: /src/routes/+page.marko
---

# What the @ Means

Two lessons in a row used tags starting with `@` — `<@placeholder>`,
`<@catch|err|>` — without explaining the prefix. Before this part
closes, let's name it, because it's not try-specific syntax. It's a
glimpse of Marko's most distinctive feature.

An `@`-tag is an **attribute tag**: a named piece of content passed
*to the tag it sits inside*. Regular tag content answers "what goes in
the body?" — attribute tags answer "what goes in each named slot?"
`<try>` declares two slots, placeholder and catch, and you fill them:

```marko
<try>
  ...the body...

  <@placeholder> ...pending slot... </@placeholder>
  <@catch|err|> ...error slot, receiving the error... </@catch>
</try>
```

Notice everything you already know composes here: an attribute tag has
content like a tag, and parameters like a loop — `|err|` is the same
pipes from `<for>` and `<await>`.

What makes this Marko's signature: **your own tags can declare slots
too** — a card with `@header` and `@footer`, a table with a `@cell`
per column, repeated and conditional slots. That's part four's opening
act; this lesson just hands you the vocabulary.

Quick hands-on to seal it: the `<try>` on the right handles errors but
streams in-order — its slow await has no placeholder.

1. Add the missing slot: `<@placeholder><p>Warming up…</p></@placeholder>`
   inside the `<try>`, sibling to the `<@catch>`.
2. Reload the preview: placeholder first, content replaces it — and
   you can now read every character of that markup precisely: one tag,
   a body, and two named, filled slots.
