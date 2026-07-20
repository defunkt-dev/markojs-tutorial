---
type: lesson
title: Loading .env with marko-run
focus: /src/routes/+page.marko
template: marko-run-env
---

# Loading .env with marko-run

Real apps need configuration that changes between environments — a site name, an API URL, a
support address, secret keys — without editing the code each time. The usual home for that is a
**`.env` file**, and marko-run can load one for you. This is a complete, running example — read
through it.

## The `.env` file

At the project root:

```
SITE_NAME=Marko Shop
SUPPORT_EMAIL=help@markoshop.example
```

Each line is a `KEY=value`, kept outside your source so it can differ per environment.

## Loading it — the `-e` flag

marko-run does **not** read `.env` automatically. The dev script loads it explicitly:

```
marko-run dev -e .env
```

`-e` (short for `--env`) injects the file's values into `process.env`. Leave the flag off and
`process.env.SITE_NAME` is simply `undefined`. (Under the hood marko-run uses dotenvx; it also
picks up a `.env.local` for values you don't want to commit.)

## Reading it

marko-run renders pages on the **server** (Node), so `process.env` is available during SSR. The
page reads the config directly:

```marko
<h1>${process.env.SITE_NAME}</h1>
<p>Questions? Email ${process.env.SUPPORT_EMAIL}</p>
```

The preview shows the values from `.env`, baked into the HTML the server sends — the browser
never sees the file.

:::info
This is a finished example served live, so read it here and **download the project** to
experiment (`npm run dev`). The next lesson does the same job a different way — with Vite — and
there you'll write the code yourself.
:::

:::tip
Keep real secrets out of a committed `.env`. Put them in a git-ignored **`.env.local`** (which
marko-run also loads) and commit a `.env` with safe defaults. You can also read `process.env` in
a `+middleware.js` to compute values shared across every route.
:::
