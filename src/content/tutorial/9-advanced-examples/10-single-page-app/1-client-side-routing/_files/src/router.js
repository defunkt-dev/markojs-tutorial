// A tiny client-side router built directly on the browser History API — no library.

// The routes this app knows about; the first URL segment picks the view.
export const ROUTES = ["active", "completed", "archived"];

// Turn a URL pathname into a route name (its first segment).
// Unknown paths should fall back to "active".
export function matchRoute(pathname) {
  // TODO: take the first path segment ("/completed" -> "completed").
  // If it's one of ROUTES, return it; otherwise return "active".
  return "active";
}

// Change the URL to "/<name>" WITHOUT reloading the page.
export function navigate(name) {
  // TODO: use history.pushState to change the URL to "/" + name (no reload).
}

// Call `callback` with the matched route whenever the user presses back/forward.
// Return a cleanup function that removes the listener.
export function onPopState(callback) {
  // TODO: add a "popstate" listener that calls
  // callback(matchRoute(location.pathname)); return a function that removes it.
  return () => {};
}
