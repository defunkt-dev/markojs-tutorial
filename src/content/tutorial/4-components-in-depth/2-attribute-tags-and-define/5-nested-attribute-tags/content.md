---
type: lesson
title: Nested Attribute Tags
focus: /src/tags/pricing-table.marko
---

# Nested Attribute Tags

Slots can contain slots. An attribute tag may hold its own attribute
tags, and the nesting mirrors straight into `input`:

```marko
<my-tag>
  <@a value=1>
    <@b value=2/>
  </@a>
</my-tag>
```

gives `my-tag` an input of `{ a: { value: 1, b: { value: 2 } } }` —
`@b` becomes a property *of* `@a`, not a sibling. Combine that with
repetition and you can describe genuinely structured content: a plan
containing its features, a section containing its links, a table row
containing its cells — each level just an iterable property of the one
above.

```marko
<pricing-table>
  <@plan name="Hobby" price=9>
    <@feature>Unlimited projects</@feature>
    <@feature>Community support</@feature>
  </@plan>
  <@plan name="Pro" price=29>
    <@feature>Everything in Hobby</@feature>
    <@feature>Priority support</@feature>
  </@plan>
</pricing-table>
```

Consuming nests the loops: `<for|plan| of=input.plan>` outside,
`<for|feature| of=plan.feature>` inside — repetition-by-iterable at
both depths, exactly the protocol from the repeated-slots lesson.

The page on the right already describes its plans in that nested
shape; `pricing-table.marko` renders the plans but ignores each plan's
features:

1. Inside the plan loop, where the TODO sits, add the inner loop:
   `<for|feature| of=plan.feature>` rendering
   `<li><${feature.content}/></li>`.
2. Two plans, two feature lists, one declarative call site — structure
   described where it's used, rendered where it's owned.
