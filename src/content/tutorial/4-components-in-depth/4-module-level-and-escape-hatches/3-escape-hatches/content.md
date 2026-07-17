---
type: lesson
title: Escape Hatches
focus: /src/routes/+page.marko
---

# Escape Hatches

Marko repurposed three pieces of HTML for itself — comments are
stripped from output, `<script>` became effects, `<style>` became the
stylesheet pipeline. Occasionally you need the *literal* HTML
behavior, and each has a designated fallback tag.

**`<html-comment>`** emits a real `<!-- comment -->` into the served
HTML (regular comments never reach the browser):

```marko
<html-comment>rendered by marko — hello, view-source reader</html-comment>
```

**`<html-script>`** emits a real script element. The docs are blunt
that you rarely want one — but the classic legitimate case is
structured data for search engines:

```marko
<html-script type="application/ld+json">
  {"@context": "https://schema.org", "@type": "Article", …}
</html-script>
```

**`<html-style>`** emits a literal inline `<style>` element, bypassing
the bundling/scoping pipeline — for the rare style that must live in
the document itself.

The article page on the right demonstrates both problems at once —
starting with the preview showing a **compile error**: the JSON-LD
block sits in a plain `<script>`, which Marko treats as *effect code*
and tries to compile as JavaScript. JSON isn't a program; the compiler
objects, with a line number.

1. Fix the error first: change the `<script type="application/ld+json">`
   to `<html-script type="application/ld+json">` — a literal script
   element, contents left alone.
2. Now the quieter problem: the SEO note near the top is a normal
   HTML comment, and Marko strips those from output — it never reaches
   view-source. Make it survive: change it to
   `<html-comment>…</html-comment>`.
3. Comment present in the served page, structured data embedded as
   data — never executed, never compiled.

Escape hatches by design read a little loud — `html-` prefixes flag
"literal output ahead" to every future reader.
