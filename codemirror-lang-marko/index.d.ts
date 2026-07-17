import type { LanguageSupport, StreamLanguage } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import type { HighlighterCore } from "shiki/core";

/**
 * Marko language support for CodeMirror 6. Async: the first call loads the
 * Oniguruma WASM engine and the Marko TextMate grammar; later calls reuse
 * the singleton highlighter.
 */
export function marko(): Promise<LanguageSupport>;

/** The minimal Language carrying marko languageData (no real parsing). */
export const markoLanguage: StreamLanguage<unknown>;

/** Indentation-based fold service (no grammar required). */
export function foldOnIndent(): Extension;

/** The lazy shiki highlighter singleton used by marko(). */
export function getHighlighter(): Promise<HighlighterCore>;
