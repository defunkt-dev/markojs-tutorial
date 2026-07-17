---
type: lesson
title: Attribute Tags
focus: /src/tags/page-card.marko
---

# Attribute Tags

Part three's closer promised this: the `@` syntax, generalized. Your
own tags can declare **named content slots**, and callers fill them
with attribute tags:

```marko
<page-card title="Welcome">
  <@header class="fancy">
    <h2>Big things are coming!</h2>
  </@header>

  <p>The regular body goes here.</p>
</page-card>
```

An `@`-tag isn't rendered where it's written — it's *packaged into
input*. The card receives `input.header` — an object with the
attribute tag's attributes (`input.header.class`) and its markup
(`input.header.content`). The unnamed body is still `input.content`,
same as part one. Rendering a slot uses the dynamic-tag idiom you
already know:

```marko
<header class=input.header.class>
  <${input.header.content}/>
</header>

<${input.content}/>
```

And slots are optional by nature — guard with the conditional parent
trick or an `<if>` when a slot may be absent.

`page-card.marko` on the right renders only its body; the page is
already *sending* `@header` and `@footer` that vanish into the void:

1. Render the header: inside the card's `<header>`, use
   `<${input.header.content}/>` (the `<if=input.header>` guard is
   provided).
2. Same for the footer slot in its `<footer>`.
3. Preview: title bar, body, footer — three channels of markup, one
   tag call. `@placeholder` and `@catch` on `<try>` were never special
   syntax; `<try>` just declares two slots.
