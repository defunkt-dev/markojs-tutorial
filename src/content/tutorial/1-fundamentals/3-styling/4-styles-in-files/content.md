---
type: lesson
title: Styles in Files
focus: /src/tags/hero/index.marko
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# Styles in Files

Inline style blocks are great until a component's CSS outgrows its
markup. Marko gives you three ways to move styles into files — all
processed exactly like inline blocks (bundled once, preprocessors by
extension).

**Auto-discovered.** A style file sitting next to a custom tag is
picked up automatically — no import, mirroring how the tags themselves
need no import:

```text
tags/
  hero/
    index.marko
    style.css      <- just... found
```

(For flat files it's `hero.marko` + `hero.style.css`.) The extension isn't
limited to `.css` — a colocated `style.scss` or `style.less` is discovered
exactly the same way and run through whatever preprocessor the project has
configured (the same Less and Sass tooling you'll meet later in this
chapter):

```text
tags/
  hero/
    index.marko
    style.scss     <- also just... found, then compiled
```

**Imported.** Any template can pull in a stylesheet explicitly — useful
for styles shared across templates:

```marko
import "./theme.css";
```

**Imported CSS Modules.** Name the file `*.module.css` and import its
scoped classes as an object — last lesson's scoping, file edition:

```marko
import * as styles from "./card.module.css";

<div class=styles.card/>
```

:::tip
The file tree is unlocked in this lesson — right-click a folder to
create files.
:::

Your turn. The hero tag on the right has an inline style block that's
crowding the file:

1. In the file tree, create `style.css` inside `src/tags/hero/` (this
   lesson allows adding files).
2. Move the CSS rules from the `<style>` block into it, then delete
   the block from `index.marko`.
3. Same preview, cleaner component — and nothing imported anywhere.

Rule of thumb from the docs: inline or auto-discovered first; explicit
imports when sharing across templates.
