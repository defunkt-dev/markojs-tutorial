import { Writable } from "node:stream";
import express from "express";
import markoMiddleware from "@marko/express";
import { buildSchema, graphql } from "graphql";
import initSqlJs from "sql.js";

const PORT = 3000;

// A real SQLite database (compiled to WASM), seeded ONCE in the server entry so
// writes persist across requests — and so the per-request template load doesn't reset it.
const SQL = await initSqlJs();
const db = new SQL.Database();
db.run(`CREATE TABLE book (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL)`);
const insert = db.prepare("INSERT INTO book (title, author) VALUES (?, ?)");
[
  ["The Pragmatic Programmer", "Hunt & Thomas"],
  ["Refactoring", "Martin Fowler"],
  ["Designing Data-Intensive Applications", "Martin Kleppmann"],
].forEach(([t, a]) => insert.run([t, a]));
insert.free();

const all = (sql, params) => {
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

const schema = buildSchema(`
  type Book { id: ID!, title: String!, author: String! }
  type Query { books: [Book!]!, book(id: ID!): Book }
  type Mutation { addBook(title: String!, author: String!): Book }
`);
const root = {
  books: () => all("SELECT id, title, author FROM book ORDER BY id"),
  book: ({ id }) => all("SELECT id, title, author FROM book WHERE id = ?", [id])[0] || null,
  addBook: ({ title, author }) => {
    db.run("INSERT INTO book (title, author) VALUES (?, ?)", [title, author]);
    return all("SELECT id, title, author FROM book WHERE id = last_insert_rowid()")[0];
  },
};

const app = express();
app.use(express.json());
app.post("/graphql", async (req, res) => {
  const { query, variables } = req.body;
  res.json(await graphql({ schema, source: query, rootValue: root, variableValues: variables }));
});
app.use(markoMiddleware());

// Vite dev server (middleware mode) gives client bundling + hydration + HMR.
const { createServer } = await import("vite");
const vite = await createServer({ appType: "custom", server: { middlewareMode: true } });
app.use(vite.middlewares);

app.get("/", async (req, res, next) => {
  try {
    // Load the page FRESH each request so edits (and Solve) are reflected.
    const { default: page } = await vite.ssrLoadModule("./src/index.marko");
    // Render (async-aware) into a string so we can inject the client scripts that hydrate the page.
    let html = "";
    const collector = new Writable({ write(chunk, enc, cb) { html += chunk; cb(); } });
    collector.on("finish", () => {
      const scripts =
        `<script type="module" src="/@vite/client"></script>` +
        `<script type="module" src="/src/index.marko?marko-browser-entry"></script>`;
      const out = html.includes("</body>") ? html.replace("</body>", scripts + "</body>") : html + scripts;
      res.type("html").send(out);
    });
    page.render({ graphqlUrl: `http://localhost:${PORT}/graphql` }, collector);
  } catch (e) { vite.ssrFixStacktrace(e); next(e); }
});

app.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
