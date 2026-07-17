---
type: lesson
title: Out-of-Order Streaming
focus: /src/routes/+page.marko
---

# Out-of-Order Streaming

In-order streaming holds the stream at each `<await>`. Sometimes
that's wrong — a slow widget shouldn't delay everything after it. The
opt-out is a `<try>` ancestor with a `@placeholder`:

```marko
<try>
  <await|report|=loadReport()>
    ${report.total}
  </await>

  <@placeholder>
    Loading the report…
  </@placeholder>
</try>
```

With a placeholder available, the server doesn't hold: it streams the
placeholder immediately, keeps going with the rest of the page, and
when the promise settles, streams the real content which **replaces
the placeholder in place**. That's **out-of-order streaming** — content
arriving after things that appear below it.

The docs add a design warning worth repeating: replacement means
layout can shift under a reading user. Size placeholders like their
content, and fall back to in-order where shift would hurt.

The dashboard now has *two* awaited sections, and the slow one (3s)
is holding the fast one (1s) hostage — in-order means the stream waits
at the first await it meets in document order:

1. Wrap the slow Traffic section's `<await>` in a `<try>` with a
   `<@placeholder>` of "Crunching traffic numbers…".
2. Reload the preview: the placeholder and the heading paint at once,
   Signups (below it!) fills in at 1s, Traffic replaces its
   placeholder at 3s. Below arrived before above — out of order,
   on purpose.
