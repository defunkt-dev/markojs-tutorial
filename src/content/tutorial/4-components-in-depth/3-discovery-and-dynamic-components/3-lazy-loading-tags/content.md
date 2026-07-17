---
type: lesson
title: Lazy Loading Tags
focus: /src/routes/+page.marko
---

# Lazy Loading Tags

The import shorthand from the discovery lesson has a superpower: an
*import attribute* that splits a tag into its own bundle and defers
loading its JavaScript until a trigger fires:

```marko
import VideoPlayer from "<video-player>" with { load: "visible#hero" }

<section#hero>
  <VideoPlayer src=input.src/>
</section>
```

Server rendering is unaffected — the HTML still streams complete. What
lazy loading defers is the *browser-side JavaScript*: hydration waits
for the trigger. The triggers read like a wishlist:

- `"render"` — split the bundle, load immediately (code-splitting
  alone)
- `"visible#id"` / `"visible.class"` — when the matched element
  scrolls into view (`?rootMargin=100px` to preload early)
- `"idle"` — when the browser is idle (`?timeout=2000` to cap the
  wait)
- `"media(max-width: 768px)"` — only when a media query matches
- `"on-focus[name=message]"` — on a DOM event hitting a selector
- combine with `|`: `"on-mouseover#chat | idle?timeout=5000"`

The page on the right is a long article with a comments widget at the
very bottom. Its (pretend-heavy) JavaScript currently loads for every
visitor, including the majority who never scroll down:

1. Change the plain relative usage to a lazy import:
   `import Comments from "<comments>" with { load: "visible.comments" }`
   at the top, and replace `<comments/>` with `<Comments/>`.
2. The widget sits inside `<section class="comments">` — the trigger's
   selector — so its JS now loads only when that section approaches
   the viewport. Watch the network panel while scrolling if you want
   proof.

One import attribute: code-split, deferred, and declaratively tied to
when it matters.
