---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-5', 'Starting dev server']
title: Extending Native Tags
focus: /src/tags/color-button/index.marko
---

# Extending Native Tags

The types of every native HTML tag live in the global `Marko.HTML`
namespace — `Marko.HTML.Button`, `Marko.HTML.Input`, and so on. The
classic use: a wrapper component that adds its own attributes on top
of a real element's.

```marko
export interface Input extends Marko.HTML.Button {
  color: string;
}

<const/{ color, ...attrs }=input>

<button style=`color: ${color}` ...attrs>
  Order now
</button>
```

Destructure out your own attributes, spread the rest onto the real
tag — a pattern you've written since part 1, now with the compiler
verifying that everything passed through is genuinely a button
attribute.

The page is already using `color-button` like a real button:
`type="submit"`, `disabled`. But the tag currently declares only
`color`, so `pnpm check` flags both as unknown properties (TS2353).
You *could* add `type` and `disabled` to `Input` by hand... and then
`onClick`, and `form`, and forty more. Don't.

1. Make `Input` extend `Marko.HTML.Button` as above.
2. Split `input` with `<const/{ color, ...attrs }=input>` and spread
   `...attrs` onto the `<button>`.
3. `pnpm check` — the whole button vocabulary is now legal, and
   `color="crimson" href="/"` would still be caught (buttons don't
   have `href`).

:::tip
Since Marko 6, native tags accept `content` as an attribute — so
spreading `...attrs` forwards any body content the caller passed too;
no manual `<${input.content}/>` injection required.
:::

You should see both buttons in the preview (the second one properly
disabled) and a silent check. Next: making one tag work for many
types at once.
