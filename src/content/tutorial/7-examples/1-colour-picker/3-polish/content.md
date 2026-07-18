---
type: lesson
title: Polish
focus: /src/routes/+page.marko
---

# Polish

A working picker wants a few finishing touches: a hex code, readable
text on the swatch, a copy button, and some presets.

**Hex** is another derived value — each channel as two hex digits. Pull
the conversion into a `static` helper (it's the same maths every
render, so it doesn't belong in the reactive part):

```marko
static const toHex = (n) => n.toString(16).padStart(2, "0");
// ...
<const/hex=`#${toHex(r)}${toHex(g)}${toHex(b)}`>
```

**Readable text** on the swatch means choosing black or white based on
how bright the colour is — again a `static` helper feeding a `<const>`.
**Copy** is a one-line handler over the browser clipboard. And
**presets** are just an array rendered with `<for>`, each button
assigning `r`, `g`, `b` on click:

```marko
<for|preset| of=PRESETS>
  <button onClick() { r = preset.r; g = preset.g; b = preset.b }>
    ${preset.name}
  </button>
</for>
```

Finish it:

1. Add `static` helpers for hex and for readable text, then
   `<const/hex=...>` and `<const/textColor=...>`.
2. Show the hex on the swatch (coloured with `textColor`) and in the
   readout.
3. Add a **Copy hex** button:
   `onClick() { navigator.clipboard.writeText(hex) }`.
4. Add a `PRESETS` array and render preset buttons with `<for>`.

That's a complete little app — sliders, derived colour, hex, copy, and
presets — assembled entirely from tags you already knew. On to the next
one.
