require("@marko/compiler/register");
const express = require("express");
const markoExpress = require("@marko/express").default;
const { graphql, buildSchema } = require("graphql");
const initSqlJs = require("sql.js");

const seed = [
  ["The Pragmatic Programmer", "Hunt & Thomas"],
  ["Refactoring", "Martin Fowler"],
  ["Designing Data-Intensive Applications", "Martin Kleppmann"],
];

initSqlJs().then((SQL) => {
  const db = new SQL.Database();
  db.run(`CREATE TABLE book (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL)`);
  const insert = db.prepare("INSERT INTO book (title, author) VALUES (?, ?)");
  for (const [t, a] of seed) insert.run([t, a]);
  insert.free();

  const schema = buildSchema(`
    type Book { id: ID!, title: String!, author: String! }
    type Query { books: [Book!]!, book(id: ID!): Book }
  `);
  const all = (sql, params) => {
    const stmt = db.prepare(sql);
    if (params) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  };
  const root = {
    books: () => all("SELECT id, title, author FROM book ORDER BY id"),
    book: ({ id }) => all("SELECT id, title, author FROM book WHERE id = ?", [id])[0] || null,
  };

  const app = express();
  app.use(express.json());
  app.post("/graphql", async (req, res) => {
    const { query, variables } = req.body;
    res.json(await graphql({ schema, source: query, rootValue: root, variableValues: variables }));
  });
  app.use(markoExpress());
  app.get("/", (req, res) => {
    // Re-require the page each request so edits (and Solve) are reflected.
    delete require.cache[require.resolve("./src/index.marko")];
    const page = require("./src/index.marko").default;
    res.marko(page, { graphqlUrl: "http://localhost:3000/graphql" });
  });
  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
});
