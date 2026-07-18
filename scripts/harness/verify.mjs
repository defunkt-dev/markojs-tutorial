#!/usr/bin/env node
// Tutorial verification harness.
//
// Walks every lesson in src/content/tutorial, resolves each one's template
// and commands the way TutorialKit does, materialises each state
// (_files and _solution) into a scratch copy of that template, and runs the
// checks declared for it. Its whole reason to exist: "verify before
// shipping" is this project's core rule, and until now it lived only in a
// session doc and got re-derived by hand every time.
//
// Usage:
//   node scripts/harness/verify.mjs                 # every lesson
//   node scripts/harness/verify.mjs 6-tooling       # only paths containing this
//   node scripts/harness/verify.mjs --list          # list what it WOULD run
//   node scripts/harness/verify.mjs --keep          # leave scratch dirs for inspection
//
// A lesson opts into checks with an entry in scripts/harness/checks.yaml,
// keyed by its path under src/content/tutorial (see the README). A lesson
// with no entry is still built (both states must compile) but asserted no
// further, and is reported as BUILD-ONLY so the gaps are visible rather than
// silent.
//
// (Config used to live in a `harness:` block in each content.md's
// frontmatter, but Astro's content-collection schema rejects unknown keys
// and it broke the site build — session 4 O32. The sidecar lives outside
// src/content, so Astro never sees it.)

import { readFileSync, readdirSync, statSync, rmSync, cpSync, mkdirSync, existsSync, symlinkSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..");
const TUT = join(REPO, "src", "content", "tutorial");
const TEMPLATES = join(REPO, "src", "templates");
const SCRATCH = join(REPO, ".harness-scratch");

const args = process.argv.slice(2);
const LIST_ONLY = args.includes("--list");
const KEEP = args.includes("--keep");
const filter = args.find((a) => !a.startsWith("--"));

// ---------- package manager ----------
// The harness shells out to install/build/test commands. It must use the
// package manager the repo actually uses, not the one the harness author
// happened to have. Detect it from the repo's lockfile: a pnpm-lock.yaml
// means pnpm, otherwise npm. Override with --pm=<name> if needed.
const pmArg = args.find((a) => a.startsWith("--pm="));
const PM = pmArg
  ? pmArg.slice(5)
  : existsSync(join(REPO, "pnpm-lock.yaml")) && !existsSync(join(REPO, "package-lock.json"))
    ? "pnpm"
    : "npm";
// npm needs `run` for scripts and `exec` for binaries, same as pnpm; the only
// difference that bites here is `npm exec <bin>` wants the bin installed,
// which it is. `npm install` has no --prefer-offline-by-default but accepts
// the flag. So the command strings are identical apart from the leading word.
const PM_INSTALL = PM === "pnpm" ? "pnpm install --prefer-offline" : "npm install --prefer-offline --no-audit --no-fund";
const PM_RUN = `${PM} run`;
const PM_EXEC = PM === "pnpm" ? "pnpm exec" : "npx";

// ---------- the container's actual shell (ls /bin, session 4 O28) ----------
// The tutorial runs in a WebContainer whose shell has a deliberately reduced
// /bin. A lesson that tells the learner to run a command absent here will
// dead-end them. This list is the ground truth; update it only from a real
// `ls /bin` in the container, never from a dev machine.
const CONTAINER_BIN = new Set([
  "bash", "cat", "chmod", "cp", "echo", "hostname", "jsh", "kill", "ln",
  "ls", "mkdir", "mv", "ps", "pwd", "rm", "rmdir", "sh", "xxd", "zsh",
]);
// Things that reach the shell but aren't in /bin: node/npm/npx/pnpm are the
// runtime, not shell builtins, and are always available. cd/export/etc. are
// shell keywords. Everything else in a fenced ```bash block is suspect.
const SHELL_OK = new Set([
  "node", "npm", "npx", "pnpm", "cd", "export", "echo", "for", "do", "done",
  "if", "then", "fi", "&&", "||", "|", ";", "then",
]);

// ---------- frontmatter reader ----------
// Uses the `yaml` package that already ships in the tutorial's own
// dependencies. A hand-rolled parser was tried first and got the nesting
// wrong — it only handled one level, so every nested check (command.run,
// pack._files.includes) silently read `undefined` and the harness passed
// broken lessons. The lesson there is exactly the one this whole harness is
// about: don't reimplement a solved thing badly when the real one is present.
import YAML from "yaml";
function frontmatter(md) {
  if (!md.startsWith("---")) return {};
  const end = md.indexOf("\n---", 3);
  if (end === -1) return {};
  try {
    return YAML.parse(md.slice(3, end)) || {};
  } catch {
    return {};
  }
}

// ---------- checks sidecar (replaces the old `harness:` frontmatter block) ----------
// Per-lesson checks now live in one file OUTSIDE src/content, keyed by lesson
// path (the same relative path `--list` prints), so Astro's schema never
// rejects them (session 4 O32). A lesson with no entry here is built and no
// more. The value under a key is exactly what used to sit under `harness:`.
const CHECKS_FILE = join(__dirname, "checks.yaml");
const CHECKS = existsSync(CHECKS_FILE) ? (YAML.parse(readFileSync(CHECKS_FILE, "utf8")) || {}) : {};
function checksFor(rel) {
  return CHECKS[rel] || CHECKS[rel.replace(/\\/g, "/")] || null;
}

// ---------- template resolution: nearest declaration up the tree ----------
// Mirrors TutorialKit: a lesson's template is the closest `template:` in its
// own frontmatter, else its chapter's meta.md, else its part's, else the
// tutorial root's. Getting this wrong means testing a lesson against the
// wrong template, so it walks the real directory chain.
function resolveMeta(lessonDir, key) {
  let dir = lessonDir;
  while (dir.startsWith(TUT) || dir === TUT) {
    for (const name of ["content.md", "meta.md"]) {
      const f = join(dir, name);
      if (existsSync(f)) {
        const fm = frontmatter(readFileSync(f, "utf8"));
        if (fm[key] !== undefined) return fm[key];
      }
    }
    if (dir === TUT) break;
    dir = dirname(dir);
  }
  return undefined;
}

// ---------- discover lessons ----------
function findLessons(root) {
  const out = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (!statSync(full).isDirectory()) continue;
      if (existsSync(join(full, "content.md"))) out.push(full);
      else walk(full);
    }
  })(root);
  return out.sort();
}

// ---------- shell-command lint (O28) ----------
// Scans every ```bash fenced block in the lesson prose and flags any leading
// command token that is neither in the container's /bin nor an always-present
// runtime/keyword. Catches "tar -tzf ...", "grep ...", "sed ..." before a
// learner hits `command not found`.
function lintShellCommands(md) {
  const problems = [];
  const fences = md.matchAll(/```(?:bash|sh|shell)\n([\s\S]*?)```/g);
  for (const [, block] of fences) {
    // join backslash line-continuations first, so a wrapped multi-line command
    // reads as one line (else a continuation like "  --plugin=x" is mistaken
    // for a command whose name is the flag).
    for (const rawLine of block.replace(/\\\n\s*/g, " ").split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      // first bare word on the line (or after a pipe/&&)
      for (const seg of line.split(/\|\||\||&&|;/)) {
        const tok = seg.trim().split(/\s+/)[0];
        if (!tok) continue;
        if (tok.startsWith("-")) continue; // a flag/continuation, not a command
        if (CONTAINER_BIN.has(tok) || SHELL_OK.has(tok)) continue;
        // node/npm/etc handled; anything else is a real shell command name
        problems.push(tok);
      }
    }
  }
  return [...new Set(problems)];
}

// ---------- run a command in a directory ----------
function run(cmd, cwd, timeoutMs = 240000) {
  // `bash -c`, NOT `-lc`. A login shell (`-l`) rebuilds PATH from the login
  // profiles (~/.bash_profile etc.); on macOS with nvm/homebrew — where npm is
  // on the ~/.zshrc PATH, not the login-bash one — that DROPS the npm this
  // process was launched with, and every scratch command dies "command not
  // found" (session 4 O31/O32's exit 127). `-c` inherits the working PATH the
  // harness already has (it was started with `npm run verify`, so npm is on it).
  const r = spawnSync("bash", ["-c", cmd], { cwd, encoding: "utf8", timeout: timeoutMs });
  return { code: r.status ?? -1, out: (r.stdout || "") + (r.stderr || "") };
}

// last few non-empty lines of output — so a failure prints its actual cause
// (e.g. "npm: command not found") instead of a bare "build exited 127".
function lastLines(out, n = 4) {
  return (out || "").split("\n").map((l) => l.trim()).filter(Boolean).slice(-n).join("  |  ") || "(no output)";
}

// ---------- boot a dev server, curl it, kill it ----------
async function curlServer(cwd, cmd, port, path = "/") {
  const child = spawn("bash", ["-c", cmd], { cwd, detached: true });
  try {
    for (let i = 0; i < 60; i++) {
      const r = spawnSync("bash", ["-c", `curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}${path}`], { encoding: "utf8" });
      if (r.stdout && r.stdout !== "000") break;
      await new Promise((s) => setTimeout(s, 500));
    }
    const status = spawnSync("bash", ["-c", `curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}${path}`], { encoding: "utf8" }).stdout;
    const body = spawnSync("bash", ["-c", `curl -s http://localhost:${port}${path}`], { encoding: "utf8" }).stdout;
    return { status, body };
  } finally {
    try { process.kill(-child.pid, "SIGKILL"); } catch {}
  }
}

// ---------- materialise a state into a scratch template ----------
function materialise(templateName, stateDir, label) {
  const src = join(TEMPLATES, templateName);
  if (!existsSync(src)) throw new Error(`template not found: ${templateName}`);
  const dest = join(SCRATCH, `${templateName}__${label}`);
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  if (existsSync(stateDir)) cpSync(stateDir, dest, { recursive: true });
  return dest;
}

// ---------- per-template install cache ----------
// The harness used to run a full `npm install` for EVERY state (~200 of them),
// which was the bulk of its runtime. All states of a given template share the
// same package.json, so install each template's node_modules exactly once into
// a cache dir and symlink it into every state's scratch. Returns { dir } on
// success or { failed } once, cached, so a broken install isn't retried per
// state. (Verified: marko-run builds + SSRs fine off a symlinked node_modules.)
const nmCache = new Map();
function ensureInstalled(template) {
  if (nmCache.has(template)) return nmCache.get(template);
  const dir = join(SCRATCH, `__nm__${template}`);
  rmSync(dir, { recursive: true, force: true });
  cpSync(join(TEMPLATES, template), dir, { recursive: true });
  const inst = run(PM_INSTALL, dir, 600000);
  const entry = inst.code === 0 ? { dir } : { failed: `install exited ${inst.code}: ${lastLines(inst.out)}` };
  nmCache.set(template, entry);
  return entry;
}
function linkModules(dest, cacheDir) {
  const link = join(dest, "node_modules");
  rmSync(link, { recursive: true, force: true });
  symlinkSync(join(cacheDir, "node_modules"), link, "dir");
}

// ---------- the checks ----------
// Each check is declared in the lesson's `harness:` block. They are all
// optional; a lesson with none is built and no more. The vocabulary is
// deliberately small and matches the failure classes this project has
// actually hit — every one traces to a real bug in the session log.
async function runChecks(lesson, results) {
  const md = readFileSync(join(lesson, "content.md"), "utf8");
  const rel = relative(TUT, lesson);
  const template = resolveMeta(lesson, "template") || "marko-run";
  const h = checksFor(rel) || {};

  // 0. shell-command lint always runs (O28) — free, and catches a whole class.
  const badCmds = lintShellCommands(md);
  if (badCmds.length) {
    results.fail.push(`${rel}: shell command(s) not in container /bin: ${badCmds.join(", ")}`);
  }

  const states = h.states || ["_files", "_solution"];

  for (const state of states) {
    const stateDir = join(lesson, state);
    if (!existsSync(stateDir)) continue;
    const dest = materialise(template, stateDir, `${rel.replace(/[\/\\]/g, "_")}__${state}`);

    // install once per template (cached), then symlink it in — every check
    // below needs node_modules.
    const nm = ensureInstalled(template);
    if (nm.failed) { results.fail.push(`${rel} [${state}]: template ${template} ${nm.failed}`); continue; }
    linkModules(dest, nm.dir);

    // build — every state must compile, UNLESS the template has no build script
    // (e.g. marko-storybook runs storybook, it doesn't `build`) or the lesson
    // declares this state's build is EXPECTED to fail: a planted compile error
    // the learner fixes, the build-time twin of a red test state.
    if (h.build !== false) {
      const pkg = JSON.parse(readFileSync(join(dest, "package.json"), "utf8"));
      if (pkg.scripts && pkg.scripts.build) {
        const expect = (h.build && typeof h.build === "object" && h.build[state]) || "pass";
        const b = run(`${PM_RUN} build`, dest);
        const built = b.code === 0;
        if (expect === "fail") {
          if (built) results.fail.push(`${rel} [${state}]: build was expected to FAIL (planted error) but it compiled`);
          continue; // broken-by-design state — nothing further to check
        }
        if (!built) {
          results.fail.push(`${rel} [${state}]: build exited ${b.code}: ${lastLines(b.out)}`);
          continue;
        }
      }
    }

    // ssr: curl the dev server, assert status and (optionally) text.
    // Per-state config may be a bare string (asserted present) or an object
    // { contains, absent, status }. Both forms are accepted so a lesson can
    // write whichever reads clearer.
    if (h.ssr) {
      const port = h.ssr.port || 3000;
      const cmd = h.ssr.command || `${PM_RUN} dev`;
      const perState = h.ssr[state];
      const cfg = (perState && typeof perState === "object") ? perState : {};
      const { status, body } = await curlServer(dest, cmd, port, cfg.path || h.ssr.path || "/");
      const want = String(cfg.status || h.ssr.status || 200);
      if (status !== want) results.fail.push(`${rel} [${state}]: SSR ${status}, wanted ${want}`);
      const contains = typeof perState === "string" ? perState : (cfg.contains ?? h.ssr.contains);
      if (contains && !body.includes(contains)) results.fail.push(`${rel} [${state}]: SSR body missing ${JSON.stringify(contains)}`);
      const absent = cfg.absent ?? h.ssr[`${state}_absent`] ?? h.ssr.absent;
      if (absent && body.includes(absent)) results.fail.push(`${rel} [${state}]: SSR body should NOT contain ${JSON.stringify(absent)}`);
    }

    // test: run a suite, assert it PASSES or FAILS as declared per state.
    // Planted-mistake lessons are only worth anything if the red state is red.
    if (h.test) {
      const t = run(`${h.test.command || `${PM_EXEC} vitest run`} 2>&1`, dest);
      const expectPass = (h.test[state] ?? "pass") === "pass";
      const passed = t.code === 0;
      if (passed !== expectPass) {
        results.fail.push(`${rel} [${state}]: tests ${passed ? "passed" : "failed"}, expected ${expectPass ? "pass" : "fail"}`);
      }
      // storybook cache is a stateful liar (O20): if this lesson uses stories,
      // the .cache must be gone before the run to avoid a stale index.
      if (h.test.clearStorybookCache) {
        rmSync(join(dest, "node_modules", ".cache"), { recursive: true, force: true });
      }
    }

    // typecheck: run mtc, assert exit code AND expected TS error code (J2).
    if (h.typecheck) {
      const tc = run(`${h.typecheck.command || `${PM_EXEC} mtc`} 2>&1`, dest);
      const wantClean = (h.typecheck[state] ?? "clean") === "clean";
      if (wantClean && tc.code !== 0) results.fail.push(`${rel} [${state}]: mtc expected clean, exited ${tc.code}`);
      if (!wantClean) {
        if (tc.code === 0) results.fail.push(`${rel} [${state}]: mtc expected an error, exited 0`);
        const wantCode = h.typecheck[`${state}_code`] || h.typecheck.code;
        if (wantCode && !tc.out.includes(wantCode)) results.fail.push(`${rel} [${state}]: mtc missing ${wantCode}`);
      }
    }

    // emit: after a build, assert the tag emit shape (mtc emit mode).
    if (h.emit) {
      for (const f of (h.emit.files || [])) {
        if (!existsSync(join(dest, f))) results.fail.push(`${rel} [${state}]: emit missing ${f}`);
      }
      if (h.emit.strippedInterfaceIn) {
        const emitted = readFileSync(join(dest, h.emit.strippedInterfaceIn), "utf8");
        if (emitted.includes("export interface Input")) results.fail.push(`${rel} [${state}]: ${h.emit.strippedInterfaceIn} still has interface (not stripped)`);
      }
    }

    // pack: assert exactly the files a `pnpm pack` would ship (and would NOT).
    if (h.pack) {
      const p = run("npm pack --dry-run 2>&1", dest);
      for (const f of (h.pack[state]?.includes || h.pack.includes || [])) {
        if (!p.out.includes(f)) results.fail.push(`${rel} [${state}]: pack missing ${f}`);
      }
      for (const f of (h.pack[state]?.excludes || h.pack.excludes || [])) {
        if (p.out.includes(f)) results.fail.push(`${rel} [${state}]: pack should NOT ship ${f}`);
      }
    }

    // command: run an arbitrary command, assert stdout contains/omits strings.
    // The escape hatch for one-offs like the compile.mjs walk-string check.
    if (h.command) {
      const c = run(`${h.command.run} 2>&1`, dest);
      const want = h.command[state]?.contains ?? h.command.contains;
      if (want && !c.out.includes(want)) results.fail.push(`${rel} [${state}]: command output missing ${JSON.stringify(want)}`);
      const no = h.command[state]?.absent ?? h.command.absent;
      if (no && c.out.includes(no)) results.fail.push(`${rel} [${state}]: command output should omit ${JSON.stringify(no)}`);
    }

    if (!KEEP) rmSync(dest, { recursive: true, force: true });
  }

  // leak-check the packed template JSON isn't possible without a full astro
  // build; instead, assert the TEMPLATE dir itself carries no build litter,
  // which is the same failure (O26) at its source.
  if (h.templateClean !== false) {
    const tdir = join(TEMPLATES, template);
    const litter = [];
    (function scan(d, base = "") {
      for (const n of readdirSync(d)) {
        const rel2 = base ? `${base}/${n}` : n;
        if (n === "node_modules" || rel2 === "dist" || rel2.startsWith("dist/") || n === ".marko-run" || n.endsWith(".tsbuildinfo")) {
          if (!(template === "marko-consumer" && n.endsWith(".tgz"))) litter.push(rel2);
          continue;
        }
        const full = join(d, n);
        if (statSync(full).isDirectory()) scan(full, rel2);
      }
    })(tdir);
    if (litter.length) results.warn.push(`template ${template}: build litter present: ${litter.join(", ")}`);
  }
}

// ---------- main ----------
(async function main() {
  const all = findLessons(TUT).filter((l) => !filter || relative(TUT, l).includes(filter));

  if (LIST_ONLY) {
    for (const l of all) {
      const rel = relative(TUT, l);
      const tmpl = resolveMeta(l, "template") || "marko-run";
      const cfg = checksFor(rel);
      const checks = cfg ? Object.keys(cfg).filter((k) => k !== "states").join(",") : "build-only";
      console.log(`  ${rel.padEnd(64)} ${tmpl.padEnd(16)} ${checks}`);
    }
    console.log(`\n  ${all.length} lessons`);
    return;
  }

  rmSync(SCRATCH, { recursive: true, force: true });
  mkdirSync(SCRATCH, { recursive: true });

  console.log(`\nusing package manager: ${PM}\n`);
  const results = { fail: [], warn: [], buildOnly: [] };
  let n = 0;
  for (const lesson of all) {
    const rel = relative(TUT, lesson);
    process.stdout.write(`[${++n}/${all.length}] ${rel} ... `);
    try {
      const before = results.fail.length;
      await runChecks(lesson, results);
      if (!checksFor(rel)) results.buildOnly.push(rel);
      console.log(results.fail.length === before ? "ok" : "FAIL");
    } catch (e) {
      results.fail.push(`${rel}: harness error: ${e.message}`);
      console.log("ERROR");
    }
  }

  if (!KEEP) rmSync(SCRATCH, { recursive: true, force: true });

  console.log("\n" + "=".repeat(64));
  if (results.warn.length) {
    console.log(`\nWARNINGS (${results.warn.length}):`);
    for (const w of results.warn) console.log(`  ! ${w}`);
  }
  if (results.buildOnly.length) {
    console.log(`\nBUILD-ONLY, no assertions declared (${results.buildOnly.length}):`);
    for (const b of results.buildOnly) console.log(`  - ${b}`);
  }
  if (results.fail.length) {
    console.log(`\nFAILURES (${results.fail.length}):`);
    for (const f of results.fail) console.log(`  ✗ ${f}`);
    console.log("");
    process.exit(1);
  }
  console.log(`\nAll ${all.length} lessons pass.\n`);
})();
