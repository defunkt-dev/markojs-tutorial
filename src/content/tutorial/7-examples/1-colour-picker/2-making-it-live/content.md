---
type: lesson
title: Making It Live
focus: /src/routes/+page.marko
---

# Making It Live

Three hard-coded `128`s and three inert sliders. Let's connect them.

A colour is really three numbers, so give it three state variables and
**bind** each slider to one. Because a slider reports its value as a
string, bind through `Number` so the state stays numeric:

```marko
<let/r=128>
<input type="range" min="0" max="255" value:Number:=r>
```

Now dragging a slider updates `r`. The swatch and readout should follow
on their own — so rather than repeat the `rgb(...)` string, **derive**
it once and reuse it:

```marko
<const/rgb=`rgb(${r}, ${g}, ${b})`>
```

`rgb` recomputes whenever `r`, `g`, or `b` changes, and both the
swatch's `background` and the readout can interpolate it with `${rgb}`.

Wire it up:

1. Replace the hard-coded values with three `<let>` variables — `r`,
   `g`, `b`, each `128`.
2. Bind each slider with `value:Number:=` to its variable.
3. Add a derived `<const/rgb=...>`, and use `${rgb}` in the swatch's
   inline `background` and in the readout.

Drag a slider — the swatch moves with it. One source of truth, three
views. Now let's make it useful.
