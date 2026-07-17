---
type: lesson
title: The for Tag
focus: /src/routes/+page.marko
---

# The for Tag

Repetition is a tag too. `<for>` iterates anything iterable via its
`of=` attribute, handing each item to its content through **tag
parameters** — the names between pipes:

```marko
<for|item, index| of=["a", "b", "c"]>
  ${index}: ${item}
</for>
```

Read `|item, index|` as the loop's parameter list: each pass binds the
current element (and optionally its position) for the content to use.
You've already met this shape once — `<await|user|=...>` in a doc
example — and part four generalizes it, because parameters are how
*any* tag can hand values to its content. For now: pipes mean "the tag
gives me these."

The reading list on the right renders one hardcoded book three times.
Make it real:

1. Replace the three `<li>` copies with a single
   `<for|book, i| of=books>` around one `<li>`.
2. Inside, interpolate: `${i + 1}. ${book.title} — ${book.author}`.
3. Add a fourth book to the array and watch the list simply be longer.

The parameters are scoped to the content — each iteration gets its own
`book` and `i`, which becomes very important two lessons from now.
