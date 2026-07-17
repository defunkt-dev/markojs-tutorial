---
type: lesson
template: marko-run-cdn
mainCommand: ['pnpm run dev --lesson-5-3-4', 'Starting dev server']
title: Plugin Options & CDN Assets
focus: /src/routes/+middleware.ts
---

# Plugin Options & CDN Assets

marko-run is zero-config by conviction, but its Vite plugin takes
options when you need them. Three worth knowing: `routesDir` moves
the routes folder (the docs *discourage* it — the default is a
shared convention); `trailingSlashes` picks how `/about/` relates to
`/about` (five modes; the default `RedirectWithout` gives each page
one canonical URL, which search engines like); and adapters are
auto-discovered from your dependencies — installing
`@marko/run-adapter-netlify` *is* the configuration.

The star option is for production: **`basePathVar`**. In dev, Vite
serves your assets. In production there is no Vite — the built
server inlines asset URLs into its HTML, and if those assets live on
a CDN (the usual practice: upload `dist/` to a resource server at
deploy time), every URL needs the CDN base prepended. This lesson's
project already declares it in `vite.config.ts`:

```ts
plugins: [marko({ basePathVar: "__MY_ASSET_BASE_PATH__" })]
```

That tells the built server: *read the base from this global at
startup*. Setting it is your job — and the root `+middleware.ts` is
the right home: its module top-level runs exactly once when the
server boots.

Try the failure first — it's a good one:

1. In the terminal, build to a folder of its own:
   `pnpm run build --output dist-prod`
2. Start the built server on its own port:
   `pnpm run preview --output dist-prod --port 3100`
   It **crashes immediately**:
   `__MY_ASSET_BASE_PATH__ must be defined when using basePathVar.`
   Production refuses to guess.
3. In `+middleware.ts`, uncomment the assignment (pretend the URL
   came back from your CDN upload).
4. Rebuild and serve again:
   `pnpm run build --output dist-prod` then
   `pnpm run preview --output dist-prod --port 3100`
5. In a *second* terminal tab (or stop the server with `Ctrl+C` and
   restart it after looking), ask it for the page:
   `curl -s localhost:3100 | grep -o 'src="[^"]*"'` — every asset URL
   now starts with the CDN base. (Nothing is actually hosted at
   `cdn.example.com`; the URL is the lesson.)

:::info
Both flags earn their keep. `--output dist-prod` keeps the production
build in its own folder so it can't disturb the dev server powering
the preview on the right — you'd never build over a running server's
files. And `--port 3100` keeps it off the dev server's port 3000;
without it the built server quietly picks a random free port instead.
Notice too that the dev server never needed any of this: Vite serves
assets locally in dev, so `basePathVar` is only consulted by the
*built* server.
:::

You should see the crash message in step 2 and CDN-prefixed `src`
URLs in step 5. Last lesson: where to go from here.
