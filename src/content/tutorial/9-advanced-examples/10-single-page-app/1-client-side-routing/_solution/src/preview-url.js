// Tells the tutorial's address bar which path we're on. This is specific to
// running inside the tutorial preview — a normal app wouldn't need it.
export function reportUrl() {
  window.parent.postMessage({ type: "tk-url", pathname: location.pathname }, "*");
}
