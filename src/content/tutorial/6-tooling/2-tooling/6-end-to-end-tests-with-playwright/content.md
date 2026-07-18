---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-2-6', 'Starting dev server']
title: End-to-End Tests with Playwright
focus: /e2e/counter.spec.cts
---

# End-to-End Tests with Playwright

Component tests mount a tag in a fake DOM. That catches a great deal and
misses one whole category: whether your *app* works. Real server, real
HTML over the wire, real hydration, real browser. That's end-to-end, and
Playwright is how it's done.

**The config wires the two together.** `playwright.config.cts` has a
`webServer` block: Playwright starts your dev server, waits for the URL to
answer, runs the tests against it, and tears it down. No manual "start the
server first" step, in your terminal or in CI.

**Two layers, and the difference matters.** `request.get("/")` fetches the
raw HTML the server sent — no browser, no JavaScript. If your text is in
there, server rendering works, and that's what a search engine and a slow
phone see first. `page.goto("/")` then loads the same page in a real
browser and clicks it. If *that* works, hydration works. Marko's whole
pitch is that the first layer is fast and the second is small; these are
the two tests that hold it to it.

The spec also gates on console errors — collect them, assert the array is
empty. A hydration mismatch usually announces itself there and nowhere
else. It's a pattern worth stealing for every app you write.

1. Open the terminal and run `npx playwright test --list`. Two tests.
2. Add a third that checks the button already says *Count is 4* before
   anything is clicked:

   ```ts
   test("starts at four", async ({ page }) => {
     await page.goto("/");
     await expect(page.getByRole("button")).toHaveText(/Count is 4/);
   });
   ```
3. Run `--list` again. Three tests. Playwright parsed your config and your
   spec, resolved every test, and told you so.

:::info
**Why these two files end in `.cts`.** That isn't a Playwright convention —
it's this tutorial's container. Playwright loads your config and specs
itself, and for an ES module it does that with a dynamic `import()` of a
file path, which the in-browser Node here can't perform. The `.cts`
extension tells Playwright the file is CommonJS, so it uses `require()`
instead, which works fine. TypeScript is untouched either way — Playwright
compiles it on the way in. Download the project and plain `.ts` works, as
it does in every Playwright project you'll meet.
:::

:::info
**Why `--list` and not `test`.** Playwright drives real browser binaries —
Chromium, Firefox, WebKit — and this tutorial runs in a WebContainer, which
executes only JavaScript and WebAssembly. It cannot launch a native
browser, so the tests here can be written, type-checked and listed, but not
run. Everything else in this chapter runs fully; this one is honest about
its ceiling.
:::

**To actually run them:** hit the download button at the top of this page.
You get the whole project as a real folder. Then `npm install`, `npx
playwright install` — that fetches the browsers, a few hundred megabytes,
which is exactly why they aren't here — and `npx playwright test`. The same
spec, green, in three real browsers.

:::tip
One trap this config sidesteps: the `dev` script already contains
`--port 3000`, so the usual `npm run dev -- --port 4173` would hand
marko-run `--port` twice and crash its argument parsing. Calling
`npx marko-run dev --port 4173` directly avoids it.
:::

You should now see three tests listed. Next: the tools that catch these
mistakes before you run anything at all.
