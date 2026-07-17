---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-4', 'Starting dev server']
title: Typing Attribute Tags
focus: /src/tags/feature-list/index.marko
---

# Typing Attribute Tags

Attribute tags — part 4's `@`-slots — get their own wrapper type:
`Marko.AttrTag<T>`.

```marko
export interface Input {
  item: Marko.AttrTag<{ label: string; done?: boolean }>;
}
```

Why the wrapper? Because *every* attribute tag is typed as iterable —
`Marko.AttrTag` is "a single attribute tag, with a `[Symbol.iterator]`
to consume any repeated tags". That's the type-level version of what
you learned in part 4: whether the caller writes one `<@item>` or
ten, the child can always `<for|item| of=input.item>` over them. One
type covers both.

The `T` inside is the attribute tag's own input — here an object
type written inline, but it can just as well reference another tag's
`Input` or a native tag's attributes (`Marko.AttrTag<Marko.HTML.Option>`
for a `<@option>` that forwards to a real `<option>` — the docs' own
select example, and `Marko.HTML` is next lesson's star).

`feature-list` is untyped again, and `pnpm check` says so.

1. Add the `Input` above to `feature-list/index.marko`.
2. `pnpm check` — clean.
3. Prove the contract: on the page, give one `<@item>` a
   `label=42` — wrong type, caught. Then try an unknown
   `<@item priority="high" .../>` — unknown property, caught. Undo
   both.

You should see the feature list render with "Fast" checked off, and
a silent check. Next: borrowing the types of native HTML tags.
