---
type: lesson
template: marko-urql-mutation
title: A GraphQL Mutation
focus: /src/index.marko
---

# A GraphQL Mutation

A query reads; a **mutation** writes. `@marko/urql`'s `<gql-mutation>` runs a
GraphQL mutation and hands you a `mutate` function to fire it — usually from a
button or form — plus a `results` object to show what came back.

:::tip
This lesson's preview doesn't refresh on its own — after you edit a file or
press **Solve**, **reload the preview** to see the change.
:::

The books list is already here (the `<gql-query>` from the last lesson), and the
server now has an `addBook` mutation wired to the same SQLite database. Your job
is to add a button that writes a new book.

## The mutation (your job)

First, define the mutation — like a query, but with the `mutation` keyword and
typed variables:

```marko
static const ADD_BOOK = gql`
  mutation($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      title
    }
  }
`;
```

`<gql-mutation>` is shaped differently from `<gql-query>`: its body parameters
are `|mutate, results|`, and it renders right away (no `<@then>`). You call
`mutate(variables)` to fire the write — here, from a button:

```marko
class {
  addBook(mutate) {
    mutate({ title: "Domain-Driven Design", author: "Eric Evans" });
  }
}

<gql-mutation|mutate, results| mutation=ADD_BOOK>
  <button on-click("addBook", mutate)>Add a book</button>
  <if(results.data)>
    <p>Added "${results.data.addBook.title}" — reload the preview to see it in
      the list above.</p>
  </if>
</gql-mutation>
```

Click the button and the mutation runs; `results.data` fills in with what the
server returned. Because the write lands in the SQLite database — which lives in
the server, not the page — the new book is really persisted: reload the preview
and it appears in the list, served fresh from GraphQL.

:::info
`results` also carries `results.fetching` (true while the request is in flight)
and `results.error`. In a real app you'd often re-run the query automatically
after a mutation using URQL's cache; here we keep it simple and reload.
:::

That's the write half of GraphQL: `<gql-mutation>`, a `mutate` call, and your
data persisted through the same client.
