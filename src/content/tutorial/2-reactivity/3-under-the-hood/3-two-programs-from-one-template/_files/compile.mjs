import { compileFile } from "@marko/compiler";

// The same compiler your dev server uses. `output` picks the target:
// "html" for the server, "dom" for the browser.
const output = process.argv[2] ?? "html";
const { code } = await compileFile("src/tags/price-tag/index.marko", { output });

console.log(code);
