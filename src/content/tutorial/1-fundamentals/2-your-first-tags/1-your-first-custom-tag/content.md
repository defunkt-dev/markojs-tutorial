---
type: lesson
title: Your First Custom Tag
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/tags/**']
---

# Your First Custom Tag

Every `.marko` file is a component — a **custom tag** you can use like
any HTML element. And here's the part that surprises people coming from
other frameworks: there's nothing to import. Marko discovers tags by
where the file lives. From any template, it looks in the nearest `tags/`
folder (searching upward through parent directories) and matches the
file name to the tag name.

Time to make one, from scratch:

1. In the file tree, create a folder `tags` inside `src`, and inside it
   a file named `greeting.marko`. (Right-click / use the tree's new-file
   button — this lesson lets you add files under `src/tags`.)
2. Give it this content:

```marko
<p>👋 Welcome aboard!</p>
```

3. Now use your new tag in the page — three times, because reuse is the
   point:

```marko
<greeting/>
<greeting/>
<greeting/>
```

Three welcomes, one file, zero imports. The file name **is** the API:
`tags/greeting.marko` becomes `<greeting>`. Rename the file and the tag
name follows.

Right now every greeting is identical. A component that can't take data
is a rubber stamp — next lesson fixes that.
