---
type: lesson
title: How Components Talk
focus: /src/tags/rating-widget.marko
---

# How Components Talk

You've built a lot of components by now — time to name the
architecture. Marko has exactly two communication channels:

**Down: attributes.** Everything a parent gives a child rides on
`input` — data, config, and (because attributes are JavaScript)
functions.

**Up: calling what came down.** A child talks back by *calling a
function the parent handed it.* The whole controllable pattern from
part two is this channel — `valueChange` is just a function attribute
with a naming convention. But it's not limited to values changing:

```marko
/* the parent */
<rating-widget onRate(stars) { lastRating = stars }/>

/* the child */
<button onClick() { input.onRate(3) }>★★★</button>
```

If you're arriving from Marko 5 (or Vue): this replaces
`this.emit("rate", 3)`. The docs are explicit that emit is gone in 6 —
handlers are passed and called directly, which also makes them
spreadable and refactorable like any function. No event names, no
emitter.

And that's the complete map — there's no context API and no event bus;
two channels, both explicit. (Well — a third mechanism arrives next
lesson, and it's still just these two wearing a new syntax.)

The feedback card on the right renders `rating-widget`'s three buttons,
but the widget swallows the clicks:

1. In `rating-widget.marko`, give each button
   `onClick() { input.onRate(n) }` with its star count.
2. The page already passes `onRate` and shows `lastRating` — click
   stars, watch the parent learn.
