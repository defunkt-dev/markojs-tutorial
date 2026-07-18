---
type: lesson
title: The Shape
focus: /src/routes/+page.marko
---

# The Shape

Time to put the pieces together. Over the next three lessons you'll
build a colour picker — three sliders that mix a live colour, with a
hex readout, a copy button, and preset swatches. Nothing here is new;
it's all tags, state, derived values, and loops you've already met.

Start where every component starts: the **static shape**, before any
wiring. A preview swatch, three range inputs, and a readout line:

```marko
<div style="width:150px;height:150px;background:rgb(128, 128, 128)"></div>
<label>R <input type="range" min="0" max="255" value="128"></label>
```

The swatch is just a `<div>` with an inline `background`. Each slider
is a native `<input type="range">` — no library, no custom widget. For
now everything is hard-coded to `128` (a neutral grey), and the sliders
don't move anything yet. That's fine — we're laying out the shape, not
the behaviour.

Build it out:

1. Add the swatch `<div>` with `background:rgb(128, 128, 128)`.
2. Add three sliders (R, G, B), each `min="0" max="255" value="128"`,
   each wrapped in a `<label>`.
3. Add a `<p>` readout showing `rgb(128, 128, 128)`.

It looks like a colour picker and does nothing. Next we make it move.
