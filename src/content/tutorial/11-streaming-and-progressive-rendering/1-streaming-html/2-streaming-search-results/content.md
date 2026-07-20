---
type: lesson
title: Streaming Search Results
focus: /src/routes/index/template.marko
template: marko-stream-search
autoReload: true
---

# Streaming Search Results

Back in part three, `<await>` showed you something unusual: while the server
renders, Marko **streams**. Everything above an `<await>` reaches the browser
immediately, the stream holds at that spot until the promise resolves, then
carries on. And when you rendered a page by hand, you met the server side of
it — `template.render(input).pipe(res)` pipes HTML into the response *as it is
produced*, instead of buffering the whole page first.

This lesson puts both to work on a classic demo: a search page whose results
**stream in over time**, three at a time, down a single response that stays
open. No polling, no websockets, no client JavaScript — just HTML arriving in
pieces.

## The setup (already written)

- **`src/routes/index/index.ts`** is a plain Express handler that calls
  `template.render({}).pipe(res)`. Because it streams, the browser can paint
  results the moment the first batch is ready, while the server is still
  working on the rest.
- **`src/routes/index/data.js`** is a tiny fake search index. In
  `template.marko`, `loadPage(i)` returns one page of three results a second
  later — standing in for a slow database.

Open `src/routes/index/template.marko`. It uses `<define>` to declare a
reusable snippet, `Results`, that awaits one page and renders it:

```marko
<define/Results|input|>
  <await|page|=loadPage(input.pageIndex)>
    <for|item| of=page>
      <div class="result">…</div>
    </for>
    <!-- and then? -->
  </await>
</>

<Results pageIndex=0/>
```

Right now `<Results pageIndex=0/>` renders exactly one page — three results,
after one second — and stops there.

## Your job: make it recurse

The trick to appending over time is that `Results` can **render itself**.
After a page's results, start the next page — nested *inside* the current
`<await>`, so the next `loadPage` only fires once this one has resolved and
flushed.

1. Where the `TODO` is, add:
   ```marko
   <if=(input.pageIndex + 1 < TOTAL_PAGES)>
     <Results pageIndex=(input.pageIndex + 1)/>
   </if>
   ```
2. Reload the preview and watch: three results appear, then three more a second
   later, then three more… ten pages in all, down one response that stays open
   the entire time.

Each `<await>` flushes its batch in document order, and the *next* `<Results>`
sits just after it — so the browser paints each batch as it lands. That nesting
is the whole pattern: a chain of awaits, each one kicking off the next.

:::info
This *is* progressive rendering, in its simplest form — useful content on
screen while the server is still busy. The next chapter takes the idea further:
one page with several **independent** sections that can finish in any order.
:::

:::tip
On first load the dev server shows a brief blank flash — `@marko/vite` hides the
page until the client bundle loads — and then the stream paints. If the preview
ever looks stale after you Solve, reload it, or download the lesson and run it
locally, where it works end to end.
:::
