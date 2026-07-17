---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-1-4', 'Starting dev server']
title: Route Organization
focus: /src/routes/pricing+page.marko
editor:
  fileTree:
    allowEdits: ['/src/routes/**']
---

# Route Organization

The directory grammar has a few more words — a toolbox lesson, worth
skimming now and returning to when your routes folder grows teeth.

**Pathless directories** — `_name` organizes files without adding a
URL segment: `_marketing/pricing/+page.marko` serves `/pricing`.
Useful for grouping routes that share a layout or middleware without
minting a path.

**Catch-alls** — `$$rest` matches *all* remaining segments (`$$`
matches without capturing). Nothing nests below one.

**Flat routes** — encode the path in the *filename* with dots instead
of folders: `docs.getting-started+page.marko` serves
`/docs/getting-started`. Folders and flat files are parsed by the same
rules and merge freely.

**Multiple paths & groups** — commas serve one file at several paths,
parentheses group alternatives:
`(pricing,plans)+page.marko` answers both `/pricing` and `/plans`.

**Optional segments** — an empty alternative makes a segment
optional: `docs.(intro,)+page.marko` answers `/docs` and
`/docs/intro`.

**Escaping** — to use a control character literally, wrap it in
backticks: a directory named `` `sitemap.xml` `` serves that literal
filename as its path.

Exercise, using two of these:

1. The docs page currently lives at
   `src/routes/docs/getting-started/+page.marko` — two folders for
   one small page. Recreate it as a flat route: a file named
   `docs.getting-started+page.marko` directly in `src/routes` with
   the same content, and delete the folders (right-click — the tree
   is unlocked).
2. The pricing page should also answer `/plans`: rename
   `pricing+page.marko` to `(pricing,plans)+page.marko`.
3. Check all three URLs: `/docs/getting-started`, `/pricing`,
   `/plans`.
