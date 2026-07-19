---
type: lesson
template: marko-run-rive
title: A Rive Animation
focus: /src/tags/rive-canvas.marko
---

# A Rive Animation

Marko is declarative and reactive, but the wider JavaScript world is full of
imperative libraries — canvas renderers, map engines, chart toolkits — that
want a raw DOM node and expect you to `new` them up, call methods on them, and
tear them down by hand. Wrapping one in a Marko component is a specific,
repeatable pattern; once you've done it once, you can wrap almost anything.

[Rive](https://rive.app) is a good example: it plays interactive `.riv`
animations by drawing onto a `<canvas>`. Its runtime, `@rive-app/canvas`, is
framework-agnostic — hand it a canvas element and a `.riv` file and it takes
over. Our job is to give it a Marko home.

The wrapper's shape is already in place:

```marko
import * as rive from "@rive-app/canvas"

<let/instance=null>
<canvas/canvasEl width=input.width height=input.height/>

<script>
  /* start the runtime here */
</script>

<return=instance>
```

Three pieces do the work:
- **`<canvas/canvasEl>`** renders the canvas *and* gives you a handle to the
  real DOM node — `canvasEl()` returns it.
- **`<script>`** is a client effect: it runs once the tag is mounted in the
  browser (exactly when that DOM node exists), and it's where imperative setup
  belongs.
- **`<return=instance>`** hands the running instance back to whoever used the
  tag, so a parent could call `.play()`, `.pause()`, and so on.

## Start the runtime (your job)

Open `src/tags/rive-canvas.marko` and fill in the `<script>`. Create a Rive
instance pointed at the canvas, remember it, and make sure it's cleaned up:

```marko
<script>
  const r = new rive.Rive({
    src: input.src,
    canvas: canvasEl(),
    autoplay: true,
    stateMachines: input.stateMachines,
    onLoad() { r.resizeDrawingSurfaceToCanvas() },
  });
  instance = r;
  $signal.onabort = () => r.cleanup();
</script>
```

Save, and the animation comes to life in the preview. Two details carry the
whole pattern: `canvas: canvasEl()` connects the runtime to the DOM node Marko
rendered, and **`$signal.onabort = () => r.cleanup()`** is the part people
forget — when the tag unmounts (or the effect re-runs), Marko fires `$signal`,
and this hands the library its chance to release the canvas, timers, and
memory. Skip it and you leak.

:::info
The `<canvas>` is server-rendered like any element, but the animation is
purely client-side — the runtime only starts once `<script>` runs in the
browser, so on the server you get an empty canvas that springs to life after
hydration. That's expected for anything WebGL/canvas-based.
:::

:::tip
This shape — **node ref + `<script>` setup + `$signal` cleanup + `<return>`
handle** — is the template for wrapping *any* imperative library: a map
(`new maplibregl.Map({ container })`), a code editor (`new EditorView(...)`),
a chart engine. Swap Rive for the library and `<canvas>` for whatever node it
wants; the wiring is the same.
:::

That's the wrapper pattern: hand an imperative runtime a DOM node inside a
`<script>` effect, clean it up on `$signal`, and return its instance — Marko's
reactive world and an imperative library, cooperating.
