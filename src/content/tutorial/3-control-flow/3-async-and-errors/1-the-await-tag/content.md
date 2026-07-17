---
type: lesson
title: The await Tag
focus: /src/routes/+page.marko
---

# The await Tag

Data is often a promise. The `<await>` tag unwraps one, handing the
resolved value to its content through a tag parameter — the pipes
again:

```marko
<await|user|=getUser()>
  <img src=user.avatar>
  ${user.name}
</await>
```

Where does the waiting happen? Here's the part that makes Marko
special: during server rendering, the HTML **streams in document
order** — everything before the `<await>` is sent immediately, then
the stream *holds at that spot* until the promise resolves, then
continues. That's **in-order streaming**: the top of your page reaches
the browser and renders while the server is still waiting on data
further down. No spinner, no blank page — just a page that finishes
top-to-bottom.

The dashboard on the right fakes a slow report (a delayed promise —
real fetching arrives with marko-run in part five). Right now the page
pretends the data is already there and crashes trying to read it:

1. Wrap the report markup in `<await|report|=loadReport()>` …
   `</await>` and change the interpolations to use `report`.
2. Reload the preview (the refresh icon on its toolbar) and watch the
   load: the heading paints instantly, the report section arrives a
   beat later, already-rendered. That pause *in place* is in-order
   streaming — you're watching the stream hold.

Next lesson: choosing not to hold.
