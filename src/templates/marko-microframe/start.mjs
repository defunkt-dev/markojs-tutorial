// Builds the remote once (so its assets are real files the host can proxy), then runs the
// remote in preview and the host in dev. Host stays live-editable; the remote's built assets
// are served through the host's /remote-assets/ proxy, so remote fragments can be interactive.
import { spawn } from "node:child_process";

const children = [];
function launch(name, args) {
  const child = spawn("pnpm", args, { stdio: "inherit" });
  child.on("exit", (code) => { console.log(`[${name}] exited with code ${code}`); shutdown(); });
  children.push(child);
}
async function waitFor(url, tries = 120) {
  for (let i = 0; i < tries; i++) { try { await fetch(url); return; } catch {} await new Promise((r) => setTimeout(r, 250)); }
}
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) { try { child.kill("SIGTERM"); } catch {} }
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Building the remote app…");
const build = spawn("pnpm", ["-C", "remote", "build"], { stdio: "inherit" });
build.on("exit", async (code) => {
  if (code !== 0) { console.error("Remote build failed."); process.exit(code ?? 1); }
  launch("remote", ["-C", "remote", "preview"]);
  await waitFor("http://localhost:3001/");
  launch("host", ["-C", "host", "dev"]);
});
