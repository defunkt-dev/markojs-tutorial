---
type: lesson
title: Dynamic Tags
focus: /src/tags/heading.marko
---

# Dynamic Tags

Last lesson you rendered `input.content` with `<${...}/>`. Here's the
general rule: **an interpolation can stand in for a tag name.** When it
does, the closing tag is written `</>` (or the tag self-closes).

When the value is a **string**, Marko outputs that native HTML tag:

```marko
<${"h" + input.level}>Hello!</>
```

A falsy value has a handy meaning: render the *content only*, no
wrapper. That makes optional wrappers one-liners:

```marko
<${input.href && "a"} href=input.href>Profile</>
```

With an `href`, you get a link; without one, just the text.

On the right, `src/tags/heading.marko` should render an `h1`–`h6` based
on `input.level`, and link itself when `input.href` is present. Replace
its hardcoded markup:

```marko
<${"h" + input.level}>
  <${input.href && "a"} href=input.href>
    <${input.content}/>
  </>
</>
```

The page uses `<heading level=1>` down to `<heading level=3 href=...>` —
the preview should show shrinking headings, the last one linked.

One boundary to remember (it will save you a confusing afternoon):
**strings always render native tags.** `<${"card"}/>` creates an HTML
`<card>` element — it does *not* find your `card.marko` component.
Rendering *components* dynamically needs a reference to the component
itself, which is a different feature you'll meet in the components
chapter.
