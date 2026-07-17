---
type: lesson
title: Dynamic Components
focus: /src/routes/+page.marko
---

# Dynamic Components

Part one drew a hard line: `<${"card"}/>` renders a native HTML
`<card>` element — **strings never find components**. Here's the other
half: dynamic tags render components when given a **reference** — an
imported template is a value like any other:

```marko
import BarChart from "../charts/bar.marko"
import LineChart from "../charts/line.marko"

<const/Chart=input.style === "bar" ? BarChart : LineChart>
<${Chart} data=input.data/>
```

Everything composes: the dynamic tag takes attributes, content, even
attribute tags — whatever the chosen component accepts. A falsy value
still means "content only, no wrapper," and — since the reference is
just data — components can travel through `input`, live in arrays, or
sit in a lookup object.

The notification center on the right imports three alert-flavor
components and picks with a hardcoded `<info-alert/>`, ignoring each
message's `kind`:

1. Build the lookup above the loop:
   `<const/alertKinds={ info: InfoAlert, warning: WarningAlert, error: ErrorAlert }>`
2. Inside the loop, replace `<info-alert message=.../>` with
   `<${alertKinds[msg.kind]} message=msg.text/>`.
3. Three kinds, three components, one render site — and if a kind ever
   has no entry, the falsy rule quietly renders nothing rather than
   crashing.

The boundary from part one still stands, now with both halves:
strings → native tags, references → components. Say it once more and
you'll never debug it.
