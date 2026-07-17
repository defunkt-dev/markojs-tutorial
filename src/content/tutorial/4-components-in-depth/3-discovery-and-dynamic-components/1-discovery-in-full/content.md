---
type: lesson
title: Discovery in Full
focus: /src/routes/+page.marko
---

# Discovery in Full

Time to complete the map of how a tag name finds its implementation.
Marko checks, in order:

**1. Local variables** — a name starting with an uppercase letter is
looked up as a variable first. That's why `<define>`'s names are
PascalCase, and it's how you use templates that *can't* be
auto-discovered:

```marko
import FancyDivider from "../shared/fancy-divider.marko"

<FancyDivider/>
```

**2. Relative discovery** — the lowercase path you've used since part
one: walk upward looking in `tags/` folders (for
`TAG_NAME.marko`, `TAG_NAME/index.marko`, or
`TAG_NAME/TAG_NAME.marko`).

**3. Installed packages** — npm packages can publish tags that are
discovered like your own (they declare an export in their
`marko.json`). Consuming them is invisible; publishing your own is a
topic for another day.

One more convenience: the **tag import shorthand** — angle brackets in
the `from` run discovery for you, useful for aliasing:

```marko
import Greeting from "<greeting>"
```

The page on the right wants the divider component that lives in
`src/shared/` — *not* a `tags/` folder, so discovery can't see it. The
preview is showing you what that looks like: a **compile error**,
pointing straight at `<fancy-divider/>`. Marko refuses to guess — an
unresolvable custom tag is a build-time failure with a line number,
not a silent broken page.

1. Import it: `import FancyDivider from "../shared/fancy-divider.marko"`
   at the top of the page.
2. Replace `<fancy-divider/>` with `<FancyDivider/>`.
3. The error clears and the divider renders. Rule of thumb: `tags/`
   for things used broadly (zero imports); explicit imports for
   shared or one-off locations — with the compiler loudly catching
   anything that falls between.
