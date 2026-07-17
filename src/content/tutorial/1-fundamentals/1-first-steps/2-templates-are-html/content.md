---
type: lesson
title: Templates are HTML
focus: /src/routes/+page.marko
---

# Templates are HTML

Here's the most important thing about Marko: **nearly any valid HTML is
already valid Marko.** There's no wrapper function, no render method, no
required boilerplate. The file on the right is plain HTML — and it's also
a complete, working Marko template.

```marko
<h1>My Blog</h1>
<nav>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

That's the whole mental model to start with: begin with regular HTML and
add features only as you need them. Everything you learn in this
tutorial is an *addition* to HTML, never a replacement for it.

Your turn. The page on the right is a small blog. Add a `<footer>` at
the bottom of the `<body>`:

```marko
<footer>
  <p>Made with Marko</p>
</footer>
```

Ordinary HTML in, ordinary HTML out — but as you'll see next, this file
can do much more than static markup.
