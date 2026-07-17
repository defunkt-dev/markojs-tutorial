---
type: lesson
title: show — The Other Conditional
focus: /src/routes/+page.marko
---

# show — The Other Conditional

`<if>` has a sibling with a crucial difference. `<show>` also takes a
truthy value, but its content is **always rendered and stays mounted**
— the value only controls whether the nodes are in the document:

```marko
<show=showFilters>
  <input type="search" placeholder="Brand">
</show>
```

Why does that matter? Because everything *inside* survives the toggle:
state, form values, the DOM nodes themselves. An `<if>` tears its
content down when false and rebuilds it fresh when true — anything the
user typed is gone.

Feel the difference on the right. The filter panel is wrapped in
`<if=open>`:

1. Open the panel, type a brand name into the search box, close it,
   reopen. Empty — `<if>` rebuilt it from scratch.
2. Change the `<if=open>` / `</if>` pair to `<show=open>` /
   `</show>`.
3. Same dance: type, close, reopen. Your text is still there.

Choosing between them is a real design decision: `<if>` for content
that should reset (and for skipping expensive work entirely when
hidden); `<show>` for content whose state should survive hiding —
panels, wizards, tabs. If's teardown is a feature exactly as often as
show's persistence is.
