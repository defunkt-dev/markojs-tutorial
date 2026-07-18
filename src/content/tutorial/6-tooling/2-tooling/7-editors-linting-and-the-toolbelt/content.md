---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-2-7', 'Starting dev server']
title: Editors, Linting & the Wider Toolbelt
focus: /src/tags/counter-widget/index.test.ts
---

# Editors, Linting & the Wider Toolbelt

One lesson left, and it's the one that makes all the others cheaper: the
tools that tell you you're wrong *before* you ask.

**Your editor already knows Marko.** The VS Code extension bundles
everything — highlighting, type checking, accessibility hints,
IntelliSense — and needs no setup. Any editor with LSP support gets the
same through the Marko Language Server, and that's worth saying precisely:
the type checking your editor draws in red is the *same engine* as the
`mtc` you've been running in the terminal all chapter. This tutorial has no
language server, which is why the terminal has been your squiggle. Your
real editor won't make you work that way.

**Nothing lints your templates, and that's deliberate.** There is no ESLint
plugin for Marko, and no ESLint parser for `.marko` — so ESLint cannot read
a template at all. Templates are covered by the language server as you type
and by `mtc` in CI. ESLint's job in a Marko project is your *TypeScript*:
handlers, helpers, and tests.

And for tests it earns its keep. `eslint.config.js` here pulls in
`typescript-eslint` — plain ESLint can't parse TypeScript syntax — and then
the `flat/marko` preset from `eslint-plugin-testing-library`, scoped to
`**/*.test.ts`.

The test file has picked up some bad habits.

1. Run `npx eslint .` in the terminal. Six problems.
2. Read the fourth one: **Promise returned from async event method `click`
   must be handled**. That's the missing `await` from lesson 3 — the
   mistake whose symptom lies to you — caught statically, before the test
   ever runs. The preset knows `fireEvent` is async because it's configured
   for Marko specifically.
3. Fix all of them: query with `screen.getByRole("button")` instead of
   reaching into `container`, `await` the click, drop the `as any` and the
   `screen.debug()`, and assert something real.
4. Run `npx eslint .` again for silence, then `pnpm test` for green.

:::info
The other rules are the same lesson in different clothes:
`no-container` and `no-node-access` push you to query the way a user
perceives the page rather than by DOM structure — markup changes, the
button's *label* doesn't. `no-debugging-utils` just catches the
`screen.debug()` you meant to delete.
:::

**The rest of the toolbelt**, now that you've met it: the
[prettier plugin](https://github.com/marko-js/prettier),
[Storybook](https://github.com/storybookjs/marko),
[testing library](https://github.com/marko-js/testing-library),
[marko-run](https://github.com/marko-js/run),
[the language server](https://github.com/marko-js/language-server) and
[the Vite plugin](https://github.com/marko-js/vite). TypeScript has no repo
of its own — `@marko/type-check` and `@marko/language-tools` live *inside*
the language-server monorepo, so don't go hunting for one.

You should now see ESLint exit silently and `1 passed`. That's the chapter:
your code is formatted, tested at the component level, documented as
stories, checked end to end, and linted. Next chapter, you give it away.
