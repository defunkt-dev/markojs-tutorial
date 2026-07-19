---
type: lesson
template: marko-microframe
title: Streaming from the Remote
focus: /remote/src/routes/fragment/+page.marko
previews:
  - [3000, 'Host app']
  - [3001, 'Remote app']
prepareCommands:
  - ['pnpm -C host install', 'Installing the host app']
  - ['pnpm -C remote install', 'Installing the remote app']
mainCommand: ['pnpm run dev', 'Starting the host and remote servers']
---

# Streaming from the Remote

:::tip
These lessons render on the **server**, so the preview doesn't always refresh by itself. If it looks stale after you Solve a step or switch lessons, hit **reload** on the preview.
:::

A remote doesn't have to render all at once. It can **stream** — send the parts it already
has, show a placeholder for the slow parts, and fill them in as they resolve. Because
`<micro-frame>` embeds whatever the remote sends, the host gets that streaming for free: the
remote's placeholder appears, then its real content swaps in — and the host never knows the
remote was doing async work.

The host here already embeds the remote (`host/src/routes/+page.marko`), unchanged from
before. This time you'll make the **remote** stream.

Marko streams an `<await>` on its own: wrap the slow part in a `<try>` with a
`<@placeholder>`, and Marko flushes the placeholder first, then the resolved content.

```marko
<try>
  <await|data|=slowThing()>
    ${data}
  </await>
  <@placeholder>
    loading…
  </@placeholder>
</try>
```

(In a real app `slowThing()` is an API call; here we fake it with a timer.)

In `remote/src/routes/fragment/+page.marko`:

1. Wrap the deal in a `<try>` … `</try>`.
2. Inside, replace the hard-coded text with an `<await|deal|=…>` whose promise resolves after
   a short delay — a `new Promise` with a `setTimeout` is fine.
3. Add a `<@placeholder>` with a loading message.

Reload the host preview: the remote's placeholder shows for a beat, then the deal streams in —
rendered by the remote, embedded live in the host, with the host none the wiser.
