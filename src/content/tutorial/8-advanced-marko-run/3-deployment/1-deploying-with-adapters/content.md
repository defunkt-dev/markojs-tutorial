---
type: lesson
title: Deploying with Adapters
focus: /vite.config.ts
template: marko-run-deploy
---

# Deploying with Adapters

You've built the app — now how do you ship it? marko-run makes deployment a one-line choice. This
is a finished example; read through it.

## The build is already a server

`marko-run build` produces `dist/index.mjs` — a **runnable Node server**. Run `node dist/index.mjs`
and your app is live. So the simplest deployment is: build, copy `dist/` to a server, run Node.

## Adapters retarget the same app

But you often want to deploy somewhere other than a plain Node server — a CDN, a serverless
platform, the edge. That's what **adapters** do: they take the *same* marko-run app and build it
for a different host. You choose one in `vite.config.ts`:

```ts
plugins: [marko({ adapter: nodeAdapter() })]
```

Swap that adapter and the identical app builds for a different target:

- **`@marko/run-adapter-node`** (used here) → a standalone Node server. This is the default.
- **`@marko/run-adapter-static`** → static HTML files, no server at all — the **Static Site
  Generation** lesson in Part 9 built exactly this.
- **`@marko/run-adapter-netlify`** → Netlify (below).

Your route and component code never changes — only the adapter does.

## Example: deploying to Netlify

`@marko/run-adapter-netlify` deploys your app to Netlify. Point `vite.config.ts` at it:

```ts
import netlifyAdapter from "@marko/run-adapter-netlify";

plugins: [marko({ adapter: netlifyAdapter() })]
```

Now `marko-run build` emits a **Netlify Function** (serverless Node) instead of a standalone
server, and Netlify runs it on demand. One option changes the runtime entirely:

```ts
netlifyAdapter({ edge: true })
```

With `edge: true` the app builds for **Netlify Edge Functions** — running on a Deno-based edge
runtime at Netlify's locations around the world, close to your users, rather than one central Node
server. So an adapter can retarget not just the *output format* but the *runtime your code runs
on*. Handlers also get typed access to Netlify's platform context (geo, cookies, and more) through
the request.

:::info
Adapters are a **build/deploy** concern, so there's nothing to run in this preview — it's just the
app itself. To try Netlify locally you'd install the Netlify CLI (`npm install -g netlify-cli`)
and run `marko-run preview`, which launches `netlify dev` for you.
:::

## Choosing one

- **node** — a server you run and control (your own VM, a container, a PaaS).
- **static** — content sites with no dynamic server: fast, cheap, and cacheable everywhere.
- **netlify** (and other serverless/edge adapters) — auto-scaling, global distribution, no servers
  to manage.

Same app, different deployment — decided by one line.
