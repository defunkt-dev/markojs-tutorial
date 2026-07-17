---
type: lesson
title: Passing Data
focus: /src/tags/card.marko
---

# Passing Data

Attributes on a custom tag become that tag's **input** — a plain object
the component reads from. And since the last lesson taught you that
attributes are JavaScript, you already know how to pass anything:
strings, numbers, objects, functions.

The page on the right renders a team of three `<card>` tags, but every
card stubbornly shows Alice. Open `src/tags/card.marko` (it's the
focused file) and replace the hardcoded values with `input`:

```marko
<div>
  <h3>${input.name}</h3>
  <p>${input.role}</p>
  <p>Joined ${input.year}</p>
</div>
```

Now the page's attributes flow through:

```marko
<card name="Alice" role="Designer" year=2023/>
<card name="Bob" role="Developer" year=2024/>
<card name="Charlie" role="Product Manager" year=2022/>
```

One team, one component, three different cards.

Worth knowing: a spread works on custom tags too — if you have
`const alice = { name: "Alice", role: "Designer", year: 2023 }`, then
`<card ...alice/>` passes all three at once. And for tags that take one
main value, Marko has a `value` shorthand: `<my-tag=42/>` is
`<my-tag value=42/>` — you'll meet it again with core tags later.
