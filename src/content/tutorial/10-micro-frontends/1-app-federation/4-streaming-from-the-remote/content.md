---
type: lesson
autoReload: true
template: marko-microframe
title: Streaming from the Remote
focus: /remote/src/routes/fragment/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# Streaming from the Remote

<div style="margin:1.25rem 0;border:2px solid #3b82f6;border-left-width:8px;border-radius:8px;background:#eff6ff;color:#1e3a8a;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#1d4ed8;margin-bottom:0.3rem">🔒 Read-only demo — editing won't change the preview</div>This lesson is a <strong>finished demo</strong>. The remote app runs <strong>pre-built</strong> here — that's what lets the notice's <strong>×</strong> work in the browser — and a pre-built app can't reflect code edits, so changing the code <strong>won't update the preview</strong>. Read along and watch it run. To edit the code and see it live, <strong>download the lesson</strong> and run it locally.</div>

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you switch lessons, or if the notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page.</div>

A remote doesn't have to render all at once. It can **stream** — send the parts it already
has, show a placeholder for the slow parts, and fill them in as they resolve. Because
`<micro-frame>` embeds whatever the remote sends, the host gets that streaming for free: the
remote's placeholder appears, then its real content swaps in — and the host never knows the
remote was doing async work.

Marko streams an `<await>` on its own: wrap the slow part in a `<try>` with a
`<@placeholder>`, and Marko flushes the placeholder first, then the resolved content. Here's
the remote's notice doing exactly that (`remote/src/routes/fragment/+page.marko`):

```marko
<try>
  <await|deal|=new Promise((resolve) => setTimeout(() => resolve("50% off — ends tonight"), 800))>
    <div>${deal}</div>
  </await>
  <@placeholder>
    <div>Loading the latest deal…</div>
  </@placeholder>
</try>
```

(In a real app the promise is an API call; here we fake the delay with a timer.)

On the host side, the `<micro-frame>` embeds the remote as always — with one change from the
earlier lessons: **no `client-reorder`**. With `client-reorder`, the host buffers the remote's
output and drops it in all at once, so you'd never see it stream. Without it, the host paints the
remote's stream in order — so the placeholder shows first, then the deal swaps in.

Watch the **Host app** preview: the remote's "Loading the latest deal…" placeholder shows for
a beat, then the deal streams in — rendered by the remote, embedded live in the host, which
never knew the difference. The notice is still dismissible; its × runs in the browser.

That's the end of Chapter 1. You've embedded a remote, refreshed it from the client, and
streamed it — all app federation, all with the remote owning its own render.
