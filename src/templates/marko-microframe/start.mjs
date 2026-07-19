// Starts the remote (:3001) first, waits until it's listening, then the host (:3000),
// so the host never fetches the remote before it's up (avoids a blank first paint).
import { spawn } from "node:child_process";

const children = [];
function launch(name, args) {
  const child = spawn("pnpm", args, { stdio: "inherit" });
  child.on("exit", (code) => {
    console.log(`[${name}] exited with code ${code}`);
    shutdown();
  });
  children.push(child);
}
async function waitFor(url, tries = 100) {
  for (let i = 0; i < tries; i++) {
    try { await fetch(url); return true; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
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

launch("remote", ["-C", "remote", "dev"]);
await waitFor("http://localhost:3001/");
launch("host", ["-C", "host", "dev"]);
