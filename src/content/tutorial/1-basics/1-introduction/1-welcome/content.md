---
type: lesson
title: Welcome to Marko
template: marko-run
focus: /src/routes/+page.marko
previews: [3000]
mainCommand: ['pnpm run dev', 'Starting dev server']
prepareCommands:
  - ['pnpm install', 'Installing dependencies']
terminal:
  panels: ['output']
---

# Welcome to Marko 6

Edit the page on the right. Here is the counter pattern:

```marko
<let/count=0>
<button onClick() { count++ }>
  Count: ${count}
</button>
```
