// Headless tokenization test (Node, no DOM, no CodeMirror instance).
// Verifies, on the real .marko files shipped in the PoC template:
//   1. the highlighter builds (WASM engine + marko grammar bundle load);
//   2. codeToTokens succeeds with the dual marko-light/marko-dark themes;
//   3. token offsets are sane (within line, non-overlapping, ordered) —
//      the exact precondition RangeSetBuilder.add relies on;
//   4. multiple distinct token styles appear (i.e. real coloring, not one
//      flat style);
//   5. styleToClass generates stable deduped class names with the DOM
//      guard active (document undefined here).

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getHighlighter } from "../lib/highlighter.js";
import { styleToClass } from "../lib/style-to-class.js";

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
// The package lives inside the tutorial project; the template is a sibling.
const templateRoot = resolve(pkgRoot, "../src/templates");

function findMarkoFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      findMarkoFiles(full, out);
    } else if (name.endsWith(".marko")) {
      out.push(full);
    }
  }
  return out;
}

const files = findMarkoFiles(templateRoot);
if (files.length === 0) {
  console.error("FAIL: no .marko files found under " + templateRoot);
  process.exit(1);
}

const highlighter = await getHighlighter();
let failures = 0;

for (const file of files) {
  const code = readFileSync(file, "utf8");
  const { tokens } = highlighter.codeToTokens(code, {
    lang: "marko",
    defaultColor: false,
    themes: { light: "marko-light", dark: "marko-dark" },
  });

  const lines = code.split("\n");
  const styles = new Set();
  const classes = new Set();
  let tokenCount = 0;
  let offsetErrors = 0;

  tokens.forEach((lineTokens, lineIdx) => {
    let prevEnd = -1;
    for (const token of lineTokens) {
      tokenCount++;
      const start = token.offset;
      const end = token.offset + token.content.length;
      // Offsets are document-absolute; recover the line-relative window.
      const lineStart = lines.slice(0, lineIdx).reduce(
        (acc, l) => acc + l.length + 1,
        0,
      );
      const lineEnd = lineStart + (lines[lineIdx]?.length ?? 0);
      if (start < lineStart || end > lineEnd || start < prevEnd) {
        offsetErrors++;
      }
      prevEnd = end;
      if (token.htmlStyle) {
        styles.add(JSON.stringify(token.htmlStyle));
        const cls = styleToClass(token.htmlStyle);
        if (cls) classes.add(cls);
      }
    }
  });

  const rel = file.slice(templateRoot.length + 1);
  const ok = tokenCount > 0 && offsetErrors === 0 && styles.size >= 3;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${rel}: ${lines.length} lines, ` +
      `${tokenCount} tokens, ${styles.size} distinct styles, ` +
      `${classes.size} classes, ${offsetErrors} offset errors`,
  );
}

// Dedup check: same style twice must return the same class.
const a = styleToClass({ "--shiki-light": "#111111", "--shiki-dark": "#eeeeee" });
const b = styleToClass({ "--shiki-light": "#111111", "--shiki-dark": "#eeeeee" });
if (a !== b || !a) {
  failures++;
  console.log("FAIL styleToClass dedup: " + a + " vs " + b);
} else {
  console.log("PASS styleToClass dedup (" + a + ")");
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log("\nAll tokenization checks passed.");
