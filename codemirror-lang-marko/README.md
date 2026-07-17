# codemirror-lang-marko

Marko language support for CodeMirror 6, colored by the **real Marko
TextMate grammar** executed through [shiki](https://shiki.style)'s
Oniguruma (WASM) engine — the same bridge that powers the editor on
[markojs.com](https://markojs.com) (ported from the website's
`src/util/codemirror.ts`, `shiki.ts`, `style-to-class.ts`,
`shiki-theme.ts`).

Because the grammar is the one behind the Marko VS Code extension,
highlighting is VS Code-identical, including concise mode, tag
parameters, attribute tags, and unquoted attribute expressions — no
hand-written approximation.

## Usage

```js
import { marko } from "codemirror-lang-marko";

const support = await marko(); // LanguageSupport
```

The factory is async: the first call loads the Oniguruma WASM engine and
the Marko grammar bundle (a one-time cost of a few hundred KB, lazily
fetched). Later calls reuse a singleton highlighter.

## What you get

- A `LanguageSupport` wrapping a minimal do-nothing `Language`
  (the `StreamLanguage` never emits tokens; it exists to satisfy
  integrations and to carry `languageData`: `//` and `/* */` comment
  tokens, closeBrackets configuration).
- A `ViewPlugin` that retokenizes the full document on every change via
  `highlighter.codeToTokens` and paints tokens as mark decorations.
  Fine for tutorial/lesson-sized files; per-line incremental caching is
  possible future optimization headroom.
- The markojs.com `marko-light` / `marko-dark` themes. Token colors are
  emitted as dual CSS variables (`--shiki-light` / `--shiki-dark`);
  a small injected stylesheet switches them on `[data-theme="dark"]`
  (astro/TutorialKit convention) or an ancestor `.dark` class.
- `foldOnIndent()` — indentation-based code folding (no grammar needed).

Colors only: structural features (smart indent, bracket-aware selection,
true syntax tree) would require a Lezer grammar and are out of scope.

## Testing

```
npm test
```

Runs a headless Node tokenization check against the real `.marko` files
in the surrounding tutorial's template (no DOM, no editor instance).
