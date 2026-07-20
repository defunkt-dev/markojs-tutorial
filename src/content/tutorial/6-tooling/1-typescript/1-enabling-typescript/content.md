---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-1', 'Starting dev server']
title: Enabling TypeScript
focus: /src/routes/+page.marko
---

# Enabling TypeScript

Welcome to the tooling part! This chapter gives your Marko code a
type system. Two facts make TypeScript in Marko unusually low-friction:

**Fact one: the compiler already speaks TS.** Any `.marko` file can
use TypeScript syntax — interfaces, annotations, `as` — with *zero*
configuration. Marko strips the types at build time. Look at
`price-tag/index.marko`: it declares an `Input` interface, and the
dev server on the right is perfectly happy.

**Fact two: types are enforced by a separate checker.** This template
ships a `tsconfig.json` — that's the whole "enabling" step — and the
checker is `mtc` (from `@marko/type-check`), wired up as `pnpm check`.
In VS Code the language server would draw red squiggles as you type;
in this tutorial, **the terminal is your squiggle**.

And there's something to squiggle at. The page passes
`amount="four fifty"` — a string — where `price-tag` declares a
`number`. The preview still renders (types never exist at runtime),
but look closely: the tax math produced **NaN**. The bug shipped.

1. Open the terminal tab and run `pnpm check`.
2. Read the error: a code frame at the *call site*, and a second frame
   showing the exact `Input` property it violated.
3. Fix the page: `amount=4.5`.
4. Run `pnpm check` again — no output, quiet exit. That silence is a
   passing type check, and the preview now shows a real price.

:::info
A `tsconfig.json` at the project root is the standard way to enable
TypeScript for an app. Packages and gradually-migrating codebases can
instead set `"script-lang": "ts"` in a `marko.json` — Marko crawls
upward looking for it, so folders can opt in incrementally. More on
that in the publishing chapter.
:::

One more on-ramp worth knowing: existing JavaScript projects can
adopt checking *incrementally* with JSDoc — a `// @ts-check` comment
at the top of a `.marko` file plus a `@typedef {...} Input` block
gives you real checking with zero TypeScript syntax.

If `mtc` ever gets slow on a large codebase, `mtc --generateTrace <dir>`
writes a trace you can open in a profiler to see which files and types
dominate the type-check — the same `--generateTrace` TypeScript itself
supports, handy for keeping CI checks fast.

You should now see Coffee priced at 4.95 in the preview, and
`pnpm check` exiting silently. One catch: with `strict` checking on,
*untyped* tags become errors too. Next lesson shows why — and how to
type `input` properly.
