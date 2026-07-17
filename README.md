# Learn Marko — Interactive Tutorial for Marko v6

An interactive, learn.svelte.dev-style tutorial for [Marko 6](https://markojs.com),
built with [StackBlitz TutorialKit](https://tutorialkit.dev). Lesson prose on the
left; a live code editor, terminal, and preview on the right. The learner edits
real `.marko` files in a real `@marko/run` app booted inside an in-browser
[WebContainer](https://webcontainers.io) — edits hot-reload instantly, and a
Solve button reveals each lesson's finished state.

## Quick Start

```bash
npm install   # also applies the local patch (see below) via postinstall
npm run dev   # http://localhost:4321
```

Requires Node 20.19+ or 22.12+. The site itself installs with plain npm; the
in-browser lesson app installs its own dependencies with pnpm automatically.

## What's In This Repo

```bash
.
├── astro.config.ts           # TutorialKit is an Astro integration
├── codemirror-lang-marko/    # Marko syntax highlighting for the editor (see below)
├── patches/                  # patch-package diff applied to @tutorialkit/react
├── icons/languages/marko.svg # file icon for .marko (tab + file tree)
├── public/
│   ├── logo.svg              # top-bar logo (light mode)
│   └── logo-dark.svg         # top-bar logo (dark mode)
├── src/
│   ├── content/tutorial/     # lessons: parts / chapters / lessons
│   └── templates/marko-run/  # the app that boots in the browser for lessons
├── tsconfig.json             # note: excludes src/templates (they are standalone apps)
└── uno.config.ts
```

### codemirror-lang-marko

Marko language support for CodeMirror 6, powering syntax highlighting in the
lesson editor. It runs the **real Marko TextMate grammar** (the one behind the
VS Code extension) through shiki's Oniguruma WASM engine — the same bridge that
powers the editor on markojs.com, extracted into a standalone package. Coloring
is VS Code-identical, including concise mode. Installed into the site via a
local `file:` dependency; intended for standalone npm publication later.

Test it headlessly (tokenizes the real template `.marko` files in Node, no
browser needed):

```bash
cd codemirror-lang-marko && npm test
```

See `codemirror-lang-marko/README.md` for details.

### The patch (patches/)

TutorialKit's editor has a hardcoded language list and icon mappings inside
`@tutorialkit/react`. Three small additions (the Marko language entry, the
editor-tab icon, the file-tree icon) are carried as a
[patch-package](https://github.com/ds300/patch-package) diff that re-applies
automatically on every `npm install`. It will be deleted once the equivalent
change is upstreamed to TutorialKit. Until then, `@tutorialkit/react` stays
pinned to an exact version.

### The template (src/templates/marko-run)

A minimal `@marko/run` app (a counter page) that TutorialKit packs at build
time and mounts into the WebContainer when a lesson boots. Notes:

- Both `pnpm-lock.yaml` and `package-lock.json` are committed **on purpose**:
  the in-browser install uses pnpm (fast in WebContainers) and the lockfile
  skips dependency resolution; the npm lockfile covers local tinkering. If you
  change the template's `package.json`, regenerate **both**.
- `vite.config.ts` sets `server.allowedHosts: true`. Required: without it,
  Vite rejects the WebContainer proxy hostname and hot-reload dies. Do not
  remove.
- Never commit `node_modules`, `dist`, or `.marko-run` inside the template —
  TutorialKit packs the folder verbatim.

Current pins: `marko ^6.3.14`, `@marko/run ^0.11.5`, `vite ^8.1.5`
(the current published set; lessons are authored against these).

## Authoring Lessons

Content lives in `src/content/tutorial` as parts → chapters → lessons:

```bash
tutorial
├── 1-basics
│   ├── 1-introduction
│   │   ├── 1-welcome
│   │   │   ├── content.md   # lesson text (Front Matter + markdown)
│   │   │   ├── _files/      # files overlaid on the template (start state)
│   │   │   └── _solution/   # finished state — enables the Solve button
│   │   └── meta.md          # chapter metadata
│   └── meta.md              # part metadata
└── meta.md
```

Key Front Matter properties (mostly inherited part → chapter → lesson):
`type` (part|chapter|lesson), `title`, `template` (which folder in
src/templates to boot), `focus` (file opened in the editor),
`previews` (ports), `prepareCommands` / `mainCommand` (what runs in the
container), `terminal`. Example lesson header:

```markdown
---
type: lesson
title: Welcome to Marko
template: marko-run
focus: /src/routes/+page.marko
previews: [3000]
prepareCommands:
  - ['pnpm install', 'Installing dependencies']
mainCommand: ['pnpm run dev', 'Starting dev server']
---
```

Marko code fences in lesson prose (```` ```marko ````) are highlighted at
build time by Shiki — no extra setup.

Full authoring reference: [tutorialkit.dev/guides/creating-content](https://tutorialkit.dev/guides/creating-content/)

## Verifying Changes

```bash
npm run build                            # astro check + full site build
cd codemirror-lang-marko && npm test     # headless tokenization test
```

`astro check` deliberately skips `src/templates` — templates are standalone
apps with their own dependency trees, packed as JSON and never compiled by the
site.

## Status & Roadmap

Working today: WebContainer boot, SSR + hydration, hot reload, Shiki-highlighted
lesson prose, full Marko highlighting in the editor (both themes), Marko file
icons, Marko branding. In progress: the lesson curriculum (part 1 first).
Planned upstream contributions: the TutorialKit language/icon patch as a PR,
and an `@marko/run` fix for HMR behind proxied hosts (WebContainers, Codespaces,
Gitpod) so the `allowedHosts` workaround becomes unnecessary.
