import { matchRoute } from "../../router.js";

// This catch-all handler runs for every path, so the server can render the
// correct starting view for a deep link (like /completed) or a page reload.
export function GET(context) {
  const url = new URL(context.request.url);
  context.route = matchRoute(url.pathname);
  context.serializedGlobals = ["route"];
}
