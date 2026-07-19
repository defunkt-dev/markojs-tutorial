// A tiny client-side router built directly on the browser History API — no library.

// The routes this app knows about; the first URL segment picks the view.
export const ROUTES = ["active", "completed", "archived"];

// Turn a URL pathname into a route name (its first segment).
// Unknown paths fall back to "active".
export function matchRoute(pathname) {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  return ROUTES.includes(segment) ? segment : "active";
}

// Change the URL to "/<name>" WITHOUT reloading the page.
// pushState is what makes this a single-page app: the address bar updates and a
// history entry is added, but the browser never fetches a new document.
export function navigate(name) {
  history.pushState({ route: name }, "", "/" + name);
}

// Call `callback` with the matched route whenever the user presses the browser's
// back or forward button. Returns a cleanup function that removes the listener.
export function onPopState(callback) {
  const handler = () => callback(matchRoute(location.pathname));
  window.addEventListener("popstate", handler);
  return () => window.removeEventListener("popstate", handler);
}
