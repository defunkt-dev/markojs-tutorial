---
type: lesson
autoReload: true
template: marko-microframe
title: Embedding a Remote
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Building the remote, then starting both apps']
---

# Embedding a Remote

<div style="margin:1.25rem 0;border:2px solid #f59e0b;border-left-width:8px;border-radius:8px;background:#fff7ed;color:#7c2d12;padding:0.85rem 1rem;font-size:0.95rem;line-height:1.5"><div style="font-weight:800;text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;color:#b45309;margin-bottom:0.3rem">⚠️ If the preview looks stale — reload it</div>This lesson runs <strong>two apps</strong> in the preview, and it doesn't always refresh on its own. After you Solve a step, switch lessons, or if the notice's <strong>×</strong> button stops working, hit <strong>reload on the preview</strong> — or reload the whole page. Everything also works if you <strong>download the lesson</strong> and run it locally.</div>

The host page (`host/src/routes/+page.marko`) is empty where the remote notice should go.
Let's embed it. The remote already serves the notice at `http://localhost:3001/fragment`
— your job is to pull it into the host.

Add a `<micro-frame>` and point its **`src`** at that URL:

```marko
<micro-frame src="http://localhost:3001/fragment" client-reorder timeout=0/>
```

On the server, `<micro-frame>` fetches that URL and streams the returned HTML into the page
right where the tag sits — no iframe, no wrapper. Because the two apps run behind the same
host here, there's no cross-origin problem to worry about (in production you'd serve them
from the same domain, or add the right CORS headers).

A few attributes make it robust:

- **`client-reorder`** lets the rest of the page paint right away and drops the remote in
  when it arrives, instead of blocking on the fetch.
- **`<@loading>`** renders a placeholder in the meantime.
- **`<@catch|err|>`** renders a fallback if the request fails or times out.

`timeout=0` disables the default 30-second timeout — handy when a remote is slow; drop it
to get the default back.

Build it:

1. Add `<micro-frame>` with `src="http://localhost:3001/fragment"` and `client-reorder` where the comment is.
2. Give it a `<@loading>` message.
3. Give it a `<@catch|err|>` fallback that shows `${err.message}`.

When it renders, you've composed two independently-built apps into one page — the essence
of app federation. The host embeds the remote's **output**, never its code. The embedded
notice is fully interactive too — its × runs in the browser, served by the remote through the
host.
