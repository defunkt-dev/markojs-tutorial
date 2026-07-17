---
type: lesson
title: Shorthands & Spread
focus: /src/routes/+page.marko
---

# Shorthands & Spread

Because attributes are JavaScript, Marko can offer some pleasant
shortcuts.

## class and id shorthands

[Emmet-style](https://docs.emmet.io/abbreviations/syntax/#id-and-class)
shorthands put `id` and `class` right in the tag name:

```marko
<div#foo.bar.baz/>

// same as
<div id="foo" class="bar baz"/>
```

Interpolation works inside them too: `<div.icon-${iconName}/>`.

## class accepts objects and arrays

Toggling classes with string concatenation gets old fast. `class=` also
takes objects (keys with truthy values are included) and arrays:

```marko
<div class={ active: isActive, admin: user.isAdmin }/>
<div class=["card", null, { featured: isFeatured }]/>
```

## Spread attributes

An object can be spread onto a tag, just like in JavaScript:

```marko
<img ...imgAttrs alt="Override"/>
```

Attributes merge left to right, so later ones win conflicts.

Your turn, on the page to the right:

1. The banner `<div id="banner" class="panel wide">` — rewrite it with
   the shorthand: `<div#banner.panel.wide>`.
2. The status paragraph builds its class with a ternary — replace the
   whole `class=` value with an object: `class={ status: true, ok: isOnline }`.
3. The image repeats `src`, `width`, and `height` that already exist in
   the `imgAttrs` object at the top — replace those three attributes
   with `...imgAttrs`.
