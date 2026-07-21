// Tutorial-only: reports the current path (incl. query string) to the preview's
// address bar, so you can watch the URL change as you navigate — menu links and
// pagination use ?stories=/&page=, so we include location.search. A normal app
// wouldn't include this file at all.
window.parent.postMessage(
  { type: "tk-url", pathname: location.pathname + location.search },
  "*",
);
