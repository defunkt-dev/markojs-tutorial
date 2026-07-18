---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-2-3', 'Starting dev server']
title: Testing Interactions
focus: /src/tags/counter-widget/index.test.ts
---

# Testing Interactions

Rendering is half a component. The other half is what happens when
somebody clicks it — and that half is where the bugs live.

**`fireEvent` clicks things.** It takes an element and dispatches a real
DOM event at it, which runs your `onClick`, which mutates `count`, which
makes Marko re-render the button. Combined with `getByText`, a whole
interaction test reads like a sentence: find the button that says *Count
is 4*, click it, expect *Count is 5*.

There's a second test in the file now. It does exactly that. It is red.

1. Run `pnpm test` in the terminal.
2. The first test still passes. The second fails: *Unable to find an
   element with the text: Count is 5*.
3. That looks like the click didn't work. It did — you just didn't wait
   for it.
4. Add `await` in front of `fireEvent.click(...)` and run `pnpm test`
   again.

**Why the await.** Marko doesn't re-render the moment you mutate state.
Updates are batched and applied asynchronously, so the DOM your assertion
reads is still one tick behind the click. Every `fireEvent` method in
`@marko/testing-library` therefore returns a promise that resolves once
Marko has caught up. `await` it and the DOM is settled; skip it and you
assert against the past.

:::info
This is the single most common mistake in Marko component tests, and the
symptom is a liar: the error says the *element* is missing, when the real
problem is *timing*. Worse, it can pass by luck on a simple tag and fail
on a complex one. Assume every `fireEvent` call needs an `await` — it
does.
:::

The failure mode is common enough that a linter rule exists purely to
catch it, and you'll wire that rule up later in this chapter. Until then,
the habit is the tool.

You should now see `2 passed`. You have a tag that renders correctly and
behaves correctly, proven in about a second, without opening a browser.
Next: a place to *look* at that tag while you build it.
