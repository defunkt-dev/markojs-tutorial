// Ported from markojs website src/util/style-to-class.ts.
// Dedupes token inline styles into generated classes and injects one
// <style> element. Changes from the original:
//   - SSR/headless guard: when `document` is unavailable, class names are
//     still generated (so tokenization can be tested in Node) but no DOM
//     injection is attempted.
//   - injectCss(): lets the package add static rules (the light/dark
//     token color switch) through the same <style> element.

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
  if (styleEl) {
    styleEl.textContent = styleText;
  } else {
    styleEl = document.createElement("style");
    styleEl.textContent = styleText;
    document.head.appendChild(styleEl);
  }
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
