---
type: lesson
title: The define Tag
focus: /src/routes/+page.marko
---

# The define Tag

Sometimes a snippet repeats *within one template* — too local for its
own file, too repetitive to paste. `<define>` creates a reusable
chunk right where you need it, exposed through a tag variable:

```marko
<define/PriceTag|input|>
  <span class="price">$${input.amount}</span>
</define>

<PriceTag amount=9/>
<PriceTag amount=29/>
```

Anatomy: the slash-name is how you'll call it (PascalCase — next
lesson explains why that casing matters); the pipes receive the
attributes each call passes, exactly the parameters mechanism from
last lesson. And a neat aside from the docs: `<define>` is conceptually
just a tag that returns its input — the whole feature reduces to
machinery you already know.

Plain attributes on the define ride along on its variable too
(`<define/MyTag foo=1>` → `MyTag.foo`) — handy for bundling constants
with their markup.

The pricing page on the right pastes the same plan-card markup three
times, drifting apart already (one forgot its period):

1. Above the cards, define it once:
   `<define/PlanCard|input|>` wrapping one copy of the card markup,
   using `${input.name}`, `${input.price}`, `${input.blurb}`.
2. Replace the three pasted blocks with
   `<PlanCard name="Hobby" price=9 blurb="For side projects."/>` and
   friends.
3. One source of truth, three renders, and the drift bug fixed by
   construction.
