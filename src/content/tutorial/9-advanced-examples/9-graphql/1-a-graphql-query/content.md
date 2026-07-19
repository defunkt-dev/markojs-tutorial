---
type: lesson
template: marko-urql
title: A GraphQL Query
focus: /src/index.marko
---

# A GraphQL Query

[GraphQL](https://graphql.org) lets a page ask a server for exactly the data it
needs in a single request. **[@marko/urql](https://github.com/marko-js/urql)**
wraps the URQL GraphQL client as Marko tags — `<gql-client>` to point at an
endpoint, and `<gql-query>` to run a query and render the result.

One thing up front: `@marko/urql` is a **Marko 5** library, written in the Class
API, so this lesson runs on a Marko 5 server (`@marko/express`) and the syntax
looks a little different from the rest of the tutorial — `static const`, `gql`
tagged templates, `<@then>` attribute tags. The GraphQL ideas carry straight
over.

:::tip
If a change doesn't show up in the preview after you edit a file or press
**Solve**, reload the preview.
:::

Everything around your page is already wired: an Express server with a
`/graphql` endpoint whose resolvers read from a real **SQLite** database of
books. The client is pointed at it for you:

```marko
<gql-client url=input.graphqlUrl/>
```

## Query the books (your job)

In `src/index.marko`, first define the query — a `static const` so it's built
once, not on every render:

```marko
import { gql } from "@marko/urql";

static const BOOKS = gql`
  query {
    books {
      title
      author
    }
  }
`;
```

Then, below `<gql-client>`, run it with `<gql-query>`. The `<@then>` block
receives the result (`{ data, fetching }`); `<@placeholder>` shows while the
request is in flight:

```marko
<gql-query query=BOOKS>
  <@then|{ data }|>
    <ul>
      <for|book| of=data.books>
        <li>${book.title} — ${book.author}</li>
      </for>
    </ul>
  </@then>
  <@placeholder>
    <p>Loading books…</p>
  </@placeholder>
</gql-query>
```

Save, and the list fills with books — asked for over GraphQL, resolved from
SQLite, rendered on the server.

:::info
This query runs during **server rendering**: Marko makes the GraphQL request,
waits for it, and streams the finished HTML — so the books are in the page from
the first byte, with no client-side spinner for the initial view. If the query
sat inside a stateful component, `@marko/urql` would also serialize the result
so the browser could reuse it without re-fetching.
:::

:::tip
`<gql-query>` takes `variables` too — `variables={ id: input.id }` — for
parameterized queries like fetching one book. The same client pairs with
`<gql-mutation>` when you need to write data back.
:::

That's a GraphQL-backed page: one `<gql-client>`, one `<gql-query>`, and your
data — from a SQLite-backed GraphQL API — rendered server-side.
