---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-1-1', 'Starting dev server']
title: Your First Routes
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/routes/**']
---

# Your First Routes

Every lesson so far ran inside an app you never had to configure —
that app is **marko-run**, and this part finally opens it up. The
deal: **files in `src/routes/` become URLs.** No route table, no
config; a `+page.marko` file establishes a `GET` route at its
directory's path:

```text
src/routes/
  +page.marko          →  /
  about/
    +page.marko        →  /about
```

The `+` prefix is how marko-run recognizes routable files among your
other modules — everything you learned in parts one through four
(tags, styles, state) works unchanged inside them; a page is just a
component that answers a URL.


:::info
This part changes *route files* as you move between lessons, and the
in-browser environment restarts the dev server on each lesson to keep
routes accurate. If a preview ever looks stale or stuck, reload the
page — and after using **Solve** in lessons that create files, tap the
preview's refresh button if a brand-new page still 404s.
:::

:::tip
The file tree is unlocked in this lesson — right-click inside
`src/routes` to create folders and files.
:::

The site on the right has a home page whose nav links to `/about` —
currently a 404:

1. Create the folder `src/routes/about` and inside it the file
   `+page.marko`.
2. Give it a full page: heading "About us", a paragraph, and an
   `<a href="/">Home</a>` link back.
3. Click between the two pages. Two files, two URLs, zero
   configuration — and notice each navigation is a full page load;
   these are real server-rendered pages.
