---
type: lesson
title: Tag Parameters & Arguments
focus: /src/tags/data-list.marko
---

# Tag Parameters & Arguments

The pipes come full circle. `<for|item|>` and `<await|user|>` were
core tags handing values to their content — and now you know content
travels as `input.content` and renders via `<${...}/>`. Connect the
dots: **when your tag renders its content, it can pass values along**,
and the caller's pipes receive them.

Attributes on the rendered content become the first parameter:

```marko
/* data-list.marko */
<${input.content} item=someItem index=3/>

/* caller */
<data-list|{ item, index }|> … </data-list>
```

Or pass **positional arguments** with call syntax — parentheses after
the tag — and the pipes read like a function signature:

```marko
/* data-list.marko */
<${input.content}(someItem, 3)/>

/* caller */
<data-list|item, i|> … </data-list>
```

That second form is literally what `<for|item, i|>` has been doing all
along. Pipes are the *receiving half* of arguments a tag chooses to
send.

The `data-list` tag on the right owns the chrome of a list — the ul,
the zebra styling, an empty-state message — but renders hardcoded
text for every row instead of letting callers describe one:

1. In `data-list.marko`, replace the hardcoded `<li>` content with
   `<${input.content}(item, i)/>` (the loop provides `item` and `i`).
2. The page already calls `<data-list|fruit, i|>` with its own row
   markup — the preview should show the caller's rendering inside the
   component's chrome: structure from the tag, row content from the
   caller. That inversion is the whole point of parameters.
