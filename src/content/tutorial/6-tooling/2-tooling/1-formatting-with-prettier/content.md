---
type: lesson
template: marko-ts
mainCommand: ['pnpm run dev --lesson-6-2-1', 'Starting dev server']
title: Formatting with Prettier
focus: /src/tags/order-card/index.marko
filesystem:
  watch: true
---

# Formatting with Prettier

Chapter one gave your code a type system. This chapter gives it
everything else: a formatter, tests, stories, a linter, a browser.

Start with the cheapest win. `order-card/index.marko` **works** — the
preview proves it — but nobody would enjoy reading it. The interface is
crammed onto one line, the indentation is somebody's bad day, and the
`<if>` block wanders.

**The plugin does the work.** Prettier has no idea what a `.marko` file
is until `prettier-plugin-marko` tells it. This template lists the
plugin in `package.json` under a `"prettier"` key, so every prettier run
here already knows the language. It handles the tags API and the
TypeScript syntax in the same pass — one formatter for the whole file,
not two.

1. Read `order-card/index.marko` and wince.
2. Open the terminal tab and run `pnpm format`.
3. Watch the editor. The interface unfolds, the tree lines up, and the
   `onClick` body gets its own lines. You changed nothing; the file is
   just correct now.

Prettier normalises Marko's own spellings too, not just whitespace:
`<let/open = false />` becomes `<let/open=false>`, because that's the
canonical form of a tag variable. Argue with it and it will simply put
it back.

:::info
**One thing prettier can't save you from.** Indentation is *load-bearing*
in Marko. A top-level tag indented by even one space — after an `export`
or an import — is a **compile error**, not a style nit: Marko reads the
indented line as a continuation of the statement above it and hands
`<let/...>` to the JavaScript parser, which says
`Unexpected reserved word 'let'`. That's why the mess in this file lives
*inside* the tree, where indentation is free. Run the formatter often
and you'll never meet this.
:::

**The party trick.** Marko has a second syntax — concise mode, no angle
brackets — and this plugin is the converter. Try it (it prints to the
terminal; nothing is written):

```bash
npx prettier src/tags/order-card/index.marko \
  --plugin=prettier-plugin-marko --marko-syntax=concise
```

The same tag, indentation-structured. `--marko-syntax` takes
`auto` (the default — it detects and preserves whatever the file already
uses), `html`, or `concise`, so this converts in both directions. This
tutorial teaches the tag syntax throughout, but now you know the door
exists, and that walking through it is one command.

:::tip
Pass the plugin explicitly on the command line, as above. Prettier
validates CLI options *before* it reads the plugin list out of
`package.json`, so without `--plugin` it prints
`Ignored unknown option --marko-syntax=concise` — and then honours it
anyway. Confusing, harmless, avoidable.
:::

You should now see `order-card/index.marko` neatly indented, its
interface on four lines, and the preview unchanged — formatting never
alters behaviour. Next: proving that behaviour, instead of eyeballing it.
