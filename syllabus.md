# Marko Tutorial — Syllabus & Coverage Map

The single source of truth for "is X taught, and where?" Updated with
every content delivery. Paths are `part/chapter/lesson` folder names
under `src/content/tutorial/`.

Legend: **[✓]** shipped · **[P5]** planned for part 5 · **[v2]** second
edition shelf · **[—]** deliberately excluded (with reason).

## Lesson Tree (116 lessons)

### Part 1 — Fundamentals (17)
- 1-first-steps: 1-welcome · 2-templates-are-html · 3-dynamic-text ·
  4-unescaped-text · 5-attributes-are-javascript · 6-attribute-shorthands
- 2-your-first-tags: 1-your-first-custom-tag · 2-passing-data ·
  3-tag-content · 4-dynamic-tags
- 3-styling: 1-style-blocks · 2-less · 3-css-modules · 4-styles-in-files ·
  5-dynamic-styles · 6-tailwind · 7-scss

### Part 2 — Reactivity (15)
- 1-state: 1-the-let-tag · 2-handling-events · 3-derived-values ·
  4-objects-and-arrays · 5-inspecting-state
- 2-inputs-and-binding: 1-reading-inputs · 2-two-way-binding ·
  3-checkboxes-and-radios · 4-selects · 5-transforming-bound-values ·
  6-binding-your-own-tags · 7-details-and-dialogs
- 3-under-the-hood: 1-effects-and-cleanup · 2-how-reactivity-works ·
  3-two-programs-from-one-template

### Part 3 — Control Flow, Lists & Async (11)
- 1-conditionals: 1-if-and-else · 2-show
- 2-lists: 1-the-for-tag · 2-ranges-and-objects · 3-keyed-lists ·
  4-state-in-lists · 5-per-item-styles
- 3-async-and-errors: 1-the-await-tag · 2-out-of-order ·
  3-error-boundaries · 4-what-the-at-means

### Part 4 — Components in Depth (17)
- 1-communication-and-tag-variables: 1-how-components-talk ·
  2-tag-variables · 3-the-id-tag · 4-returning-values · 5-assignable-return
- 2-attribute-tags-and-define: 1-attribute-tags · 2-repeated-and-conditional ·
  3-tag-parameters-and-arguments · 4-the-define-tag · 5-nested-attribute-tags
- 3-discovery-and-dynamic-components: 1-discovery-in-full ·
  2-dynamic-components · 3-lazy-loading-tags
- 4-module-level-and-escape-hatches: 1-module-level-code ·
  2-the-lifecycle-tag · 3-escape-hatches · 4-coming-from-marko-5

### Part 5 — Building Apps with marko-run (16)
- 1-pages-and-routing: 1-your-first-routes · 2-layouts · 3-dynamic-routes ·
  4-route-organization
- 2-data-and-handlers: 1-handlers-and-the-context · 2-loading-data ·
  3-validating-params-and-search · 4-request-bodies-and-forms ·
  5-middleware · 6-route-metadata
- 3-the-full-picture: 1-globals-and-serialization ·
  2-errors-and-special-pages · 3-api-routes ·
  4-plugin-options-and-cdn-assets · 5-where-to-go-next
- 4-content-security: 1-a-csp-nonce **[✓ session 6]**
  (`$global.cspNonce` set in middleware → Marko stamps the nonce on every
  rendered `<script>`/`<style>`; own new chapter, no existing lesson touched)

### Part 6 — Tooling: TypeScript, Testing & Publishing (19) **[v2 batch]**
- 1-typescript (8): 1-enabling-typescript · 2-typing-input ·
  3-typing-content · 4-typing-attribute-tags · 5-extending-native-tags ·
  6-generics · 7-typed-routes · 8-augmenting-and-extracting
- 2-tooling (7): 1-formatting-with-prettier ·
  2-your-first-component-test · 3-testing-interactions ·
  4-storybook-for-marko · 5-stories-as-fixtures ·
  6-end-to-end-tests-with-playwright · 7-editors-linting-and-the-toolbelt
- 3-publishing (4): 1-the-shape-of-a-tag-library · 2-building-with-mtc ·
  3-consuming-your-package · 4-shipping-it-for-real

### Part 7 — Putting It Together (9)
- 1-colour-picker: 1-the-shape · 2-making-it-live · 3-polish **[✓]**
- 2-tic-tac-toe: 1-the-grid · 2-taking-turns · 3-winning **[✓]**
- 3-todomvc: 1-list-and-item · 2-add-toggle-remove · 3-filtering **[✓]**

### Part 8 — Advanced Marko Run **[planned]**
- (reserved; folder `8-` left free so Part 9 additions don't renumber it)

### Part 9 — Advanced Examples, Patterns & Integrations (12)
- 1-static-site-generation: 1-the-static-adapter **[✓]**
- 2-server-sent-events: 1-the-eventsource-api **[✓]**
- 3-shared-state: 1-a-signals-store **[✓]**
- 4-forms: 1-a-validated-form **[✓]**
- 5-client-side-rendering: 1-the-mount-api · 2-the-mount-handle **[✓]**
- 6-dynamic-loading: 1-facade-tags · 2-loading-on-demand **[✓]** (facades = always-lazy + `<try>`/
  `@placeholder`; builds on 4/3/3, which covers the `load:` triggers incl.
  interaction ones — so the book's dynamic-import version stays redundant) ·
  (SPA/router5 · GraphQL · &lt;portal&gt; on a marko@5 template — **planned**)
- 7-wrapping-a-js-library: 1-a-rive-animation **[✓ session 6]**
  (wrap an imperative JS runtime — Rive via `@rive-app/canvas`, on a new
  `marko-run-rive` template — in a Marko 6 tag: `<canvas/ref>` node handle +
  `<script>` setup + `$signal` cleanup + `<return>` instance. The `@marko-tags/rive`
  package is Marko-5/Class-API and does NOT compile on 6, so we wrap the runtime directly)
- 8-portals-and-events: 1-a-portal · 2-event-subscriptions **[✓ session 6]**
  (base marko-run; reimplement two `@marko-tags` v5 tags for v6 — `<portal>` relocates
  its rendered `<div>` to `document.body` via `<script>`+`appendChild`+`$signal`;
  `<subscribe>` wraps `addEventListener`/`removeEventListener` with `$signal` cleanup,
  the native v6 effect pattern. The v5 packages are Class-API + v4/5 transformers, don't
  port; `<context>` & others left as v5-only)
- 9-graphql: 1-a-graphql-query **[✓ session 6]**
  (**MARKO 5** lesson — `@marko/urql` is Class-API/v5, doesn't run on 6, so a dedicated
  `marko-urql` template: express + `@marko/express` SSR + a `/graphql` endpoint (graphql
  core) resolving from **`node:sqlite`** — real SQLite, `node --experimental-sqlite`. Do-it:
  `gql` query + `<gql-query><@then>` renders books server-side. Recreates the book's
  GraphQL+sqlite chapter; sqlite native won't run in WebContainer so `node:sqlite` used)

## Topic Index

### Language basics
- HTML-is-Marko, doctype pages **[✓]** 1/1/2-templates-are-html
- `${}` escaped interpolation **[✓]** 1/1/3-dynamic-text
- `$!{}` unescaped + XSS caution (danger callout) **[✓]** 1/1/4-unescaped-text
- Attributes are JS expressions; `>` parenthes rule **[✓]** 1/1/5-attributes-are-javascript
- Spread attributes **[✓]** 1/1/6-attribute-shorthands
- Shorthand class / id **[✓]** 1/1/6-attribute-shorthands
- Shorthand value **[✓]** informal 1/2/2-passing-data → formally named 3/1/1-if-and-else
- Shorthand methods **[✓]** 2/1/2-handling-events
- Comments (stripped by default) **[✓]** 4/4/3-escape-hatches
- Concise mode **[—]** excluded from v1 (HTML-mode-only curriculum; ~zero retro cost to add in v2)

### Custom tags & components
- Relative discovery (`tags/` walk) **[✓]** 1/2/1-your-first-custom-tag
- `input` / passing data **[✓]** 1/2/2-passing-data
- Tag content (`input.content`) **[✓]** 1/2/3-tag-content
- Dynamic tags `<${}>`; strings→native boundary **[✓]** 1/2/4-dynamic-tags
- Local-variable (PascalCase) + installed discovery + `import from "<tag>"` **[✓]** 4/3/1-discovery-in-full
- Dynamic components via references **[✓]** 4/3/2-dynamic-components
- Lazy imports `with { load }` + all triggers **[✓]** 4/3/3-lazy-loading-tags
- Publishing installable tag packages **[v2]**

### Reactivity
- `<let>`; assignment-is-the-trigger **[✓]** 2/1/1-the-let-tag
- Events / native handlers **[✓]** 2/1/2-handling-events
- `<const>` derived values **[✓]** 2/1/3-derived-values
- Objects & arrays in state **[✓]** 2/1/4-objects-and-arrays
- `<log>` / `<debug>` **[✓]** 2/1/5-inspecting-state
- Compile-time reactive graph, scheduling/batching **[✓]** 2/3/2-how-reactivity-works
- immer patterns **[✓]** 2/3/2 + 3/2/4-state-in-lists
- `<script>` effects **[✓]** 2/3/1-effects-and-cleanup
- `$signal` cleanup **[✓]** 2/3/1-effects-and-cleanup
- `<lifecycle>` **[✓]** 4/4/2-the-lifecycle-tag

### Binding & controllable
- Uncontrolled inputs; two-states trap **[✓]** 2/2/1-reading-inputs
- `value:=` / long-form `valueChange` (text, textarea) **[✓]** 2/2/2-two-way-binding
- checked / checkedValue (checkbox, radio) **[✓]** 2/2/3-checkboxes-and-radios
- select value binding (single + multiple) **[✓]** 2/2/4-selects
- Refining functions `value:fn:=` **[✓]** 2/2/5-transforming-bound-values
- Controllable custom tags `<let/x:=input.x>` **[✓]** 2/2/6-binding-your-own-tags
- details / dialog `open:=` (+ showModal caveat) **[✓]** 2/2/7-details-and-dialogs

### Control flow & async
- `<if>` / `<else>` chains **[✓]** 3/1/1-if-and-else
- `<show>` (persistence vs teardown) **[✓]** 3/1/2-show
- `<for>` of / in / ranges **[✓]** 3/2/1 + 3/2/2
- Keyed lists `by=` **[✓]** 3/2/3-keyed-lists
- State in lists; local vs hoisted **[✓]** 3/2/4-state-in-lists
- Per-item `<style>` values (+ nth-of-type warning) **[✓]** 3/2/5-per-item-styles
- `<await>`; in-order streaming **[✓]** 3/3/1-the-await-tag
- `<try>` `@placeholder`; out-of-order streaming **[✓]** 3/3/2-out-of-order
- `<try>` `@catch` error boundaries **[✓]** 3/3/3-error-boundaries

### Tag variables, params, slots
- Tag variables; element refs; hoisted scope **[✓]** 4/1/2-tag-variables
  (repeated/iterable tag vars: prose-level in same lesson)
- `<id>` **[✓]** 4/1/3-the-id-tag
- `<return>` **[✓]** 4/1/4-returning-values
- Assignable return (`valueChange`) **[✓]** 4/1/5-assignable-return
- Component instances/refs **[—]** no instances in Marko 6 → return values (see 4/4/4)
- Attribute tags **[✓]** 3/3/4 (preview) + 4/2/1-attribute-tags
- Repeated + conditional slots **[✓]** 4/2/2-repeated-and-conditional
- Nested attribute tags **[✓]** 4/2/5-nested-attribute-tags
- Tag parameters & arguments **[✓]** 3/2/1 (intro) + 4/2/3 (full)
- `<define>` **[✓]** 4/2/4-the-define-tag

### Module-level & platform
- `import` **[✓]** used from part 2 on; formal 4/4/1-module-level-code
- `export` from `.marko` **[✓]** 4/4/1-module-level-code
- `static` **[✓]** 2/3/2 (explained) + 4/4/1 (consolidated)
- `server` / `client` statements **[✓]** 4/4/1-module-level-code
- `$global` **[✓]** 5/3/1-globals-and-serialization (intro 5/1/3)
- `$global.cspNonce` (CSP nonce) → set in middleware, Marko stamps it on every rendered
  `<script>`/`<style>` for a strict Content-Security-Policy **[✓]** 5/4/1-a-csp-nonce
- shared state across non-parent/child components (Marko 6 has no context
  API) → a module-level **signals store** (`@preact/signals-core` `signal` +
  actions, bridged into a component via `count.subscribe` → `<let>` +
  `$signal` cleanup) **[✓]** 9/3/1
- client-side form state → **final-form** (`createForm` + `validate` + `subscribe`,
  form built client-only in `<script>` since it isn't serializable, bridged into
  `<let>`s) **[✓]** 9/4/1
- client-side rendering, no server → **`Template.mount(input, node, position?)`** on a plain
  vite + `@marko/vite` app in **unlinked** mode (`marko({ linked: false })`); builds to a static
  `dist/` (index.html + JS) **[✓]** 9/5/1 · the returned **mount handle** — `instance.update(input)`
  / `.destroy()` / `.value` (two-way with an assignable `<return>`) for driving/embedding a
  mounted app from outside **[✓]** 9/5/2
- **facade tags** (always-lazy) — a wrapper that lazily imports a heavy impl (kept private
  in a nested `tags/` dir) so every consumer gets code-splitting for free; `<try>` +
  `@placeholder`/`@catch` for the loading/error state; SSR writes full HTML, only client JS
  defers **[✓]** 9/6/1 (extends the `load:` triggers of 4/3/3)
- **deferring content vs. hydration** — facade defers hydration (HTML SSR'd); `<if>` + a lazy
  component (or a dynamic `import()` + `<${C}/>`) defers the content itself; observable in dev
  **[✓]** 9/6/2
- **wrapping an imperative JS library** in a Marko 6 tag — `<canvas/ref>` DOM-node handle +
  `<script>` setup + `$signal.onabort` cleanup + `<return>` instance; Rive via `@rive-app/canvas`
  (the `@marko-tags/rive` package is Marko 5, doesn't compile on 6 — wrap the runtime directly)
  **[✓]** 9/7/1
- **portal** (render into `document.body`) — a `<div/ref>` + `<${input.content}/>`, moved via
  `<script>`+`appendChild`, put back on `$signal`; escapes `overflow`/`z-index` clipping for
  dialogs/tooltips; pairs with `<if>` to avoid the SSR-in-place flash **[✓]** 9/8/1
- **event subscriptions** — a reusable `<subscribe to= event= onFire()>` tag = `addEventListener`
  in `<script>` + `removeEventListener` on `$signal`; conditional `<if>` drives its lifecycle
  (the native v6 form of the old `@marko-tags/subscribe`) **[✓]** 9/8/2
- Serialization limits; `serializedGlobals` **[✓]** 5/3/1-globals-and-serialization
- html-comment / html-script / html-style **[✓]** 4/4/3-escape-hatches
- html-text / include-text / include-html / scriptlets / `out` / `this.emit`
  **[—]** Marko 5 only → translation table **[✓]** 4/4/4-coming-from-marko-5

### Styling
- Style blocks **[✓]** 1/3/1 · LESS **[✓]** 1/3/2 · CSS Modules **[✓]** 1/3/3
- Files: auto-discovered / imported / *.module.css **[✓]** 1/3/4
- Dynamic values → CSS custom properties **[✓]** 1/3/5 · Tailwind **[✓]** 1/3/6

### Tooling & ecosystem
- Marko + TypeScript **[v2]** (tier 1 works today; tier 2 terminal
  type-check exercise; tier 3 LSP-in-container = upstream project)
- Streaming/perf deep dives, concise mode, syntax converter, playground
  **[v2]**

### marko-run (all shipped in part 5)
- File-based routing, zero config **[✓]** 5/1/1 · Layouts (`input.content`;
  README's `renderBody` is stale — verified) **[✓]** 5/1/2
- Dynamic `$param` / catch-all / pathless / flat / multi-path / groups /
  optional / escaping **[✓]** 5/1/3 + 5/1/4
- Handlers, `Run` verb helpers, context object **[✓]** 5/2/1
- Data loading `next(data)` → `$global.data` **[✓]** 5/2/2
- Params & search validation **[✓]** 5/2/3 · `json`/`form` bodies,
  `context.body`, POST→render **[✓]** 5/2/4
- Middleware & execution order **[✓]** 5/2/5 · `+meta` (per-route, verb
  merges) **[✓]** 5/2/6
- `+404`/`+500` (pipeline errors only — render errors are `<try>`'s job,
  verified), `redirect`/`back` **[✓]** 5/3/2
- Plugin options: `routesDir`, `basePathVar`, `trailingSlashes`; CDN asset
  base paths **[✓]** 5/3/4 · `linked`, `runtimeId`, `babelConfig`,
  env/dotenv, connect-style apps **[v2]** (advanced marko-run)
- Prettier + `prettier-plugin-marko`; `--marko-syntax` conversion **[✓]**
  6/2/1 · Component testing: `@marko/testing-library`, vitest, jsdom,
  `render`/`screen`/`fireEvent` **[✓]** 6/2/2, 6/2/3 · Storybook + CSF,
  args, `composeStories` **[✓]** 6/2/4, 6/2/5 · Playwright e2e:
  `webServer`, SSR vs hydrated assertions, console-error gate **[✓]**
  6/2/6 (runs on download — WebContainers cannot launch browsers) ·
  ESLint flat config + `flat/marko` preset; language server; repo roster
  **[✓]** 6/2/7
- Library shape: `src/tags`, `marko.json` `exports` (vs `tags-dir`,
  `script-lang`), prefix collisions, private nested tags **[✓]** 6/3/1 ·
  `mtc` emit mode: stripped `.marko` + generated `.d.marko`, import
  rewriting, the buildinfo-inside-dist rule **[✓]** 6/3/2 · Consuming a
  packed tarball: bare-name discovery of an installed package, published
  types in the consumer's checker **[✓]** 6/3/3 · `files`, `pnpm pack`,
  `sideEffects: ["**/*.marko"]`, the `"./dist/tags/*"` export, `pnpm pack`
  vs `npm pack` **[✓]** 6/3/4 · `npm publish` itself **[✓-pointer]** 6/3/4
- API routes **[✓]** 5/3/3 · **server-sent events** (streaming
  `text/event-stream` handler + browser `EventSource`, `<script>` effect +
  `$signal` cleanup) **[✓]** 9/2/1 · Adapters, embedding (`Run.fetch`/`match`/
  `invoke`), typed URLs **[✓-pointer]** 5/3/5 (depth **[v2]**)

### Explanations (docs/explanation)
- immutable-state **[✓]** distributed: 2/1/4, 2/3/2, 3/2/4
- targeted-compilation **[✓]** 2/3/2 (the compile-time graph) + 2/3/3
  (the platform outputs: `compileFile` html vs dom, `$template` + `$walks`)
- fine-grained-bundling **[✓]** 2/3/3 (why a static tag ships no walk and
  no runtime) + 9/1/1 (seen in a real build's per-route size table: a
  no-interaction page ships 0 kB, an interactive one ships only its island);
  depth → 5/3/5 reading list
- separation-of-concerns, streaming, why-is-marko-fast,
  optimizing-performance **[✓-pointer]** 5/3/5 reading
  list · controllable-components **[✓]** part 2 ch2 ·
  nested-reactivity **[✓]** 3/2/4 · serializable-state **[✓]** 5/3/1 ·
  class-vs-tags-api **[✓]** 4/4/4 · let-vs-const **[✓]** 2/1/3
  