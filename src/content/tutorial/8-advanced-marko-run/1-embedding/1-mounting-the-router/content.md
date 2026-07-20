---
type: lesson
title: Mounting the Router
focus: /src/index.js
template: marko-run-embed
previews:
  - [3000, 'Shop (Express + marko-run)']
prepareCommands:
  - ['pnpm install', 'Installing dependencies']
  - ['pnpm run build', 'Building the app']
mainCommand: ['pnpm run preview', 'Starting the Express server']
---

# Mounting the Router

marko-run usually owns the whole server — you run `marko-run dev` and it handles
everything: routing, rendering, the lot. But sometimes you already *have* a server —
an Express app with its own routes, middleware, and API — and you don't want to throw
it away. You want to **add marko-run's pages to it**.

That's what the **Node adapter** is for. Instead of marko-run running the show, you write
your own server entry and *mount* marko-run into it. This example is a complete, running
app that does exactly that — read it, edit it, download it.

## The custom entry

`src/index.js` is a plain Express app, and it's the whole point of this lesson:

```js
const app = express();
app.use(compression());

// An existing Express route — your own API, untouched by marko-run.
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Mount every marko-run page and route into this same Express app.
app.use(routerMiddleware());

app.listen(PORT, ...);
```

`/api/status` is your own route — pure Express, nothing to do with marko-run. Then one
line does the embedding:

```js
app.use(routerMiddleware());
```

`routerMiddleware()` (from `@marko/run-adapter-node/middleware`) handles any request that
matches a marko-run route — the file-based pages in `src/routes` — and passes everything
else through to the rest of your Express app. That single line is the mount.

## The other two pieces

Two bits of configuration make the adapter available:

- `vite.config.ts` registers the **Node adapter**: `marko({ adapter: nodeAdapter() })`.
- `package.json` points the marko-run commands at your entry — `marko-run build
  src/index.js` and `marko-run preview src/index.js` — rather than letting marko-run
  supply its own server.

And there are two ordinary marko-run pages in `src/routes`, `/` and `/products`, exactly
like the file-based routes from Part 5. You didn't wire them up by hand; `routerMiddleware()`
picks them up automatically.

## What you're looking at

The preview is the Shop home page, served by Express through marko-run. Click **Browse
products** and `/products` renders — another file-based route, same server. Meanwhile the
hand-written `/api/status` route still answers as before (open it in the preview's own tab
to see the JSON). The two live side by side: **Express handles what it knows, marko-run
handles the pages.**

This example is served as a **production build** (`marko-run preview`) so it runs anywhere,
including this in-browser sandbox. That also means edits won't hot-reload the preview here;
to experiment live, download the project and run `npm run dev` on your machine.

:::tip
Order matters. Express runs middleware top to bottom, so routes you declare **before**
`routerMiddleware()` win — that's why `/api/status` stays yours. Put `routerMiddleware()`
after your own routes so it acts as the catch-all for everything marko-run owns.
:::

:::info
The adapter also ships a **match middleware**: it attaches the matched route to the request
*without* running it yet, so you can slot your own middleware between "found a route" and
"run it" — auth, logging, rate limiting. `routerMiddleware()` is the common case; reach for
the match middleware when you need that seam.
:::
