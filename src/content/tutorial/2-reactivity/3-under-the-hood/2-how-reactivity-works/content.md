---
type: lesson
title: How Reactivity Works
focus: /src/routes/+page.marko
---

# How Reactivity Works

You've used the machine for twelve lessons; here's a look inside it.
Marko's reactive system has three parts.

**Reactive variables.** Tag variables (from `<let>`, `<const>` and
friends), tag parameters, and `input` are all tracked.

**Render expressions.** Any expression in a template that touches a
reactive variable — in text, attributes, dynamic tag names, script
content — re-runs when that variable updates. The exceptions are
`static` statements (and `import`/`export`), which run exactly once
when the template loads. And here's the distinctly-Marko part: this
dependency graph is discovered **at compile time**. Where other
frameworks track dependencies at runtime — signals, hooks, proxies —
Marko's compiler reads your template and wires the graph before the
browser ever sees it. That's why a plain `let` is reactive with no
wrapper: the language itself is the API.

**Scheduled updates.** Assignments don't repaint instantly — updates
are batched into a queue (flushed after a microtask), so a handler
that assigns five times paints once. Updates arriving mid-paint defer
to the next frame, which also makes infinite update loops impossible.
The three log lines you'll see per click on the right — not fifteen —
are this batching, visible.

## Assignment ergonomics: immer

The chapter-one rule — build the next value, assign it — gets noisy on
nested state. The spread chains from the objects-and-arrays lesson are
the honest manual way; [immer](https://immerjs.github.io/immer/) is
the popular shortcut. Its `produce` lets you write *mutation-shaped*
code that yields a fresh value — mutate the draft, assign the result:

```marko
import { produce } from "immer"

<let/order={ items: [], customer: { name: "" } }>

<button onClick() {
  order = produce(order, (draft) => {
    draft.items.push("mug");
    draft.customer.name = "Ada";
  });
}>
```

Still assignment-triggered — `produce` just builds the next value for
you. Try it on the right: the "Promote" button updates three nested
fields with stacked spreads. Rewrite its handler with `produce` (the
import is already at the top). Same behavior, a third of the
punctuation — and click it a few times with the console open to watch
the batching count.
