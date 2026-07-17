// Ported from markojs website src/util/shiki.ts, with two changes:
//   - No top-level await: the highlighter is created lazily behind an
//     async singleton, so this module is safe to import during SSR or in
//     bundlers that dislike top-level await. The WASM engine only loads
//     the first time marko() is awaited (in TutorialKit that is the lazy
//     LanguageDescription.load() call, already async by design).
//   - Only the marko grammar bundle is registered. @shikijs/langs/marko
//     already includes the grammars marko embeds (css, less, scss,
//     javascript), so the website's wider set (html, xml, json, sh, toml,
//     ts) is unnecessary here: this highlighter is only ever asked to
//     tokenize lang "marko".

import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import marko from "@shikijs/langs/marko";
import { dark, light } from "./theme.js";

let highlighterPromise;

export function getHighlighter() {
  return (highlighterPromise ??= createHighlighterCore({
    engine: createOnigurumaEngine(import("shiki/wasm")),
    themes: [dark, light],
    langs: [marko],
  }));
}
