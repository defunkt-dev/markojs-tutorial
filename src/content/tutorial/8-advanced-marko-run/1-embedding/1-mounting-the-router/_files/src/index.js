import express from "express";
import compression from "compression";
import { routerMiddleware } from "@marko/run-adapter-node/middleware";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(compression());

// An existing Express route — your own API, untouched by marko-run.
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Mount every marko-run page and route into this same Express app.
app.use(routerMiddleware());

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
