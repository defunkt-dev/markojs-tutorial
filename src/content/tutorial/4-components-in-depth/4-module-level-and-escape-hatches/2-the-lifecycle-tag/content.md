---
type: lesson
title: The lifecycle Tag
focus: /src/routes/+page.marko
---

# The lifecycle Tag

Part two's effects rule of thumb still stands: `<script>` with
`$signal` covers nearly everything. But some imperative APIs come as a
*long-lived object* — a map, a chart, a media player — with distinct
create / reconfigure / destroy moments. For those, `<lifecycle>` gives
the classic three hooks:

```marko
<lifecycle
  onMount() {
    this.player = createPlayer(container(), { volume });
  }
  onUpdate() {
    this.player.setVolume(volume);
  }
  onDestroy() {
    this.player.dispose();
  }
/>
```

The rules: `onMount` runs once when attached; `onUpdate` re-runs when
*its own* dependencies change; `onDestroy` runs once on removal; and
`this` is shared across the three — the natural home for the object
you're managing.

The page on the right manages a deliberately old-school "plugin": a
tiny clock widget with `create/update/destroy` functions (peek at the
static block). It's currently wired with nothing, so the clock area
stays empty:

1. Add a `<lifecycle>` that `onMount` creates the clock into the
   `clockBox()` element (a tag variable — lesson two paying off) and
   stores it on `this`; `onUpdate` calls
   `this.clock.setFormat(use24h)`; `onDestroy` calls
   `this.clock.destroy()`.
2. Toggle the 24-hour checkbox — `onUpdate` fires because it reads
   `use24h`. Toggle the "show clock" box — mount and destroy fire as
   the `<if>` adds and removes the subtree.

Rare tool, right shape when you need it.
