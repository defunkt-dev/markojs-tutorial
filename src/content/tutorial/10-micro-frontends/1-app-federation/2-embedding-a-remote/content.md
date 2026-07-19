---
type: lesson
template: marko-microframe
title: Embedding a Remote
focus: /host/src/routes/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Starting the host and remote servers']
---

# Embedding a Remote

:::tip
These lessons render on the **server**, so the preview doesn't always refresh by itself. If it looks stale after you Solve a step or switch lessons, hit **reload** on the preview.
:::

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
of app federation. The host embeds the remote's **output**, never its code.
