---
type: lesson
title: Effects & Cleanup
focus: /src/routes/+page.marko
---

# Effects & Cleanup

Sometimes you must step outside the template — set a timer, talk to a
browser API, touch something Marko doesn't render. That's the
`<script>` tag: its content runs in the browser once the component
mounts, and runs **again whenever any tag variable it references
changes**. An effect, in the language itself:

```marko
<let/title="Home">
<script>
  document.title = title;
</script>
```

Every effect that *starts* something must be able to *stop* it — or
timers pile up and listeners leak on every re-run. Marko's answer is
`$signal`: an
[AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
available in template code, aborted when the expression re-runs or the
component unmounts. Two ways to use it:

```marko
<script>
  // APIs that accept a signal clean themselves up
  document.addEventListener("scroll", onScroll, { signal: $signal });

  // everything else: register the undo
  const id = setInterval(tick, 1000);
  $signal.onabort = () => clearInterval(id);
</script>
```

The stopwatch on the right displays `elapsed` but nothing drives it:

1. Add a `<script>` that starts the engine:
   `const id = setInterval(() => { elapsed++ }, 1000);`
2. Register its cleanup: `$signal.onabort = () => clearInterval(id);`
3. Watch it tick. Then note what you did *not* write: no mount hook,
   no dependency array, no teardown callback signature — start plus
   undo, and the compiler knows when.

(For the rare setup/teardown case that isn't tied to reactive values,
there's also a `<lifecycle>` tag — worth knowing exists, rarely
reached for.) Honest closing note: reach for `<script>` last. Most
things it's tempted for — deriving values, syncing inputs — you've
already learned better tools for.
