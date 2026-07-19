---
type: lesson
title: Loading on Demand
focus: /src/routes/+page.marko
---

# Loading on Demand

The facade in the last lesson defers a component's *JavaScript* — but its
HTML still renders on the server, so the widget is on the page from the
first byte; only its interactivity waits. Sometimes that isn't what you
want. Sometimes you want to defer the **whole component** — render nothing
at all until the user asks for it (opens a panel, expands a section, clicks
a tab).

That's a different axis. Here's the whole picture:

| Approach | The content | Its JS bundle | Deferred in the dev preview? |
| --- | --- | --- | --- |
| Facade / `load:` (last lesson) | server-rendered, there immediately | split out | no — dev loads it eagerly |
| `<if>` + a lazy component | not rendered until shown | split out | yes |
| dynamic `import()` | not rendered until shown | split out | yes |

The facade keeps the content and defers *hydration*; the other two defer the
*content itself*. This lesson does the second kind — and unlike the facade,
you'll actually see it happen.

## Gate a lazy component with `<if>` (your job)

`src/routes/+page.marko` renders `<DetailsPanel/>` directly. It's already a
lazy import — `with { load: "render" }` puts its JavaScript in its own
bundle — but because it's *always rendered*, it's server-rendered into every
page anyway. Put it behind a button so it appears only on demand:

```marko
<let/show=false>

<button onClick() { show = true }>Show details</button>

<if=(show)>
  <DetailsPanel/>
</if>
```

Now the panel isn't in the page at all until you click — its HTML *and* its
bundle both arrive on demand. Reload and watch: the panel is gone, just the
button; click it and the panel renders in. That's a change you can actually
*see* — the thing the facade lesson couldn't show you, because there the
content was there all along.

## The same thing by hand: dynamic `import()`

`<if>` plus a lazy tag is the declarative route. The imperative equivalent is
a plain dynamic `import()` — you fetch the component's module yourself in the
handler, then render it with Marko's dynamic-tag syntax, `<${...}/>`:

```marko
<let/Panel=null>

<button onClick() {
  import("../tags/details-panel.marko").then((m) => { Panel = m.default });
}>Show details</button>

<if=(Panel)>
  <${Panel}/>
</if>
```

Same result — nothing until the click, then the panel loads and renders,
and it's split into its own chunk either way. These are two styles, not a
right and a wrong. The declarative version is less code and lets Marko name
and wire the chunk for you; the imperative version is ordinary JavaScript
you'd recognize from any framework, and it hands you the module object
directly, which is handy if you need to do something with it before it
renders.

:::info
Notice what the preview reveals here that it *couldn't* for the facade: in
dev the facade eager-loads its bundle, but both of these genuinely wait —
because the component isn't rendered until the click, nothing requests its
code until then. In a production build all three defer; what the preview
shows you is the difference between "content already there" and "content
deferred."
:::

That's the on-demand toolbox: reach for a **facade** when you want the
content shown and only its hydration deferred, and reach for **`<if>` + a
lazy component** (or a **dynamic `import()`**) when you don't want to render
it at all until the user asks.
