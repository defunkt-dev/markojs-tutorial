---
type: lesson
template: marko-csr
title: The Mount Handle
focus: /src/main.js
---

# The Mount Handle

Last lesson you called `App.mount(input, node)` and threw the return value
away. But `.mount()` hands back an **instance handle** — the way to drive a
mounted app from the outside, which is exactly what you need when Marko is
one island in a page you don't otherwise control.

```js
const instance = App.mount({ name: "Ada" }, document.getElementById("app"));
```

The handle has three members:

- **`instance.update(input)`** — feed the template new `input`; it
  re-renders reactively, and synchronously.
- **`instance.destroy()`** — remove the app and run cleanup, aborting every
  `$signal` inside it.
- **`instance.value`** — read the value the template exposes through a
  `<return>` tag (and, if that return is assignable, write it too).

There's also an optional third argument to `mount` — `position` — saying
where to place the app relative to the node, using the same names as
`insertAdjacentHTML`: `"beforeend"` (the default) appends, `"afterbegin"`
prepends, and so on.

## Driving it from the page (your job)

The page has two buttons — **Rename** and **Remove** — that currently do
nothing. They live in `index.html`, *outside* the mounted app, so the only
way for them to reach it is through its handle. Open `src/main.js` and wire
them up:

```js
document.getElementById("rename").onclick = () => {
  instance.update({ name: "Grace" });
};

document.getElementById("remove").onclick = () => {
  instance.destroy();
};
```

Click **Rename** and the heading updates — `update` pushed new `input`
through the very same reactive machinery a parent would use. Click
**Remove** and the app is gone, its cleanup run. Two plain DOM buttons,
driving a Marko app that has no idea they exist.

:::info
This is the handle's real purpose: **embedding**. When Marko renders the
whole page you use props and events, not this handle — the docs are explicit
that `update`/`destroy` aren't the everyday way to change a template. But
when a Marko widget lives inside a larger non-Marko app (or in a test), the
handle is how the outside world talks to it.
:::

:::tip
If a template exposes an assignable value — `<return=x valueChange(v) { x = v }>` —
then `instance.value` is two-way: reading it gets the current value, and
`instance.value = …` pushes one in. It's the same idea as `update`, but for
a single returned value instead of the whole input object.
:::

That's the mount handle: `update` to feed it, `destroy` to end it, `value`
to read or set what it returns — the controls for a Marko app running as a
guest in someone else's page.
