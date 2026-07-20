import type { RequestHandler } from "express";
import template from "./template.marko";

const handler: RequestHandler = async (req, res) => {
  // Vite's dev middleware hands us a raw Node request, so read the query
  // from the URL rather than req.query.
  const url = new URL(req.url ?? "/", "http://localhost");
  const mode = url.searchParams.get("mode") ?? "out-of-order";

  res.setHeader("content-type", "text/html; charset=utf-8");
  res.setHeader("cache-control", "no-cache");

  if (mode === "single-chunk") {
    // Awaiting the render buffers the whole page — nothing is sent until
    // every section has resolved. This opts out of streaming.
    const html = await template.render({ mode });
    res.end(html);
  } else {
    // .pipe(res) streams the render as it is produced.
    template.render({ mode }).pipe(res);
  }
};

export default handler;
