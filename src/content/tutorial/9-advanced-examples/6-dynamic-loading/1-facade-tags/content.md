---
type: lesson
title: Facade Tags
focus: /src/tags/comments/index.marko
---

# Facade Tags

Back in Part 4 you met the `load` import attribute — `import X from "<x>"
with { load: "visible#id" }` splits a tag into its own bundle and defers its
JavaScript until a trigger fires. But that opt-in lives at the *import site*:
every place that uses the tag has to remember it, and one plain `<x/>`
somewhere pulls the whole thing back into the main bundle.

A **facade** flips that around: it makes a tag *always* lazy. A facade is a
tiny wrapper tag that lazily imports the real implementation and forwards its
input. Consumers just use the wrapper — no `load` attribute anywhere — and
the heavy code is split out every time.

This project has the pieces in place:

```
src/tags/comments/
  index.marko              ← the facade (used as <comments/>)
  tags/
    comments-impl.marko    ← the real widget, private to the facade
```

The `comments-impl` lives in the facade's **own nested `tags/` directory**,
so only `index.marko` can see it — the rest of the app can't reach the eager
version by accident. The article page renders `<comments/>` at the bottom,
and right now the facade imports the widget eagerly, so its JavaScript ships
in the page's main bundle for every reader.

**Make the facade lazy.** In `src/tags/comments/index.marko`, add a `load`
trigger so the widget splits into its own bundle — loaded on the trigger
rather than up front with the page — and wrap it in `<try>` to give it a
loading state:

```marko
import CommentsImpl from "<comments-impl>" with { load: "visible.comments" }

<div.comments>
  <try>
    <CommentsImpl ...input/>
    <@placeholder>
      <p>Loading comments…</p>
    </@placeholder>
  </try>
</div>
```

## What changes — and what doesn't

This one's easy to misread, so here's the important part: **the preview looks
exactly the same before and after.** Hit *Solve* or *Reset* and the comments
render either way — because marko-run renders them *on the server*, and lazy
loading never delays HTML. The comments' text is in the page from the first
byte. This isn't a change you *see*.

What changes is the widget's **JavaScript**. Imported eagerly, it's baked
into the page's main bundle and downloaded by every visitor up front. Behind
the lazy facade, it's split into a bundle of its own — which in a
**production** build the browser fetches only when the trigger fires (here,
as the comments scroll into view), so the initial page stays light and
readers who never reach the bottom never download it.

One honest caveat about *this* preview: the dev server serves modules
eagerly and doesn't reproduce that deferral, so you'll see the comments'
code load right away no matter what — don't read anything into that. The
part you *can* verify here is the split itself, and that's a build artifact,
which is what the next step checks.

(The `@placeholder` is the loading state Marko shows *if* the widget is
rendered in the browser — say, after a client-side navigation — instead of
arriving pre-rendered from the server. On this first server-rendered load the
real content is already there, so you won't see the placeholder flash.)

## Seeing the split

Since the change lives in the build, that's where you check it. Open a
terminal and build into a throwaway folder — the `--output` flag keeps it
clear of the running preview — then list the client assets:

```bash
pnpm run build --output dist-check
ls dist-check/public/assets
```

You'll see a `comments-impl-*.js` file sitting on its own: the widget's
bundle, split out by the facade. Switch the facade back to the plain eager
import (*Reset*) and build again — it's gone, folded back into the main
chunk. That one file appearing and disappearing **is** the whole lesson.

:::tip
Any trigger works in a facade, not just `visible`. You met the full menu —
`"render"`, `"visible"`, `"idle"`, `"media(...)"`, `"on-focus/on-click/..."`,
and `|` combinations — back in *Lazy Loading Tags* (4/3/3); a facade just
picks one and applies it everywhere the tag is used. A rarely-seen widget
might use `"idle"`, one behind a button `"on-click#open"`. You can also drop
a `<@catch|err|>` inside the `<try>` to handle a bundle that fails to load.
:::

That's the facade pattern: a wrapper that makes a heavy tag always lazy,
keeps its implementation private, and splits its code into a bundle of its
own — code-splitting as an architectural default rather than a per-import
chore.
