---
type: lesson
mainCommand: ['pnpm run build', 'Building the library']
title: The Shape of a Tag Library
focus: /marko.json
previews: false
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# The Shape of a Tag Library

Everything so far has been *your* app. This chapter is about giving your
tags to somebody else — a package they install and use without ever seeing
this code.

The project on the left is not an app. There's no `src/routes`, no dev
server, and nothing to preview: a library has no pages. What it has is four
small files, and each one earns its place.

**`marko.json` is one line.** `{ "exports": "./dist/tags" }`. That's the
whole file. It tells any consumer's compiler where this package's tags live
once installed — and it points at `dist`, the *built* output, not `src`.

**`src/tags/` is the public surface.** Every folder here becomes a tag a
consumer can use by name. `fancy-badge` becomes `<fancy-badge>` in someone
else's page, with no import. That's the same discovery you met in part four,
seen from the other end.

**`package.json` ships `dist`, never `src`.** The `files` field is the
allowlist. And `sideEffects: ["**/*.marko"]` — remember it; the fourth
lesson explains why that one line is load-bearing.

**`tsconfig.tags.json` is the build config**, and the next lesson is about
what it does.

1. Add a second tag. Right-click the `src/tags` folder in the file tree,
   create a folder called `sale-ribbon`, and inside it a file called
   `index.marko`:

   ```marko
   export interface Input {
     percent: number;
   }

   <div class="ribbon">-${input.percent}%</div>
   ```
2. Run `pnpm build` in the terminal.
3. Run `ls dist/tags`. Two folders. You just changed what consumers of this
   package can type.

:::info
**`exports`, not `tags-dir`.** These two fields are the most common mistake
in a hand-rolled Marko package. `tags-dir` is *app* config — it tells the
compiler which folder to crawl for tags inside a project. `exports` is
*package* config: where the built tags live for consumers. If a library's
`marko.json` says `tags-dir`, it's wearing an app's clothes. There's a third
field, `script-lang: "ts"`, that you also don't need here — it exists for
shipping raw TypeScript source, and the build in the next lesson eliminates
that need entirely.
:::

:::tip
Tag names are global to the consumer's app, so a package that exports
`<button>` or `<badge>` is picking a fight. Prefix them — `fancy-badge`,
not `badge`. And tags nested inside another tag's folder (a
`fancy-badge/tags/` directory) stay private: consumers never see them.
:::

You should now have two tags in `dist/tags`. Next: what actually ends up in
there, and why it isn't what you wrote.
