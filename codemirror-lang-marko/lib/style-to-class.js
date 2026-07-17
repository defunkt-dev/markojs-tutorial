// Ported from markojs website src/util/style-to-class.ts.
// Dedupes token inline styles into generated classes and injects one
// <style> element. Changes from the original:
//   - SSR/headless guard: when `document` is unavailable, class names are
//     still generated (so tokenization can be tested in Node) but no DOM
//     injection is attempted.
//   - injectCss(): lets the package add static rules (the light/dark
//     token color switch) through the same <style> element.
//   - Router-proofing, two layers. Client-side routers that swap the
//     document head (astro view transitions between TutorialKit lessons)
//     silently remove injected style elements while this module's
//     in-memory state survives. Layer 1: the element is marked with
//     data-astro-transition-persist — the same mechanism TutorialKit
//     itself uses to protect CodeMirror's own style tag — so astro's
//     router preserves it across navigations. Layer 2: ensureStyles()
//     re-creates the element whenever it is missing or detached; the
//     shiki plugin calls it on every editor construction.

const PERSIST_ATTR = "data-astro-transition-persist";
const PERSIST_NAME = "codemirror-lang-marko";

const classNames = new Map();
const injectedChunks = new Set();
let styleEl;
let styleText = "";
let applying = false;

export function styleToClass(value) {
  const style = normalizeStyle(value);
  if (style) {
    let className = classNames.get(style);
    if (!className) {
      className = `s_${classNames.size.toString(36)}`;
      classNames.set(style, className);
      styleText += `.${className}{${style}}`;
      scheduleApply();
    }

    return className;
  }
}

export function injectCss(css) {
  if (!injectedChunks.has(css)) {
    injectedChunks.add(css);
    styleText += css;
    scheduleApply();
  }
}

export function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!styleEl || !styleEl.isConnected) {
    createStyleEl();
  }
  styleEl.textContent = styleText;
}

function createStyleEl() {
  styleEl = document.createElement("style");
  styleEl.setAttribute(PERSIST_ATTR, PERSIST_NAME);
  document.head.appendChild(styleEl);
}

function scheduleApply() {
  if (typeof document === "undefined") return;
  if (!applying) {
    applying = true;
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(applyStyles);
    } else {
      queueMicrotask(applyStyles);
    }
  }
}

function applyStyles() {
  applying = false;
  ensureStyles();
}

function normalizeStyle(value) {
  if (value) {
    if (typeof value === "object") {
      let style = "";
      let sep = "";

      if (Array.isArray(value)) {
        for (const item of value) {
          const str = normalizeStyle(item);
          if (str) {
            style += sep + normalizeStyle(item);
            sep = ";";
          }
        }
      } else {
        for (const key in value) {
          const str = normalizeStyle(value[key]);
          if (str) {
            style += sep + key + ":" + str;
            sep = ";";
          }
        }
      }

      return style;
    } else {
      return "" + value;
    }
  }
}
