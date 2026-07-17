---
type: lesson
title: Coming from Marko 5
focus: /src/routes/+page.marko
---

# Coming from Marko 5

If Marko 5 was your home, here's the moving guide — every familiar
tool and where it went. (New to Marko entirely? This lesson is a free
review in disguise.)

**`out`** → gone as an object. Its one survivor is `out.global`, now
spelled `$global` — render globals, which part five covers properly.

**`this.emit("save", data)`** → pass a function:
`<child onSave=...>`, child calls `input.onSave(data)`. Handlers are
plain values now — spreadable, refactorable, no event names.

**Component instances & refs** (`this.getComponent(...)`) → there are
no instances. Children expose values with `<return>`; elements expose
themselves via tag variables.

**Scriptlets** (`$ const x = ...;`) → module-level work is `static`
(or `server`/`client`); reactive inline logic is `<const>`/`<let>`.

**`<html-text>`** → plain `${...}` in content (and remember: at the
start of a top-level line, wrap text in an element).

**`<include-text>` / `<include-html>`** → `${value}` and `$!{value}`.
Template inclusion generally → custom tags, or a dynamic tag with an
imported reference.

**`marko-tag.json` attribute definitions** (`"attributes": { "label":
"string", ... }` with required/type validation) → a TypeScript `Input`
interface, checked by `mtc`. Marko 6 builds ignore the old validation
config entirely — the type *is* the attribute contract now (the
tooling part covers this).

**Class API TypeScript types** (`Marko.Component`, `Marko.Out`,
`Marko.Emitter`) → removed from Marko 6's types; they remain
available only through the `marko@5` package when running both
versions side by side.

**Lifecycle methods** (`onCreate`, `onMount`, …) → mostly unnecessary;
`<script>` + `$signal` for effects, `<lifecycle>` for imperative
objects.

The page on the right is a half-converted Marko 5 component — two
spots still speak the old dialect, marked with comments:

1. The save button's TODO describes `this.emit("save")` — implement it
   the 6 way: the page already receives an `onSave` function attribute;
   call `input.onSave(title)` in the click handler.
2. The bio TODO describes `<include-html data.bioHtml>` — render
   `input.bioHtml` with the unescaped interpolation (it's authored
   markup, the legitimate case).

Welcome to 6 — smaller vocabulary, same reach.
