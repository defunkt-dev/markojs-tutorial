---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-3-4', 'Starting dev server']
title: Where to Go Next
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# Where to Go Next

Fifty-eight lessons ago this was a counter button. Now you can build
a streaming, server-rendered, form-handling, API-serving Marko app
from an empty folder. What this tutorial deliberately left for your
next session:

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

No exercise this time. The page on the right is a plain marko-run app
— the same one every lesson secretly was. It's yours; the tree is
unlocked; break something on purpose and fix it. That's the whole
skill.
