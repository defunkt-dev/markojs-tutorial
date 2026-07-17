---
type: lesson
title: Using Tailwind
focus: /src/routes/+page.marko
template: marko-tailwind
---

# Using Tailwind

Prefer utility classes to writing CSS? Marko and
[Tailwind](https://tailwindcss.com) get along with almost no ceremony,
because Tailwind reads class attributes from your source files — and
`.marko` files are exactly the kind of source it scans.

The wiring (already done in this lesson's project, and worth knowing):
Tailwind v4's vite plugin added in `vite.config.ts` next to Marko's,
and one CSS entry containing `@import "tailwindcss";` imported by the
page. That's the whole integration.

Heads up: this lesson runs a *different* project than the previous ones
(watch the boot screen do a fresh install) — Tailwind ships a global
reset that would restyle every other lesson, so it lives in its own
template.

The page on the right is the unstyled counter. Dress it, utilities
only:

1. The `<body>`: `class="p-8 font-sans"`.
2. The heading: `class="text-3xl font-bold text-teal-700"`.
3. The button:
   `class="mt-4 rounded bg-teal-600 px-4 py-2 text-white"` — and since
   class is still just an attribute, dynamic values compose the usual
   way; try `class=["mt-4 rounded px-4 py-2 text-white", count > 4 ? "bg-rose-600" : "bg-teal-600"]`
   to make it change color after five clicks.

One honest note on trade-offs: everything else in this chapter — style
blocks, LESS, modules, dynamic values — is Marko-native and needs zero
dependencies. Tailwind buys you its design system at the cost of a
build-time dependency. Both are first-class choices; now you've used
both.
