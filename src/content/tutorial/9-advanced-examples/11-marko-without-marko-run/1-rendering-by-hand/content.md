---
type: lesson
title: Rendering by Hand
focus: /src/routes/index/index.ts
template: marko-vite-express
---

# Rendering by Hand

Every marko-run lesson so far handed you a lot for free: file-based routing, and pages
that render themselves. But **Marko doesn't require marko-run**. The only piece you truly
need is `@marko/vite` — the build plugin that compiles `.marko` files and wires up client
hydration. Bring your own server, and render templates yourself.

This project is a plain **Express** app. `@marko/vite` is just the bundler.

## The setup (already written)

- **`vite.config.ts`** registers `@marko/vite` (`marko()`) and adds a small
  `configureServer` middleware that mounts an Express router straight into Vite's own dev
  server. That's the integration: Vite serves your app, and every request flows through
  Express.
- **`src/index.ts`** is that router — ordinary Express, one route per page:
  ```ts
  export const router = Router().get("/", indexPage);
  ```
  There's no file-based routing here. You write each route by hand.

## Your job

Open `src/routes/index/index.ts`. The handler currently sends a line of plain text. Make it
**render the Marko template** instead. A `.marko` file's default export exposes a
`.render()` method:

```ts
import template from "./template.marko";

const handler: RequestHandler = (_req, res) => {
  template.render({}).pipe(res);
};
```

`render({})` returns a *render result*; `.pipe(res)` streams the HTML straight into the
Express response. Save, and the placeholder becomes the real page — logo, text, and a
spotlight that follows your cursor.

## The render API

`template.render(input)` is the server-side entry point. `input` becomes the `input`
available inside the template (default `{}`), and may also carry a `$global` for
global state. The result it returns can be consumed several ways:

- **Pipe** — `render(input).pipe(writable)` streams into a Node `stream.Writable`. An
  Express `res` *is* one, which is what this lesson uses.
- **Async iterator** — `for await (const chunk of template.render({})) { ... }` lets you
  handle each HTML chunk yourself as it streams.
- **ReadableStream** — `render(input).toReadable()` returns a WHATWG `ReadableStream`, for
  web-API environments: `new Response(template.render({}).toReadable(), { headers: { "content-type": "text/html" } })`.
- **Thenable** — `const html = await template.render({})` resolves to a buffered
  `Promise<string>`. Note: awaiting **opts out of streaming**.
- **toString** — `render(input).toString()` returns the buffered HTML synchronously, but
  **throws if the template has any async behavior** (an `<await>` tag).

(The client-side counterpart is `template.mount(input, node)`, which builds reactive DOM in
the browser — that's what the client-side-rendering lessons use. Here we render on the
server.)

## Where the client JS comes from — linked mode

You only called `render()` on the server, yet the spotlight tracks your mouse — so client
JavaScript is running. That's `@marko/vite`'s **linked mode**, enabled by the `--app` flag
in the build script (`vite build --app`). Linked mode produces **two linked outputs**: the
SSR server bundle *and* a matching client bundle. `@marko/vite` then injects the client
entry into the HTML your server renders — in dev as well as in the production build — so any
interactive parts (here, the `<mouse-mask>` tag's `mousemove` handler) **hydrate
automatically**. No marko-run, and no hand-written `<script>` tags.

:::info
In dev, that injected HTML briefly sets `html { visibility: hidden }` and removes it the
moment the client entry loads, so the page appears only once hydration is ready. It's the
small tradeoff that comes with automatic hydration.
:::

## marko-run vs. this

This is the mirror image of Part 8's **Mounting the Router** showcase. There, an existing
Express server hosts an entire marko-run app through `routerMiddleware()` — file-based
routing, automatic rendering, the whole framework dropped in. Here there's no marko-run at
all: you write each route and call `render()` yourself, with `@marko/vite` acting only as
the bundler. Two answers to the same question — *how do I put Marko into an Express server?*
— with the framework, and without it.
