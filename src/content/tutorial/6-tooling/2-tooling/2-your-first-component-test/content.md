---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-2-2', 'Starting dev server']
title: Your First Component Test
focus: /src/tags/counter-widget/index.test.ts
---

# Your First Component Test

The preview on the right is a fine way to check a tag. It is a terrible
way to check it *again*, tomorrow, after someone else edits it. That's
what tests are for.

This lesson's project is a new template. It carries three new pieces:

- **vitest** — the test runner. `pnpm test` runs every `*.test.ts` once
  and exits.
- **jsdom** — a DOM implemented in JavaScript, so tests can render, click
  and read text without a browser anywhere near them.
- **`@marko/testing-library`** — the Marko binding for Testing Library,
  the family of tools whose whole philosophy is *query the page the way a
  person would*.

**Two functions carry this lesson.** `render(Tag, input)` mounts a tag
into the jsdom document — and that second argument is exactly the tag's
`Input`, the same object the page passes as attributes. `screen.getByText`
then searches the rendered document for visible text and throws a
descriptive error if it can't find it. No selectors, no
`.counter-widget__label`, nothing about markup structure — you look for
what a person would look for.

`index.test.ts` sits beside `index.marko`, and that's deliberate: the
thing and the test for the thing live together, exactly like Marko puts a
tag's markup, logic and styles in one file. Nothing has to be configured
for this — vitest finds `*.test.ts` anywhere, and marko-run ignores it,
because only `src/routes` is scanned for routes.

The test says the counter should start at 4. The page renders it with
`start=4`. But the test is red.

1. Open the terminal tab and run `pnpm test`.
2. Read the failure: *Unable to find an element with the text: Count is
   4*. It also dumps the DOM it did find — a button saying **Count is 0**.
3. Look at the `render` call. It mounts the tag with **no input at all**,
   so `input.start` is `undefined` and the tag falls back to `0`. The
   page isn't lying; the test just never asked for a 4.
4. Fix it: `await render(CounterWidget, { start: 4 })`.
5. Run `pnpm test` again.

:::info
`render` is awaited because rendering a Marko tag is asynchronous — the
tag mounts, hydrates and settles before your assertions run. Forget the
`await` and you'll assert against an empty document. This matters more in
the next lesson, where it hides better.
:::

You should now see `1 passed` in green. That's a real component test:
it mounted a Marko tag, passed it typed input, and checked what a user
would see. Next: making it *do* something.
