---
type: lesson
title: Attributes are JavaScript
focus: /src/routes/+page.marko
---

# Attributes are JavaScript

In HTML, attribute values are strings. In Marko, attribute values are
**JavaScript expressions**. Even `href="/about"` is a JS string literal,
not an HTML attribute string — which means everything else JavaScript
can express works there too:

```marko
<a href=`/user/${user.id}`>My Profile</a>
<a href=getRandomPage()>Discover Something New</a>
<my-tag num=1 + 1 date=new Date()/>
```

No quotes needed around expressions. One caveat: an expression
containing a bare `>` is ambiguous with the end of the tag, so wrap
those in parentheses: `value=(1 > 2)`.

Booleans behave the way you'd hope. HTML boolean attributes accept real
booleans — `<input checked=isDone>` — and when a value is `null`,
`undefined`, or `false`, Marko simply omits the attribute from the
output. (Other falsy values like `0` and `""` are still written.)

The page on the right lists a product. Make it honest:

1. The link's `href` is hardcoded to `/products/0` — build it from the
   product's id with a template literal: `` href=`/products/${product.id}` ``.
2. The price paragraph should multiply instead of guessing: replace
   `59` with `${product.price * quantity}`.
3. The buy button should be disabled when out of stock — give it
   `disabled=!product.inStock` and watch the attribute appear and
   disappear as you flip `inStock` at the top of the file.
