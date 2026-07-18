---
type: lesson
template: marko-compiler
title: Two Programs from One Template
focus: /src/tags/price-tag/index.marko
---

# Two Programs from One Template

The last lesson showed you the graph Marko builds at compile time. This one
shows you the code it writes — because your `.marko` file doesn't become
*one* program. It becomes two, and they look nothing alike.

`price-tag/index.marko` is eleven lines. There's a script in the project,
`compile.mjs`, that hands it to Marko's compiler — the same compiler your
dev server is using right now — and prints the result. It takes one
argument: which platform to compile for.

1. Run `node compile.mjs html` in the terminal. That's what the **server**
   runs.
2. Run `node compile.mjs dom`. That's what the **browser** runs.

**Read the first one.** It's a function that builds a string. `_html(...)`
with your markup baked in, `_escape(input.label)` where a value goes, and
some `_el_resume` markers. No DOM, no elements, no reactivity — a server
rendering a page has no future to prepare for, so it doesn't build one. It
concatenates and streams.

**Now read the second.** The first line is your entire button as one static
string:

```js
export const $template = "<button><!> — <!> in cart</button>";
```

The `<!>` are markers — the spots that can change. The browser clones that
string once, which is about the fastest thing a browser can do. Then:

```js
export const $walks = /* get, next(1), replace, over(2), replace, out(1) */" D%c%l";
```

That's directions. The compiler worked out, at build time, how to walk from
the top of the button to each changing spot, and shipped the route. The
compiler leaves the human-readable version in the comment beside it. At
runtime nothing searches for anything, nothing diffs anything, nothing
re-renders a tree — it walks to spot two and writes.

**Now change the shape of it.** Add a conditional inside the button:

```marko
<if=count > 2>
  <strong>Bulk discount!</strong>
</if>
```

Run `node compile.mjs dom` again. `$template` grew a third `<!>`, `$walks`
became `" D%c%c%l"` — one more `replace`, one more `over` — and `_if`
appeared in the imports. You changed the markup; the compiler recomputed
the route.

:::info
This is **targeted compilation**, and it's why the same file can be good at
two jobs that want opposite things. Server code should build strings fast
and forget. Browser code should ship as little as possible and know exactly
where to write. A framework that ships one program to both has to
compromise; Marko compiles twice and compromises neither.
:::

:::tip
It also explains something you saw in part one. Static pages in this
tutorial shipped ~zero JavaScript — not because Marko is small, but because
a tag with nothing dynamic has no changing spots, so there's no walk to
ship and no runtime to ship it to. **Fine-grained bundling** is the same
compiler asking, per tag, whether the browser needs anything at all.
:::

You should have seen `$walks` change under your own edit. That's the whole
trick: the framework does the searching at build time, so your users' phones
don't have to.
