---
type: lesson
title: Tag Content
focus: /src/tags/alert.marko
---

# Tag Content

Attributes carry data. But sometimes you want to hand a component whole
**markup** — like the body of an alert box. Anything written between a
tag's opening and closing tags becomes `input.content`:

```marko
<alert>
  Your trial expires in <strong>3 days</strong>.
</alert>
```

Inside the component, render that content with this idiom:

```marko
<div class="alert">
  <${input.content}/>
</div>
```

That `<${...}/>` form is a *dynamic tag* — the next lesson explains it
properly. For now, read it as: "render whatever was passed here."

On the right, the page already wraps two messages in `<alert>` tags,
but `src/tags/alert.marko` ignores its content and prints a placeholder.
Fix it: replace the placeholder paragraph with `<${input.content}/>`.

Both alerts should now show their own markup — bold text and links
included, because content is real markup, not a string.

This combination — attributes for data, content for markup — is how
components compose in Marko. (Components can even accept *multiple
named* pieces of content via attribute tags; that's a later chapter.)
