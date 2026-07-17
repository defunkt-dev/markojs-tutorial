---
type: lesson
title: Unescaped Text
focus: /src/routes/+page.marko
---

# Unescaped Text

The previous lesson mentioned that `${...}` escapes its value. See it
in action on the right: the page interpolates a string containing HTML,
and the preview shows the *tags themselves* as literal text —
`<em>` and all. Escaping turns markup into harmless text.

Sometimes, though, you have markup that's *supposed* to be markup —
HTML you generated and sanitized yourself, like compiled markdown for a
blog post. For that, Marko has the unescaped interpolation: add a `!`.

```marko
<article>
  $!{articleHtml}
</article>
```

Change `${snippet}` to `$!{snippet}` in the page. The `<em>` now renders
as actual emphasis.

## A warning you should take seriously

Unescaped values are written into the document exactly as-is. If the
string came from a user — a comment, a username, a URL parameter — you
have just handed them the ability to inject scripts into your page
([XSS](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS)).

The rule: `$!{...}` is only for markup **you** produced or sanitized.
When in doubt, use `${...}` — the default is the safe one.
