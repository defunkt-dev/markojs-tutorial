// Tutorial-only: reports the current path to the preview's address bar, so you
// can watch the URL change as you navigate. A normal app wouldn't include this.
window.parent.postMessage({ type: "tk-url", pathname: location.pathname }, "*");
