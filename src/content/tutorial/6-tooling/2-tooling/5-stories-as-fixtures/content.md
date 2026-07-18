---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-2-5', 'Starting dev server']
title: Stories as Fixtures
focus: /src/tags/counter-widget/stories.test.ts
---

# Stories as Fixtures

Last lesson you wrote down your tag's states as stories. This lesson your
tests read them instead of inventing their own — one description, two
audiences: your eyes in Storybook, your CI in vitest.

The test file imports `StartAtTen` straight from the stories file and
renders it. It fails, and the error is the lesson:
`template.mount is not a function`.

**A story is data, not a tag.** `export const StartAtTen = { args: { start:
10 } }` is a plain object. It describes what to render; it isn't something
you can render. `composeStories` is the function that turns the description
back into the thing — it takes the whole module, applies each story's args
to the component from the default export, and hands you back real
renderable tags.

1. Run `pnpm test`. Read the failure.
2. Import `composeStories` from `@storybook/marko` and the stories as a
   namespace, then compose them:

   ```ts
   import * as stories from "./counter.stories";
   const { Default, StartAtTen } = composeStories(stories);
   ```
3. Render `StartAtTen` instead of the raw import. Run `pnpm test` again.

The solution adds two more tests worth reading: a no-args story renders its
default, and passing input at render time still wins over the story's own
args — they merge, with yours on top. So a story is a starting point, not a
straitjacket.

:::info
No Storybook server runs here. `composeStories` is a plain import — this is
the marko-testing project, with vitest, and Storybook is present only as a
library. The stories file is shared between the two lessons the way it
would be shared across a real codebase.
:::

You should now see `3 passed`. The loop is closed: the states you look at
and the states you test are the same file, so they can't drift apart.
