# Tutorial verification harness

`verify.mjs` walks every lesson under `src/content/tutorial`, resolves each
one's template the way TutorialKit does, materialises each state (`_files` and
`_solution`) into a scratch copy of that template, and runs the checks declared
for it. "Verify before shipping" is this project's core rule; this is where it
lives.

```bash
npm run verify                         # every lesson
node scripts/harness/verify.mjs 7-examples   # only paths containing this string
node scripts/harness/verify.mjs --list       # show what it WOULD run + each lesson's checks
node scripts/harness/verify.mjs --keep       # leave .harness-scratch/ for inspection
node scripts/harness/verify.mjs --pm=pnpm    # force a package manager (else auto-detected)
```

It exits non-zero if anything fails, so it doubles as a CI gate. The package
manager is auto-detected from the repo lockfile (npm vs pnpm).

Each template's dependencies install **once** (into a per-template cache under
`.harness-scratch/`) and are symlinked into every state's scratch, so a full run is
dominated by builds, not repeated installs. Commands run through `bash -c` (not a
login shell) so they inherit the PATH the harness was launched with — important on
macOS with nvm/homebrew, where a login shell wouldn't find npm.

## Where checks live: `checks.yaml` (NOT frontmatter)

Per-lesson checks live in **`scripts/harness/checks.yaml`**, keyed by the
lesson's path under `src/content/tutorial` (the same path `--list` prints):

```yaml
7-examples/1-colour-picker/2-making-it-live:
  ssr:
    _files: "rgb(128, 128, 128)"
    _solution: "rgb(128, 128, 128)"
```

They used to live in a `harness:` block in each `content.md`'s frontmatter, but
Astro's content-collection schema rejects unknown keys and it broke the site
build (session 4 O32). The sidecar sits outside `src/content`, so Astro never
validates it.

A lesson with **no entry** is still built (both states must compile) and
reported **BUILD-ONLY** — so gaps are visible, not silent. Every state is always
built and every prose ` ```bash ` block is always linted against the container's
real `/bin`, entry or not.

## Check vocabulary

Everything under a lesson key is optional. Each check maps to a failure class
this project has actually hit.

- **`states`** — which state dirs to run (default `[_files, _solution]`).
- **`build`** — by default every state must compile. `build: false` skips it, and a
  template with **no `build` script** (e.g. `marko-storybook`, which runs storybook)
  is skipped automatically. For a lesson whose `_files` is a **planted compile error**
  the learner fixes, declare the expectation per state —
  `build: { _files: fail, _solution: pass }` — and the harness verifies the broken
  state *stays* broken (the build-time twin of a red test state).
- **`ssr`** — boot the dev server, curl it, assert. Per-state value is either a
  bare string (asserted present in the body) or an object
  `{ contains, absent, status, path }`. Top-level keys `port` (default 3000),
  `command` (default `<pm> run dev`), `path`, `status`, `contains`, `absent`
  apply to all states.
- **`test`** — run a suite (default `vitest run`); per state `pass` | `fail`
  (planted-mistake lessons must actually be red). `clearStorybookCache: true`
  wipes `node_modules/.cache` first (O20 — a stale story index nearly shipped a
  broken lesson green).
- **`typecheck`** — run `mtc`; per state `clean` | `error`, with
  `<state>_code` / `code` to assert a specific TS error code (J2).
- **`emit`** — `files: [...]` that must exist after build; `strippedInterfaceIn`
  asserts an emitted file no longer contains `export interface Input`.
- **`pack`** — `npm pack --dry-run`; per-state or top-level `includes` /
  `excludes` (asserts exactly what ships and what must not — O26).
- **`command`** — escape hatch: `run` an arbitrary command, assert its output
  `contains` / `absent` (per state or top-level).
- **`templateClean: false`** — skip the template-litter scan (default warns if
  the template dir carries `dist/`, `.marko-run`, `node_modules`, or a
  `.tsbuildinfo`).

## Adding a lesson's checks

1. Run `--list` to see the lesson's path and current status.
2. Add an entry under that path in `checks.yaml`.
3. Re-run the harness filtered to that lesson to confirm green — and, for
   planted-mistake lessons, that the red state is red.
