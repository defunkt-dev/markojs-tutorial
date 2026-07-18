---
type: lesson
template: marko-consumer
mainCommand: ['pnpm run dev --lesson-6-3-3', 'Starting dev server']
title: Consuming Your Package
focus: /src/routes/+page.marko
---

# Consuming Your Package

Different project. This one is an ordinary marko-run app that has never
heard of your library — except for one line in its `package.json`:

```json
"marko-fancy": "file:./marko-fancy-0.0.1.tgz"
```

That `.tgz` is the tarball your build produced, committed into this project
so you can install it without a registry. It's exactly what `npm publish`
would have uploaded, so everything you're about to see is what a real
consumer sees.

1. Add the tag to the page:

   ```marko
   <fancy-badge kind="sale">Half price today</fancy-badge>
   ```
2. Look at the preview.

**Notice what you didn't do: import it.** No path, no import statement,
nothing at the top of the file. Marko's compiler walked this app's
dependencies, found `marko-fancy`, read its `marko.json`, and learned that
`<fancy-badge>` lives at `./dist/tags`. In part four, tags were discovered
from your own `src/tags` folder. That same mechanism reaches into installed
packages, which is why a Marko library needs no import ceremony at all.

**And the types came with it.** Try breaking it:

```marko
<fancy-badge kind="bogus">Half price today</fancy-badge>
```

Run `pnpm check`:

```
Type '"bogus"' is not assignable to type '"new" | "sale"'.
```

That union isn't in this project. It's in the `index.d.marko` your build
generated two lessons ago, now sitting in `node_modules`. The declaration
twin travelled inside the tarball, got installed, and is now type-checking
someone else's page. Put `kind="sale"` back and `pnpm check` goes quiet.

:::info
**Why a tarball and not a folder?** A `file:` dependency pointing at a
*directory* gets symlinked, and a symlinked package resolves differently
enough to matter — the type-checker starts complaining that the linked
files aren't part of the project. A tarball is installed as a real copy in
`node_modules`, which is exactly what a registry install does. If you want
to test a package before publishing it, pack it and install the tarball.
Anything else is testing a different thing.
:::

:::tip
One trap if you iterate: the lockfile records the tarball's content hash. If
you rebuild and repack at the same version number, the install serves the
old one and says nothing. Bump the version, or delete the lockfile.
:::

You should see a crimson SALE badge, and `pnpm check` clean. Your library
works in a project that only ever saw the tarball. Next: the two lines that
decide whether it works for everyone else.
