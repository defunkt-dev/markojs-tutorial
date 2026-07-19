---
type: lesson
template: marko-run-static
title: The Static Adapter
focus: /src/routes/counter/+page.marko
---

# The Static Adapter

The preview on the right is this app running live on marko-run's dev
server — two pages and a layout, clickable right now. But a dev server
isn't a deployment. **Static site generation** turns the app into plain
`.html` files at build time, so you can host it on any static server or
CDN with nothing running behind it.

That switch is the job of an **adapter**. marko-run's Vite plugin builds
the same routes for different targets depending on which adapter is
installed, and `@marko/run-adapter-static` is the one that renders to
files. This project's `vite.config.ts` already has it wired in:

```ts
import staticAdapter from "@marko/run-adapter-static";

export default defineConfig({
  plugins: [marko({ adapter: staticAdapter() })],
});
```

At build time the adapter renders every route it can reach — each route
with no `:params`, plus any page it finds by following relative `<a href>`
links in the HTML it just rendered. That's why the layout links **Home**
and **Counter**: the crawler follows those links to discover the pages.

Build it — in the **terminal**. The preview on the right is a running dev
server, and you never build over a running server's files, so send the
build to a folder of its own with `--output`:

```bash
pnpm run build --output dist-static
```

You get a **per-route size table**. Both routes read **0 kB** — this site
is pure HTML so far, and pure HTML ships no JavaScript. See what landed on
disk:

```bash
ls dist-static/public
```

`index.html` (home) and `counter.html` (counter), ready to deploy. Open
one:

```bash
cat dist-static/public/index.html
```

Plain HTML — no `<script>`, nothing to hydrate. This page is done the
moment the browser receives it.

**Now make the counter actually count.** Right now `counter/+page.marko`
prints a hard-coded `0`. Give it real state — a `<let>` and a button that
increments it, the same reactivity you built in Part 2:

```marko
<let/count=0>
<button onClick() { count++ }>
  Clicked ${count} times
</button>
```

The preview updates instantly — the counter clicks now. Then rebuild:

```bash
pnpm run build --output dist-static
```

Watch the table. `/` still reads **0 kB** — the home page didn't change,
so it still ships nothing. But `/counter` now shows a couple of kB: the
moment a page needs to *do* something in the browser, marko-run bundles
that page's code — and only that page's — and ships it. Confirm it in the
HTML:

```bash
cat dist-static/public/counter.html
```

There's a `<script>` now, pulling a file out of `dist-static/public/assets/`:
the counter's code. The home page's HTML is untouched.

:::info
`--output dist-static` keeps the built files in their own folder so the
build can't disturb the dev server powering the preview on the right. It
also shows the shape of a deploy: the adapter writes everything to
`dist-static/public/` — HTML, CSS, and any island JS — and that folder
*is* your site. Upload it to any static host and you're done; nothing runs
server-side.
:::

:::tip
The crawler discovers pages through links and param-free routes. For a page
nothing links to — one behind a `:param`, say — name its URLs explicitly:
`staticAdapter({ urls: ["/products/lamp"] })`. Anything reachable by a link
needs no configuration.
:::

That is a complete static site: two pages, one interactive, built to files
you can host anywhere with no server — where the interactive page costs
only its own counter and the static page costs nothing at all.
