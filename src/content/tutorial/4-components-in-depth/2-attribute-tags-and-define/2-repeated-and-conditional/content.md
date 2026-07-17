---
type: lesson
title: Repeated & Conditional Slots
focus: /src/tags/tab-bar.marko
---

# Repeated & Conditional Slots

A slot name can be used **more than once** — and the receiving side
sees them all through the iterable protocol:

```marko
<tab-bar>
  <@tab label="Home"/>
  <@tab label="Billing"/>
  <@tab label="Settings"/>
</tab-bar>
```

Inside `tab-bar`, `input.tab` is one object (the first), but it's
*iterable* — a `<for of=>` walks every instance:

```marko
<for|tab| of=input.tab>
  <button>${tab.label}</button>
</for>
```

The docs' convention: keep the name singular (`@tab`, iterate
`input.tab`) — repetition is in the protocol, not the name.

Slots can also be **conditional or generated**. `<if>` and `<for>`
inside a tag call don't render there — they dynamically *produce*
attribute tags:

```marko
<tab-bar>
  <for|section| of=sections>
    <@tab label=section.name/>
  </for>
  <if=isAdmin>
    <@tab label="Admin"/>
  </if>
</tab-bar>
```

The page on the right calls `tab-bar` with three static `@tab`s plus a
conditional Admin tab — but `tab-bar.marko` renders a hardcoded pair:

1. Replace the two hardcoded buttons with a
   `<for|tab, i| of=input.tab>` rendering one button each — keep the
   `class={ active: i === active }` and the `onClick` selecting `i`.
2. Toggle the page's `isAdmin` let via its checkbox — the Admin tab
   pops in and out of the *slot list*, and your loop just renders what
   arrives.
