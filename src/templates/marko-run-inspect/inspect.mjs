// Builds your app UNMINIFIED into its own dist-inspect/ folder (so it never
// disturbs the live preview), then reports what reached the browser — grouped
// into what stayed on the server vs what shipped.
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";

console.log("Building your app (unminified) into dist-inspect/ …\n");
execSync("npx marko-run build --output dist-inspect", { stdio: "ignore" });

const dir = "dist-inspect/public/assets";
const jsFiles = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".js")) : [];
const js = jsFiles.map((f) => readFileSync(`${dir}/${f}`, "utf8")).join("\n");
const mine = js.split("//#region src/routes/+page.marko")[1]?.split("//#endregion")[0]?.trim();
const flag = (s) => (js.includes(s) ? "▸ SHIPPED    " : "· not shipped");

console.log("── Your page's client bundle (its own code, beyond the shared runtime) ──\n");
console.log(mine && mine.length ? mine : "(nothing — this page shipped NO page-specific client JavaScript)");

console.log("\n── Stayed on the server — NOT shipped ──");
console.log("  Static markup:");
for (const s of ["Premium wireless", "Battery life"]) console.log(`     ${flag(s)}  ${JSON.stringify(s)}`);
console.log("  Server-only computation (ran at render, result baked into the HTML):");
for (const s of ["formatPrice", "toFixed", "In stock"]) console.log(`     ${flag(s)}  ${JSON.stringify(s)}`);

console.log("\n── Shipped to the browser — runs on the client ──");
console.log("  The interactive piece:");
for (const s of ["likes", "click"]) console.log(`     ${flag(s)}  ${JSON.stringify(s)}`);
