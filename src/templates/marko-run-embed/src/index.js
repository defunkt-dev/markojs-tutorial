import express from "express";
import compression from "compression";
import { routerMiddleware } from "@marko/run-adapter-node/middleware";

const PORT = process.env.PORT || 3000;

express()
  .use(compression())
  .use(routerMiddleware())
  .listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
