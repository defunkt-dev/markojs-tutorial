---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-3', 'Starting dev server']
title: Typing Content
focus: /src/tags/fancy-frame/index.marko
---

# Typing Content

Body content arrives as `input.content`, and the `Marko` namespace —
globally available in every `.marko` file, nothing to import — has a
type for it: `Marko.Body`.

```marko
export interface Input {
  title: string;
  content?: Marko.Body;
}
```

With that, `<fancy-frame>text and tags</fancy-frame>` type-checks,
and passing a non-renderable value where content belongs is an error.

Remember tag *parameters* from part 4 — the child calling
`<${input.content}(i)/>` and the caller receiving `|i|`? The
parameters are part of the content's type: `Marko.Body<[number]>`
declares content that will be called with one number. The caller's
`|n|` picks up that type — which is why the page's `${n * 10}` can be
arithmetic without a complaint... once the types exist.

Right now neither tag is typed, so `pnpm check` reports TS2339 on
every `input` access in both.

1. Type `fancy-frame` with the interface above.
2. Type `count-up`:

```marko
export interface Input {
  to: number;
  content: Marko.Body<[number]>;
}
```

3. `pnpm check` — silent. The frame wraps, the counter counts, and
   the parameter flowing into `|n|` is a checked `number` end to end.

You should see the framed intro and steps 10, 20, 30 in the preview.
Next up, the last content shape without a type: attribute tags.
