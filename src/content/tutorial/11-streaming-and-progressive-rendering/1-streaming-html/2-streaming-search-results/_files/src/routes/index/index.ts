import type { RequestHandler } from "express";
import template from "./template.marko";

const handler: RequestHandler = (_req, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  // .pipe(res) streams the render into the response as it is produced,
  // rather than buffering the whole page first.
  template.render({}).pipe(res);
};

export default handler;
