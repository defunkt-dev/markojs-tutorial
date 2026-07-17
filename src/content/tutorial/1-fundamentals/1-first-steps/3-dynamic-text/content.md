---
type: lesson
title: Dynamic Text
focus: /src/routes/+page.marko
---

# Dynamic Text

Static text is a good start, but pages usually show *data*. In Marko,
tag content works like a JavaScript
[template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):
wrap any expression in `${...}` and its value is rendered as text.

```marko
<p>Today is ${new Date().toDateString()}</p>
<p>Random number: ${Math.floor(Math.random() * 100)}</p>
```

Any JavaScript expression works — variables, function calls, math,
ternaries. And the value is automatically escaped, so interpolating
untrusted data can't inject markup into your page (more on that in the
next lesson).

The page on the right greets a hardcoded "someone" and claims the year
is 1999. Fix both using interpolation:

1. Replace `someone` with `${name}` — the `name` variable is already
   defined at the top of the file with the `static` statement, which
   runs plain JavaScript when the template loads.
2. Replace `1999` with `${new Date().getFullYear()}`.

The preview should greet Marko and tell the truth about the year.
