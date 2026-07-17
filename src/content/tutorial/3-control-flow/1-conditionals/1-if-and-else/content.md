---
type: lesson
title: if & else
focus: /src/routes/+page.marko
---

# if & else

Conditional rendering in Marko is a tag, not a template syntax:

```marko
<if=user.isLoggedIn>
  <p>Welcome back!</p>
</if>
<else if=user.isPending>
  <p>Check your email.</p>
</else>
<else>
  <p>Sign in to continue.</p>
</else>
```

An `<if>` renders its content when its value is truthy; `<else>` chains
follow it, with `if=` on the else for else-if. Conditions in a chain
are evaluated in order, first truthy wins.

And now's the moment to formally name something you've been using all
along: that `<if=expression>` — an attribute with no name — is the
**value shorthand**. Any tag can take it: `<if=cond>` means
`<if value=cond>`, exactly like `<log=msg>` in part two and
`<my-tag=42>` from the passing-data lesson. Core tags lean on it
constantly; from here on you'll read it without noticing.

The quiz result page on the right always congratulates, no matter the
score. Make it honest:

1. Wrap the congratulations in `<if=(score >= 80)>` — the
   parentheses are part one's rule about `>` inside attribute values,
   applying exactly as taught.
2. Add `<else if=(score >= 50)>` with the "Not bad — review and retry"
   paragraph.
3. Add a final `<else>` with "Let's go through it again together."
4. Change `score` at the top and watch each branch take its turn.
