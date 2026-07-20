import type { RequestHandler } from "express";

// TODO: render the Marko template instead of this placeholder.
// A .marko file's default export has a .render() method — import the
// template and pipe its result into the response.
const handler: RequestHandler = (_req, res) => {
  res.setHeader("content-type", "text/html");
  res.end("<p>This route sends plain text — it isn't rendering the Marko template yet.</p>");
};

export default handler;
