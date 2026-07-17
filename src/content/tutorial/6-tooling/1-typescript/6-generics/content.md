---
type: lesson
mainCommand: ['pnpm run dev --lesson-6-1-6', 'Starting dev server']
title: Generics
focus: /src/routes/+page.marko
---

# Generics

Type parameters on `Input` are recognized across the whole template:

```marko
/* my-select/index.marko */
export interface Input<T> {
  options: T[];
  onSelect: (newVal: T) => unknown;
}
```

Now `T` is *inferred at every call site*: pass `options=[1, 2, 3]`
and your `onSelect` handler's parameter is a `number`; pass
`options=["M", "K", "O"]` and it's a `string`. One tag, checked
per-use.

The page currently proves the point the painful way: the first
select passes numbers but its handler calls `v.toUpperCase()` —
a string method. `pnpm check` catches it (TS2339), because `T`
was inferred as `number`.

1. Fix the first handler to do number work:
   ``status = `double: ${v * 2}` ``.
2. `pnpm check` — clean. Note the second select needed no changes:
   same tag, `T` inferred as `string`, so *its* `toUpperCase()` is
   fine.
3. Inference can also be overridden — try
   `<my-select<number> options=[1, 2, 3] ...>` — the explicit type
   argument form. And attribute values can be asserted when needed:
   `names=[] as string[]`, `count=1 as const`.

Two more places type parameters appear, for your reference: tag
*parameters* can declare them (`<child <T>|value: T|>`), and so can
method shorthands (`<child process<T>() { ... } />`). One boundary:
`static` blocks run at module level, *outside* the component, so
`T` isn't available in them.

You should see both selects working and a status line updating from
whichever you change. Last stop in this chapter: types for your
routes.
