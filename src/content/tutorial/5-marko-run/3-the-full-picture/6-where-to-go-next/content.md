---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-3-6', 'Starting dev server']
title: Where to Go Next
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# Where to Go Next

Seventy-two lessons ago this was a counter button. Now you can build
a streaming, server-rendered, form-handling, API-serving Marko app
from an empty folder. What this tutorial deliberately left for your
next session:

**Your own project.** [`npm init marko`](https://github.com/marko-js/cli/tree/main/packages/create) scaffolds one. `--dir` picks
where it lands, `--template` pulls a starter from
[marko-js/examples](https://github.com/marko-js/examples), and
`--installer` overrides the package manager it reaches for. You never
had to type it here — the project on the left was already running when
you arrived.

**Deployment.** `marko-run build` produces a Node server by default;
**adapters** retarget the same app at other platforms — static
hosting, serverless, edge runtimes. See `@marko/run`'s adapters list.

**Embedding.** Your routes can join an existing server instead of
owning one: `Run.fetch` handles a request against your router;
`Run.match` + `Run.invoke` split that into route lookup and
execution for finer control. The `@marko/run` README's Runtime
section has the recipes.

**TypeScript.** Marko templates take TS natively, marko-run generates
route types, and **typed URLs** can verify every `href` in your app
points at a real route. The docs' TypeScript pages cover setup.

**The explanations.** You've used the machine; these tell you why
it's shaped this way — the docs' explanation section:
*Why Is Marko Fast* · *Targeted Compilation* (one template, different
code per platform) · *Fine-Grained Bundling* (why your static pages
shipped ~zero JS) · *Streaming* (part three's deep background) ·
*Separation of Concerns* (the single-file philosophy, argued
properly) · *Optimizing Performance*.

**And the community** — [markojs.com](https://markojs.com), the
Discord, and the GitHub org, where the people who built all this
answer questions with alarming speed.

No exercise this time — just confetti. The page on the right is your
graduation: read its source and you'll find nothing you don't know.
A `<for>` over pieces, dynamic style attributes, a CSS animation
restarted by flipping its name, a `<let>` counting your encores. The tree is unlocked; it's your app
now. Break something on purpose and fix it — that's the whole skill.
