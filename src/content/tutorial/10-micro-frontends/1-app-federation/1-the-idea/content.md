---
type: lesson
autoReload: true
template: marko-microframe
title: The Idea
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# The Idea

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you Solve a step, switch lessons, or if the notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page. Everything also works if you <strong>download the lesson</strong> and run it locally.</div>

A big app is rarely built, shipped, or owned by one team. **Micro-frontends** split a
site into independent pieces — each with its own codebase, release schedule, and owner —
that come together in the browser. They're the front-end cousin of microservices.

There are two ways to bring a remote piece into a host page:

- **Module federation** ships **code**: the host downloads the remote's JavaScript and
  runs it itself, so the host owns the render.
- **App federation** — Marko's approach — ships **rendered HTML**: the remote app renders
  its own piece (fetching its own data, running its own logic) and the host simply
  **embeds** the result. The remote owns the render; the host just knows a URL.

Marko does this with the `<micro-frame>` tag. It behaves like an `<iframe>` — "show me
what lives at this URL" — but instead of an isolated frame, the fetched HTML is streamed
straight into the page. This embedding of one document's output inside another is called
**transclusion**:

<svg viewBox="0 0 680 250" width="100%" style="max-width:680px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The host app fetches HTML from the remote app and embeds it in place.">
  <defs>
    <marker id="mf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
    </marker>
  </defs>
  <rect x="16" y="30" width="290" height="196" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="36" y="60" fill="currentColor" font-family="system-ui,sans-serif" font-size="16" font-weight="600">Host app</text>
  <text x="36" y="79" fill="currentColor" opacity="0.6" font-family="system-ui,sans-serif" font-size="13">localhost:3000</text>
  <rect x="36" y="92" width="160" height="9" rx="4" fill="currentColor" opacity="0.22"/>
  <rect x="36" y="109" width="220" height="9" rx="4" fill="currentColor" opacity="0.22"/>
  <rect x="36" y="132" width="230" height="80" rx="8" fill="none" stroke="#cc0067" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="48" y="153" fill="#cc0067" font-family="ui-monospace,monospace" font-size="13">&lt;micro-frame&gt;</text>
  <rect x="50" y="164" width="202" height="38" rx="6" fill="#cc0067"/>
  <text x="151" y="188" fill="#ffffff" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600">remote's HTML, embedded here</text>
  <rect x="446" y="30" width="218" height="196" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="466" y="60" fill="currentColor" font-family="system-ui,sans-serif" font-size="16" font-weight="600">Remote app</text>
  <text x="466" y="79" fill="currentColor" opacity="0.6" font-family="system-ui,sans-serif" font-size="13">localhost:3001 /fragment</text>
  <rect x="466" y="132" width="180" height="60" rx="6" fill="#cc0067"/>
  <text x="556" y="167" fill="#ffffff" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600">renders its own HTML</text>
  <path d="M306 154 C 378 154, 372 138, 444 138" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.85" marker-end="url(#mf-arrow)"/>
  <text x="330" y="132" fill="currentColor" opacity="0.85" font-family="system-ui,sans-serif" font-size="12">1. fetch</text>
  <path d="M444 186 C 372 186, 378 196, 306 196" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.85" marker-end="url(#mf-arrow)"/>
  <text x="326" y="214" fill="currentColor" opacity="0.85" font-family="system-ui,sans-serif" font-size="12">2. HTML back</text>
</svg>

This workspace has **two separate apps** — look at the file tree: a `host/` app on port
3000 and a `remote/` app on port 3001, each with its own `package.json`. They can even be
on different Marko versions (this host is on Marko 5 so it can use the `@micro-frame/marko`
tags; the remote is a plain Marko 6 app). Each keeps its **own Marko runtime**, kept apart by
a `runtimeId` (set in the remote's `vite.config`), so the two don't clash once the remote's
HTML lands inside the host page.

The remote notice is a **real, interactive** component — try dismissing it with the ×. Its
JavaScript is served by the remote, but the browser can't reach the remote's port directly, so
the host forwards those requests through itself (the `/remote-assets/` route in `host/`). That's
the point of app federation: the remote is a fully independent app — its own render, data, and
interactivity — and the host just embeds the result and relays what the browser needs. Open
**both** previews: the host page already embeds the remote's notice with `<micro-frame>`, and
the remote serves that same notice on its own at `/fragment`. Unlike an iframe, the embedded
notice is just part of the host's HTML — no box, no separate scrollbar, and it's visible to search
engines and screen readers.

## Seeing the runtime isolation

How do two Marko runtimes share one page without stepping on each other? The `runtimeId`.
The remote is built with `runtimeId: 'mr'`, so every marker and every piece of hydration data
it emits is namespaced with `mr` — no other app's runtime uses that key, so nothing collides.

Open the **Remote app** preview (port 3001), then use your browser's **View Source** to see the
real bytes. Alongside the notice's HTML you'll find Marko's component-boundary comments and a
small hydration script, all carrying the `mr` id — roughly like this (simplified):

```html
<!--mr ...-->                          <!-- component boundary, namespaced by runtimeId -->
<div ...>…the notice…</div>
<script>$mr_C = window.$mr_C || [];    /* the remote's hydration registry, keyed by "mr" */
        $mr_C.push(/* scope + state for the × button */)</script>
```

When the host embeds this, its own runtime lives under a **different** id, so the two sets of
markers and registries never overlap. That's what lets you drop as many remotes as you like
onto one page — each stays sandboxed by its own `runtimeId`.

In the next lesson you'll wire the embed up yourself.
