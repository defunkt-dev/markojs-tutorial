---
type: lesson
template: marko-run-signals
title: A Signals Store
focus: /src/tags/counter-display.marko
---

# A Signals Store

In Marko 6, data flows explicitly — props down the tree, events back up — rather than through a context API. This covers a component and its
children. Either way, a `<context>` api is coming soon! But when two components that *aren't* parent and child need the
same state — a cart badge in the header, an "add to cart" button three
sections away — the cleanest answer is to lift that state out of the tree
entirely, into a **module every component can import**.

This project shares a counter between two independent components:
`counter-controls` (the buttons) and `counter-display` (the readout).
Neither sits inside the other — they're siblings on the page — yet they
stay in sync.

## The store

`src/shared/store.js` holds the shared state as a **signal** from
`@preact/signals-core`:

```js
import { signal } from "@preact/signals-core";

export const count = signal(0);
export function increment() { count.value++; }
```

A signal is a reactive box: `count.value` reads or writes what's inside,
and anything watching is notified the moment it changes. The module also
exports the *actions* that mutate it, so no component reaches for
`count.value` on its own — `counter-controls` just calls them:

```marko
import { increment } from "../shared/store.js"
<button onClick() { increment() }>+</button>
```

That's the write side, and it's already wired. Click **+** and the
signal's value really does change. But the readout doesn't move — nothing
is *listening* yet.

## Listening from a component (your job)

Marko's reactivity and the signal are two separate systems, so you bridge
them: subscribe to the signal, and push each new value into a Marko
`<let>`. Open `src/tags/counter-display.marko` and fill in the `<script>`:

```marko
<script>
  $signal.onabort = count.subscribe((v) => { value = v });
</script>
```

A signal's `subscribe(fn)` calls `fn` right away with the current value,
then again on every change, and hands back an unsubscribe function.
Assigning that to `$signal.onabort` — the same cleanup handle from the
stopwatch and the SSE feed — tears the subscription down when the
component unmounts. Each call sets the `value` let, and *that* assignment
is what re-renders the readout.

Now work the buttons. Both components move together: the controls write to
the store, the display reads from it, and neither knows the other exists.
Add a third component that imports `count` and it would track along too —
the store doesn't care who's listening.

:::info
`@preact/signals-core` is tiny and framework-agnostic: it's just a
reactive value with a `subscribe` method, which is exactly what makes it
easy to bridge into Marko. Any observable store — nanostores, a
hand-rolled emitter, even Redux's `store.subscribe` — plugs in the same
way: read the initial value, subscribe, update a `<let>`, unsubscribe on
cleanup.
:::

:::tip
On the server this component renders the `<let>`'s starting value — the
`<script>` is client-only, so the store is read in the browser after
hydration. Keep a sensible default in the `<let>` and the first paint is
always right.
:::

That's a central store: shared state living in a module, changed through
exported actions, and bridged into any component that needs to watch it —
no context, no prop-drilling, no parent in common.
