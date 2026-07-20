---
type: lesson
title: Loading .env with Vite
focus: /src/routes/+page.marko
template: marko-run-env-vite
---

# Loading .env with Vite

The previous lesson used marko-run's `-e` flag to load a `.env` at runtime. Here's the same job a
different way: since marko-run is built on **Vite**, you can let Vite read the `.env` and bake the
values into your app at build time — no `-e` flag needed. This is a finished example — read
through it.

## The `.env` file

Same as before:

```
SITE_NAME=Marko Shop
SUPPORT_EMAIL=help@markoshop.example
```

## `vite.config.ts`

Vite has built-in `.env` support. In `vite.config.ts`, `loadEnv` reads the file, and `define`
substitutes each value into your code when it's compiled:

```ts
const env = loadEnv(mode, process.cwd(), "");

return {
  plugins: [marko()],
  define: {
    "process.env.SITE_NAME": JSON.stringify(env.SITE_NAME),
    "process.env.SUPPORT_EMAIL": JSON.stringify(env.SUPPORT_EMAIL),
  },
};
```

`define` is a find-and-replace at build time: every `process.env.SITE_NAME` in your source is
swapped for the literal string `"Marko Shop"` before the code runs.

## Reading it

So the page reads `process.env` just like the marko-run version, and Vite fills in the values as
it compiles:

```marko
<h1>${process.env.SITE_NAME}</h1>
<p>Questions? Email ${process.env.SUPPORT_EMAIL}</p>
```

The preview shows the values from `.env`.

## Runtime vs. build time

Both lessons put `process.env.SITE_NAME` in the page, but they get there differently:

- **marko-run `-e .env`** injects the values into `process.env` at **runtime** (dotenvx). The
  reference stays in your compiled code and is resolved when the server runs.
- **Vite `define`** replaces the reference with the value at **build time**. The compiled output
  contains the literal string — there's no `process.env` left to resolve.

Build-time replacement means the value is fixed when you build (change `.env`, then rebuild), and
it's safe to use in client code too, since nothing reaches for `process` in the browser.

:::info
This is a finished example served live — read it here and **download the project** to experiment
(`npm run dev`).
:::
