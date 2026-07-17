---
type: lesson
title: Returning Values
focus: /src/tags/word-count.marko
---

# Returning Values

Native tags return their element; `<id>` returns a string. Your own
tags join in with the core `<return>` tag — whatever it's given
becomes the tag variable your parent reads:

```marko
/* word-count.marko */
<const/count=(input.text || "").trim().split(/\s+/).filter(Boolean).length>
<return=count>
```

```marko
/* the parent */
<word-count/words text=draft/>
<p>${words} words</p>
```

And because the returned value here is a `<const>` inside the child,
it's **live**: when `draft` changes, the child's count recomputes and
the parent's `${words}` follows. A tag variable isn't a snapshot — it's
a lens into the child's reactive graph. (Note `word-count` renders no
markup at all: tags can be pure logic with a returned result. `<id>`
was exactly this.)

The editor page on the right wants a live word count in its status bar,
but `word-count.marko` computes its count and keeps it secret:

1. Add `<return=count>` to `word-count.marko`.
2. In the page, capture it: `<word-count/words text=draft/>`.
3. Show it in the status bar: `${words} words`. Type in the textarea —
   the count tracks every keystroke, computed in the child, displayed
   by the parent.

One direction so far: child exposes, parent reads. Next lesson closes
the loop.
