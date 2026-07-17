---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-8', 'Starting dev server']
title: Augmenting & Extracting Types
focus: /src/tags/badge-row/index.marko
---

# Augmenting & Extracting Types

Last stop: the rest of the `Marko` namespace — helpers that *extract*
types from what you already have, and augmentations that *add* to
what Marko knows.

**Extractors.** `badge-row` accepts an array of props for
`<stat-badge>` — and it re-declared that shape by hand. Hand copies
drift, and this one did: it says `value: string`, the real tag wants
a `number`, and the page passes numbers. Run `pnpm check` — TS2322,
the drift caught. The fix isn't correcting the copy, it's deleting
it:

```marko
import StatBadge from "<stat-badge>";

export interface Input {
  stats: Marko.Input<typeof StatBadge>[];
  chrome: Marko.Renderable;
}
```

1. Make that change in `badge-row/index.marko` — `pnpm check` goes
   quiet. One contract, one source of truth; if `stat-badge`'s
   `Input` ever changes, every consumer follows automatically.

`Marko.Input<...>` works on custom tags (pass the imported template)
*and* native tags (`Marko.Input<"button">`). Its siblings:
`Marko.Return<...>` extracts a tag's return — note it's the
*wrapped* shape, so `Marko.Return<typeof StatBadge>["value"]` is the
raw type your tag variable holds (the page's `satisfies` line proves
it) — and `Marko.BodyParameters<B>` / `Marko.BodyReturnType<B>` pull
the pieces back out of a `Marko.Body`.

**`Marko.Renderable`** is the type of *anything* a dynamic tag
accepts — string, template, or body — which is why `chrome` takes
plain text here and could take a component tomorrow. It's the type
behind part 4's dynamic components.

**Augmenting `Marko.Global`.** The page reads `$global.buildLabel`.
With marko-run's generated route types in play, `$global` is
permissive about extra reads — but the *proper* way to declare an
app-wide global is a one-time interface merge, which also powers
editor completion and stricter setups:

2. In `src/types.d.ts`, inside the `namespace Marko` block, add
   `interface Global { buildLabel?: string; }` — check stays quiet;
   the property is now first-class. (In a real app the server sets
   the value — part 5's globals lesson is where it would come from.)

Three more `declare global` recipes, for reference — same technique:

```ts
interface NativeTags { "my-custom-element": MyAttributes; } // new native tag
interface HTMLAttributes { "data-track"?: string; }         // attr on ALL tags
namespace CSS { interface Properties { "--brand"?: string } } // CSS custom props
```

And for completeness, the *template-level* types — `Marko.Template`,
`Marko.TemplateInput`, `Marko.RenderedTemplate`,
`Marko.MountedTemplate` — type a template you render or mount
*programmatically*; they matter when embedding Marko in other apps,
the advanced territory part 5's capstone points at.

You should see the badge row rendering, "Summary returned: Anvils: 7",
"Global build: dev", and a silent check. That's the TypeScript
chapter — next chapter puts more tools on your belt: formatting,
testing, and a component workshop.
