---
type: lesson
title: Client-Side Routing
focus: /src/router.js
template: marko-run-spa
---

# Client-Side Routing

Everything you've built with marko-run so far is a **multi-page app**: each `<a>`
is a fresh request, the server renders a whole new page, and the browser replaces
the document. That's the default, and a good one — fast first paint, no client
router to ship.

Sometimes you want a **single-page app** instead: after the first load, clicking a
link should swap only the part of the page that changed, update the address bar,
and never round-trip to the server. marko-run has no built-in client router — so
you build one, in a few lines, on the browser's **History API**. And because this
is Marko, you keep server rendering: the first page renders on the server and then
*hydrates*, so a deep link or a refresh still works.

## The setup (already written)

**One catch-all route.** `src/routes/$$path/+handler.js` runs for *every* URL, so
the server can render the right starting view whether you land on `/`, `/completed`,
or `/archived`:

```js
export function GET(context) {
  const url = new URL(context.request.url);
  context.route = matchRoute(url.pathname);
  context.serializedGlobals = ["route"];
}
```

It uses `matchRoute` to turn the URL into a route name, stashes it on `context`
(which *is* `$global`), and lists it in `serializedGlobals` so the value crosses to
the browser for hydration.

**The shell.** `src/routes/$$path/+page.marko` reads that route into a reactive
`<let>`, renders the matching view, and turns each nav link into a client-side
navigation:

```marko
<let/route=$global.route>

<nav>
  <for|name| of=ROUTES>
    <a href=`/${name}` onClick(e) {
      e.preventDefault();
      navigate(name);
      route = matchRoute(location.pathname);
    }>${name}</a>
  </for>
</nav>

<main>
  <if=(route === "active")><ActiveView/></if>
  <else-if=(route === "completed")><CompletedView/></else-if>
  <else-if=(route === "archived")><ArchivedView/></else-if>
</main>
```

`e.preventDefault()` stops the browser's normal full-page navigation. Then
`navigate` updates the URL, and `matchRoute(location.pathname)` reads it back to
choose the view — the **URL is the single source of truth**, which is exactly why
the back button will work too. One consequence worth noticing up front: **until you
implement the router, clicking a tab does nothing.** Nothing is changing the URL, so
`matchRoute` keeps returning the same view. Making the tabs come alive *is* the
exercise.

## Your job — the router

Open `src/router.js`. It has three stubbed functions; fill them in with the
History API. None of this is Marko-specific — it's the plumbing every SPA needs.

- **`matchRoute(pathname)`** — take the first segment of the path (`/completed` →
  `"completed"`), return it if it's a known route, else `"active"`. The server
  handler *and* the browser both use this, so implementing it also makes deep links
  render correctly on the server.
- **`navigate(name)`** — the heart of it. Call `history.pushState(state, "", "/" +
  name)` to change the address bar **without a reload**. That one call is the whole
  difference between an SPA and a full page load.
- **`onPopState(callback)`** — the back and forward buttons fire a `popstate` event.
  Add a listener that calls `callback` with the freshly-matched route (the shell
  uses it to sync `route` back to the URL), and return a function that removes the
  listener again.

## What you'll see

Before you touch `src/router.js`, the tabs are dead — clicking them does nothing.
Once the three functions are in, click a tab and the view swaps **instantly**, with
no full-page reload. Behind the scenes the address bar is now updating too and the
**back** button walks you through the views — but the tutorial preview is a
bare frame with no address bar, so to watch the URL change (and try back/forward,
and deep-link straight to `/completed`) open the preview in its own browser tab.
Either way, the swap you *can* see is the tell: that's a client-side route change,
served from one small file that still renders on the server for the first load.

:::warning
The view is chosen with a plain `<if>` / `<else-if>` chain over static component
tags. It's tempting to keep a lookup object instead —
`<const/views={ active: ActiveView, ... }>` and then `<${views[route]}/>`.
**Don't.** That works in the dev server but silently breaks in a production build:
Marko's fine-grained bundler only ships the view that rendered first, so navigating
to the others shows an empty page. Referencing each component directly — in an
`<if>` chain, a conditional expression, or a module-level constant — is what tells
the compiler to bundle them all.
:::

:::tip
This hand-rolled History-API approach works today and is worth understanding either
way. The Marko team is also developing official single-page-app support that will
make this even smoother — so keep an eye out; the wiring here may get simpler in a
future release.
:::

:::info
Marko is a multi-page framework at heart, and MPAs are the right call more often
than people expect — simpler, and faster to first paint. Reach for a client-side
SPA when you specifically need instant in-page transitions; keep the server-rendered
shell (as here) so the first load and deep links stay fast.
:::
