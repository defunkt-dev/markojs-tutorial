---
type: lesson
mainCommand: ['pnpm run dev --lesson-2-3-5', 'Starting dev server']
title: Why Marko Is Fast
focus: /src/routes/+page.marko
editor:
  fileTree:
    allowEdits: ['/src/**']
---

# Why Marko Is Fast

You've now seen the machine from the inside — effects, the reactivity
graph, two programs from one template, resumability. This lesson steps
back and names *why* those pieces add up to a fast framework. There's
no exercise; read the page's source on the right as you go — it's a
mostly-static page with a single interactive control, and it ships
almost no JavaScript. That's the whole thesis in miniature.

## Targeted compilation

The compiler emits **two** programs from your one template — one for
the server, one for the browser (you saw this in *Two Programs from One
Template*). The server build renders **straight to an HTML stream in a
single pass**: no virtual DOM, no intermediate tree, just string
concatenation. Frameworks built on a virtual DOM must first build a
tree in memory and then serialize it — two passes. Marko does one.

## JS scales from zero

Because reactivity is resolved at compile time, the client build
doesn't ship a DOM representation or a diffing runtime. It ships only
what actually changes: **stateful values, event handlers and `<script>`
effects, and a tree-shaken core runtime**. Static content compiles to
**zero client JavaScript — even when it sits in the same template as
interactive content.** A page that's 95% static ships the JS for the
5% that isn't. (The next lesson digs into how fine-grained that
splitting really is.)

## First-class HTML streaming

Because the server renders in a single streaming pass, sending HTML
**as it's produced** is natural, not bolted on. `<await>` holds the
stream at a slow section and flushes the rest immediately; the browser
paints as chunks arrive. Marko has streamed HTML since 2013 — years
ahead of most of the ecosystem. Part 11 is devoted to it.

## Compile-time reactivity

Other frameworks discover what to update at **runtime** (re-run a
component, diff the result). Marko works it out at **compile time** —
the graph you met two lessons ago — so the browser does the minimum:
touch exactly the nodes a changed signal feeds, nothing more.

Put together: small bundles, single-pass server renders, streaming by
default, and surgical client updates. Not one trick — an architecture
where the compiler carries the weight so your code, and your users'
browsers, don't. For the deeper write-ups, see the docs'
[*Why Is Marko Fast*](https://markojs.com/docs/explanation/why-is-marko-fast) and
[*Targeted Compilation*](https://markojs.com/docs/explanation/targeted-compilation)
explanations.
