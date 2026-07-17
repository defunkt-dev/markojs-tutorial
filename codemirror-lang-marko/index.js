// codemirror-lang-marko
//
// Marko language support for CodeMirror 6, colored by the real Marko
// TextMate grammar executed through shiki's Oniguruma (WASM) engine.
// The bridge mechanism (shiki ViewPlugin + style-to-class + foldOnIndent)
// is ported from the markojs.com website (src/util/codemirror.ts), wrapped
// in the LanguageSupport shape CodeMirror integrations expect:
//
//   - a minimal do-nothing StreamLanguage supplies the Language socket and
//     the languageData (comment tokens, closeBrackets) the website provided
//     manually via EditorState.languageData;
//   - the shiki decorations ViewPlugin does all actual coloring
//     (full-document retokenize per change, fine at lesson-file sizes);
//   - foldOnIndent adds indentation-based code folding;
//   - token colors are emitted as dual light/dark CSS variables
//     (--shiki-light / --shiki-dark) and a small injected stylesheet
//     switches them on `[data-theme="dark"]` (TutorialKit / astro
//     convention) or an ancestor `.dark` class.
//
// Usage:
//   import { marko } from "codemirror-lang-marko";
//   const support = await marko(); // LanguageSupport

import {
  StreamLanguage,
  LanguageSupport,
  foldService,
} from "@codemirror/language";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { getHighlighter } from "./lib/highlighter.js";
import {
  styleToClass,
  injectCss,
  ensureStyles,
} from "./lib/style-to-class.js";

const TOKEN_CLASS = "cmlm-tok";

// Base color rule first, dark overrides after (higher specificity plus
// later source order): a token span colors from --shiki-light by default
// and from --shiki-dark under a dark root.
const TOKEN_CSS =
  `.${TOKEN_CLASS}{color:var(--shiki-light)}` +
  `[data-theme="dark"] .${TOKEN_CLASS},.dark .${TOKEN_CLASS}` +
  `{color:var(--shiki-dark)}`;

// The do-nothing Language: its tokenizer emits nothing (shiki paints via
// decorations instead), but it satisfies integrations that require a
// LanguageSupport and carries the language metadata.
export const markoLanguage = StreamLanguage.define({
  name: "marko",
  token(stream) {
    stream.skipToEnd();
    return null;
  },
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", '"', "'", "`"] },
  },
});

// Ported from the website's shiki() ViewPlugin (codemirror.ts ~L129):
// on construction and on every doc change, retokenize the whole document
// with the dual marko-light/marko-dark themes and rebuild mark
// decorations, one deduped class per distinct token style.
function shikiDecorations(highlighter, lang) {
  return ViewPlugin.fromClass(
    class {
      constructor(view) {
        // Client-side navigation can swap the document head and drop the
        // injected style element; every new editor re-checks it.
        ensureStyles();
        this.decorations = this.buildDecorations(view);
      }

      update(update) {
        if (update.docChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view) {
        const builder = new RangeSetBuilder();
        const { tokens } = highlighter.codeToTokens(
          view.state.doc.toString(),
          {
            lang,
            defaultColor: false,
            themes: {
              light: "marko-light",
              dark: "marko-dark",
            },
          },
        );

        for (const line of tokens) {
          for (const token of line) {
            const className = styleToClass(token.htmlStyle);
            if (className) {
              builder.add(
                token.offset,
                token.offset + token.content.length,
                Decoration.mark({ class: `${TOKEN_CLASS} ${className}` }),
              );
            }
          }
        }

        return builder.finish();
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
}

// Ported verbatim from the website's foldOnIndent(): computes fold ranges
// purely from indentation, no grammar needed.
export function foldOnIndent() {
  return foldService.of(({ doc }, pos) => {
    const start = doc.lineAt(pos);
    const startIndent = getIndentation(start.text);
    let end = start.number;
    let indented = false;

    for (let i = start.number + 1; i <= doc.lines; i++) {
      const text = doc.line(i).text;
      if (/^\s*$/.test(text)) {
        end = i;
      } else if (getIndentation(text) > startIndent) {
        end = i;
        indented = true;
      } else {
        break;
      }
    }

    if (indented) {
      return { from: start.to, to: doc.line(end).to };
    }

    return null;
  });
}

function getIndentation(line) {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
}

// The factory. Async because the first call loads the Oniguruma WASM
// engine and the grammar; subsequent calls reuse the singleton.
export async function marko() {
  const highlighter = await getHighlighter();
  injectCss(TOKEN_CSS);
  ensureStyles();
  return new LanguageSupport(markoLanguage, [
    shikiDecorations(highlighter, "marko"),
    foldOnIndent(),
  ]);
}

export { getHighlighter };
