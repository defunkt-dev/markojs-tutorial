// The remote's assets are referenced under this path. It's a path the HOST serves (via a
// proxy), so when the remote's HTML is embedded in the host, the browser loads the assets
// from the host — which it can always reach.
globalThis.__MY_ASSET_BASE_PATH__ = "/remote-assets/";
export default async function (context, next) { return next(); }
