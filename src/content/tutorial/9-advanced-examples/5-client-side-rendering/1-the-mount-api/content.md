---
type: lesson
template: marko-csr
title: The mount() API
focus: /src/main.js
---

# The mount() API

Every app so far has run through marko-run: the server renders your
templates to HTML, ships it, and the browser takes over. This one has **no
server at all**. Marko can render a template entirely in the browser — no
SSR, no marko-run, just a plain Vite app that builds to static files a CDN
could serve.

The setup is small. `index.html` has an empty mount point and loads one
script:

```html
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
```

`src/main.js` is the entry — it imports a `.marko` template and renders it.
And `vite.config.js` uses the Marko plugin in **unlinked** mode
(`marko({ linked: false })`): that's the switch that tells it to build a
browser-only bundle instead of the server-plus-client pair marko-run
produces.

## Mounting the template (your job)

A Marko template compiled for the browser has a `.mount()` method:

```js
Template.mount(input, node);
```

It builds the template's reactive DOM and drops it into `node`, and
`input` becomes the template's `input`. Open `src/main.js` and mount `App`
into the `#app` element:

```js
import App from "./app.marko";

App.mount({ name: "Marko" }, document.getElementById("app"));
```

That's the whole bootstrap. Save, and the preview springs to life — the
heading and a working counter, rendered client-side, with no HTML ever
coming from a server. The `{ name: "Marko" }` you passed is the template's
`input`; the counter's reactivity works exactly as it does everywhere else
in Marko.

:::info
`.mount()` returns an instance handle for the rare cases you need it:
`instance.update({ name: "…" })` feeds new input in, `instance.destroy()`
tears the whole thing down (aborting every `$signal`), and `instance.value`
reads a `<return>` value out. Most apps mount once and let reactivity do
the rest — you reach for these mainly when embedding Marko into a non-Marko
page, or in tests.
:::

:::tip
This is the lightest Marko deployment there is: `npm run build` emits an
`index.html` and a JS bundle into `dist/` — no Node process, no adapter.
Drop those files on any static host and the app runs entirely in your
users' browsers. You do give up SSR's fast first paint and SEO, so it fits
tools and dashboards behind a login better than public content pages.
:::

That's Marko with no server: a template, a mount point, and one `.mount()`
call — the same components and reactivity you already know, rendered
entirely in the browser.
