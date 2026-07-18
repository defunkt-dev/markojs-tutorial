---
type: lesson
mainCommand: ['pnpm exec mtc -p tsconfig.tags.json', 'Building the library']
title: Building with mtc
focus: /tsconfig.tags.json
previews: false
---

# Building with mtc

`pnpm build` runs one command: `mtc -p tsconfig.tags.json`. Same `mtc` you
met in chapter one — but there it only *checked*. Two fields in this
tsconfig turn the checker into a builder: `noEmit: false` and
`declaration: true`. That's the whole switch.

**A published `.marko` is not the one you wrote.** Run `pnpm build`, then:

```bash
cat dist/tags/fancy-badge/index.marko
```

Your `export interface Input` is **gone**. And the import changed:
`"./options"` became `"./options.js"`. Then look at what it left behind:

```bash
cat dist/tags/fancy-badge/index.d.marko
```

There's your interface. The build **strips** the TypeScript out of the
template and **moves** it into a declaration twin — a `.d.marko`, the
template equivalent of a `.d.ts`. Consumers get a plain template their
compiler can read without knowing any TypeScript, plus a types file their
editor reads. `options.ts` gets the same treatment: `options.js` and
`options.d.ts`.

That's why `.marko` is the shippable artifact and there's no `index.js`
anywhere. A Marko tag is compiled by the app that *uses* it — one template
becomes server code in their server bundle and DOM code in their client
bundle. The library can't do that; only the consumer's compiler knows which
is needed.

**Now the bug this lesson exists for.** Look at `tsBuildInfoFile` in the
tsconfig. That's mtc's incremental cache, and it currently sits in the
project root.

1. Run `pnpm build`, then `ls dist/tags/fancy-badge` — four files. Fine.
2. Now do what every build script does before a build: `rm -rf dist`.
3. Run `pnpm build` again. It exits **0**. Now run `ls dist` — **nothing**.
   It emitted nothing at all and told you it succeeded.
4. Fix it: change `tsBuildInfoFile` to `"./dist/tsconfig.tags.tsbuildinfo"`.
5. `rm -rf dist`, `pnpm build`, `ls dist/tags/fancy-badge`. Four files again.

The cache said "already built" — and it was right, from its point of view.
It never noticed `dist` had been deleted, because it wasn't in `dist`. Put
the cache **inside** the directory that gets cleaned, and any clean cleans
the cache too.

:::info
This one ships broken quietly. Exit code zero, empty `dist`, green CI — and
the failure surfaces much later as a consumer whose tags won't resolve. It
cost a real Marko package real hours. The rule is small: an emitting build
config keeps its buildinfo inside its output directory.
:::

:::tip
Never hand-write a `.d.marko`. They're build output, regenerated every run,
and a hand-edited one drifts from its source silently. If a generated
declaration is wrong, fix the tag's *source* types until the build emits
what you want.
:::

You should now see four files per tag in `dist`. Next: someone installs it.
