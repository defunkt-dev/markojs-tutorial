---
type: lesson
mainCommand: ['pnpm run dev --lesson-5-3-5', 'Starting dev server']
title: The marko-run CLI
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# The marko-run CLI

Every marko-run project — including this one — is driven by one small
command-line tool. You've been using it the whole time (it's what
`pnpm run dev` runs under the hood); this lesson names its three verbs.
No exercise — the page on the right just lists them.

## `marko-run dev`

The development server. It compiles on demand, hot-reloads as you edit,
and serves your routes. This is the command running your preview right
now (`marko-run dev --port 3000`). Reach for it the entire time you're
building.

## `marko-run build`

The production build. It compiles your app ahead of time and, with the
default Node adapter, emits a runnable server at **`dist/index.mjs`** —
`node dist/index.mjs` and you're live. Swap the [adapter](/8-advanced-marko-run/3-deployment/1-deploying-with-adapters)
and the *same* command builds for static hosting, serverless, or the
edge instead.

## `marko-run preview`

Build, then serve that production output locally so you can check it
before shipping. Where `dev` runs unoptimized and hot-reloading,
`preview` runs the *real* build — the closest thing to production on
your own machine. (Some adapters make it smarter: the Netlify adapter's
`preview` launches `netlify dev` for you.)

Three verbs — `dev` while you build, `build` to ship, `preview` to
double-check. The full flag list lives in [`@marko/run`'s CLI reference](https://markojs.com/docs/marko-run/cli).
