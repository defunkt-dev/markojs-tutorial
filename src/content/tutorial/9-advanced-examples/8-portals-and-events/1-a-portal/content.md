---
type: lesson
title: A Portal
focus: /src/tags/portal.marko
---

# A Portal

Sometimes a component needs to render something that visually *breaks out* of
where it sits — a dialog, a tooltip, a dropdown. The obstacle is CSS: if any
ancestor has `overflow: hidden`, a `position`, or a `z-index` stacking
context, your dialog gets clipped or trapped beneath other content. The
classic fix is a **portal**: render the content inside your component, but
place its DOM somewhere else — usually `document.body`, where nothing clips
it.

Marko 6 doesn't ship a portal tag, but you can build one in a few lines. The
shape is already here:

```marko
<div/portalEl>
  <${input.content}/>
</div>

<script>
  /* move portalEl() somewhere else */
</script>
```

`<${input.content}/>` renders whatever the caller passed between the tags, and
`<div/portalEl>` hands you the real DOM node wrapping it.

## Move it (your job)

Open `src/tags/portal.marko` and finish the `<script>`. Grab the wrapper node,
pick the target (an element by id via `input.target`, or `document.body` by
default), move the node there, and clean up when the portal unmounts:

```marko
<script>
  const el = portalEl();
  const target = input.target ? document.getElementById(input.target) : document.body;
  target.appendChild(el);
  $signal.onabort = () => el.remove();
</script>
```

Now open the dialog. It's declared *inside* the clipped card, yet it appears
over the whole page — because `appendChild` relocated its DOM to
`document.body`, outside the card's `overflow: hidden`. Marko still owns the
content: the Close button keeps working, because moving a node with
`appendChild` doesn't change the node, only where it lives. And
`$signal.onabort` removes it the moment the portal unmounts (here, when the
dialog closes), so nothing is left orphaned in the body.

:::info
Because the move happens in a `<script>` — a client effect — a portal that's
always present would first render *in place* on the server, then jump to the
body on hydration. That's why portals pair naturally with a trigger: gate the
portal behind an `<if>` (as this dialog is), so it only ever renders in the
browser, right where you moved it.
:::

:::tip
Any node works as `input.target` — pass an element id to portal into a
specific container instead of the body. This is the whole trick behind tooltip
and dropdown libraries: written near your component, living somewhere unclipped
in the DOM.
:::

That's a portal: render content in one place, relocate its DOM to another, and
clean up after itself — an escape hatch from CSS clipping, built from a node
handle, `appendChild`, and `$signal`.
