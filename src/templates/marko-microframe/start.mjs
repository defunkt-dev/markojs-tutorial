// Starts the host (:3000) and remote (:3001) dev servers together.
// Used as the workspace's dev command so both apps run in one preview session.
import { spawn } from "node:child_process";

const servers = [
  { name: "remote", args: ["-C", "remote", "dev"] },
  { name: "host", args: ["-C", "host", "dev"] },
];

const children = servers.map(({ name, args }) =>
  spawn("pnpm", args, { stdio: "inherit" }).on("exit", (code) => {
    console.log(`[${name}] exited with code ${code}`);
    shutdown();
  }),
);

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try { child.kill("SIGTERM"); } catch {}
  }
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
