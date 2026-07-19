---
type: lesson
title: Event Subscriptions
focus: /src/tags/subscribe.marko
---

# Event Subscriptions

Components often need to listen to something *outside* themselves — the window
resizing, a keydown anywhere on the page, a custom event bus. The listener has
to be added when you start caring and removed when you stop, or you leak
handlers. In the Rive lesson you met the core move — `<script>` to set up,
`$signal.onabort` to tear down. Here you'll package it into a small reusable
tag: `<subscribe>`.

The idea: `<subscribe to=window event="mousemove" onFire(e){ … }/>` adds a
listener, and — because it's a tag — cleans itself up automatically when it
leaves the page. Drop it inside an `<if>` and you get a subscription that turns
on and off with a condition, no manual bookkeeping.

The tag is just an effect:

```marko
<script>
  /* add the listener; remove it on cleanup */
</script>
```

## Wire it up (your job)

Open `src/tags/subscribe.marko`. Add a listener for `input.event` on
`input.to`, forward each event to the caller's `input.onFire`, and remove it on
cleanup:

```marko
<script>
  const handler = (...args) => input.onFire && input.onFire(...args);
  input.to.addEventListener(input.event, handler);
  $signal.onabort = () => input.to.removeEventListener(input.event, handler);
</script>
```

Now click **Start tracking**. The `<if>` renders `<subscribe>`, which starts
forwarding `mousemove` events, and the pointer's X position updates live. Click
**Stop** and the `<if>` removes `<subscribe>` — Marko fires `$signal`, your
cleanup runs, and the listener is gone. The subscription's whole lifecycle is
tied to whether the tag is on the page.

:::info
This is the same `<script>` + `$signal` pattern from the Rive lesson, and
that's the point: in Marko 6 an "effect with cleanup" is a first-class tag you
can build and reuse. Older Marko shipped a dedicated `<subscribe>` library for
this; here it's a handful of lines, because the primitive is built in.
:::

:::tip
`input.to` only needs `addEventListener`/`removeEventListener`, so this works
for `window`, `document`, any element, or your own `EventTarget`. For an emitter
with `.on`/`.off` instead, swap those two calls — the lifecycle wiring is
identical.
:::

That's a reusable subscription tag: set up in `<script>`, tear down on
`$signal`, and let conditional rendering decide when it's alive.
