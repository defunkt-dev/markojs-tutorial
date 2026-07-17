---
type: lesson
title: Module-Level Code
focus: /src/shared/format.marko
---

# Module-Level Code

A `.marko` file is a real JavaScript module wearing a template. Five
statements run at module level — once, outside the reactive graph:

**`import`** — you've used it since immer. **`static`** — arbitrary
module code, run when the template loads (your constant companion
since part one). And the one that surprises people: **`export`** — a
template can export values, and other modules can import *from a
.marko file*:

```marko
/* format.marko */
export function money(n) {
  return `$${n.toFixed(2)}`;
}
```

```marko
/* elsewhere */
import { money } from "../shared/format.marko"
```

A template with exports is still a component too — the default export
is the tag; named exports ride along.

Finally, environment-split statements: **`server`** and **`client`**
run their code only on that side —

```marko
server console.log("rendering on the server");
client console.log("hydrated in the browser");
```

— including whole blocks and even platform-only imports. Watch both in
the preview: the server line appears in the *terminal pane*, the
client line in your browser console. (These become important
characters in part five.)

The receipt page duplicates a currency-formatting function it should
share with `price-line.marko`:

1. In `src/shared/format.marko`, mark the function `export`.
2. In the page *and* in `price-line.marko`, delete the local copies
   and `import { money } from "../shared/format.marko"` (adjust the
   path from tags/: `"../shared/format.marko"` works for both here).
3. One formatter, exported from a template, imported by two.
