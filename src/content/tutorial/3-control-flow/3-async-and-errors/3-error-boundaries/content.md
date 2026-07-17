---
type: lesson
title: Error Boundaries
focus: /src/routes/+page.marko
---

# Error Boundaries

`<try>` has a second attribute tag, and it's the reason for the name.
`@catch` replaces the content when a runtime error is thrown inside it
— during render, in an effect, or from a rejected `<await>` promise:

```marko
<try>
  <flaky-widget/>

  <@catch|err|>
    <p>Widget failed: ${err.message}</p>
  </@catch>
</try>
```

The error arrives as the `@catch`'s tag parameter. Without a boundary,
one broken component takes the whole page down; with one, the blast
radius is the boundary — everything outside keeps working.

The status page on the right embeds a `stock-ticker` tag that is
having a bad day (it reads a property of `undefined` — peek at
`src/tags/stock-ticker.marko`). The entire page is currently a crash
screen because of it:

1. Wrap `<stock-ticker/>` in a `<try>` with a
   `<@catch|err|>` showing "Ticker unavailable: ${err.message}".
2. The rest of the page — heading, uptime, the working weather tag —
   now renders fine around the contained failure.
3. Bonus thought: `@placeholder` and `@catch` compose on one `<try>` —
   pending shows the placeholder, rejection shows the catch. One
   boundary, both async states handled.

Where to put boundaries is architecture: around anything third-party,
anything network-fed, anything whose failure shouldn't be contagious.
