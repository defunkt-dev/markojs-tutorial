---
type: lesson
template: marko-storybook
mainCommand: ['pnpm run storybook', 'Starting Storybook']
title: Storybook for Marko
focus: /src/tags/counter-widget/counter.stories.ts
---

# Storybook for Marko

Tests tell you a tag is correct. They don't tell you what it *looks* like
at four, or at ten, or with a label you've never tried. Storybook is the
other half: a workbench that renders your tag in every state you name, on
its own, with nothing else on the page.

The preview on the right is Storybook, running your `counter-widget`.

**A story is a state with a name.** `counter.stories.ts` has a default
export describing what's being documented — the `title` you see in the
sidebar and the `component` itself — and then one named export per state.
`Default` passes nothing. `StartAtTen` passes `args: { start: 10 }`, and
`args` are simply the tag's `Input`. That's the whole format. It's called
CSF, Component Story Format, and it's the same shape across every
framework Storybook supports.

Notice the file types itself from the tag: `Meta<Input>` and
`Story<Input>`, with `Input` imported straight out of `index.marko`.
Wrong arg name, wrong type, and you'll know before you look.

1. Click through **Default** and **StartAtTen** in the sidebar. Same tag,
   two states, no page to click through to reach them.
2. Add a third story called `Renamed` that passes a `label` of `"Clicks"`:

   ```ts
   export const Renamed: Story<Input> = {
     args: { label: "Clicks" },
   };
   ```
3. Save. The sidebar grows a third entry, and it says *Clicks is 0*.

:::info
Stories stay interactive — click the button inside any story and it counts.
Storybook mounts the real tag with the real Marko runtime; it isn't a
screenshot. The Controls panel below the canvas is generated from the same
`args`, so you can poke at inputs without editing a file.
:::

You should now see three stories in the sidebar. Which raises a question
worth asking: you've just described your tag's states precisely, in code.
Why should your tests describe them a second time? Next lesson, they don't.
