---
type: lesson
mainCommand: ['pnpm run build', 'Building the library']
title: Shipping It for Real
focus: /package.json
previews: false
---

# Shipping It for Real

Back in the library. It builds, and you've watched a real app consume it.
One question left: what actually goes in the box?

1. Run `pnpm build`, then ask the packer what it would ship:

   ```bash
   npm pack --dry-run
   ```

Read the **Tarball Contents** list carefully. It shipped `src/`. It shipped your tsconfigs. And
`dist/` — the built output, the entire point — **isn't in there at all**,
because `dist` is gitignored and npm falls back to your ignore rules when
you don't tell it otherwise. The package contains precisely the wrong half
of the project.

2. Add the allowlist to `package.json`:

   ```json
   "files": ["dist", "marko.json", "README.md"],
   ```
3. Run `npm pack --dry-run` again. Now it's `dist/tags/**`, `marko.json`,
   `package.json`. Nothing else — and that list is the box.

That's `npm publish` rehearsed. The only step left is the publish itself,
which needs an account and a name nobody has taken — and which does exactly
what you just watched, to a registry instead of a file.

**Two lines you cannot test from in here.** Both shipped broken in real
published packages, past fully green test suites, and the reason they got
through is the same in both cases: nothing inside the repo ever resolves the
package the way a stranger does.

**`sideEffects`.** Marko templates register their renderers as a module side
effect. Say `"sideEffects": false` — which is correct in most JS packages,
and arrives by copying a React one — and a production bundler is licensed to
drop a tag's client module whenever the page never calls a *function* from
your package. A page that only *displays* your tag is exactly that page. The
server sends HTML whose resume payload points at registrations that never
ran, and the browser throws `effects[(i++)] is not a function` and hydrates
nothing. Dev mode is fine. Every dev-mode test is fine. The correct value is
`["**/*.marko"]`, which is already in this file.

**The `"./dist/tags/*"` export.** When a consumer's app builds, Marko's
compiler rewrites each discovered tag into a bare specifier through your
package — `marko-fancy/dist/tags/fancy-badge/index.marko` — and their
bundler resolves it through your `exports` map. Without that one line, every
real consumer *build* fails with `Missing "./dist/tags/..." specifier`,
while dev servers and type-checks stay perfectly green.

:::info
The only thing that catches either bug: pack the package, install the
tarball in a fresh app outside the repo, use a tag by bare name, and run a
**production build and preview** — not just the dev server. That's exactly
what the previous lesson's project was, and why it exists.
:::

:::tip
**When you pack for real, use `pnpm pack`, not `npm pack`.** Asking npm what
it *would* ship, as you just did, is safe — it writes nothing. But actually
packing with npm inside a workspace repo writes `workspace:*` into the
published dependencies verbatim, and the consumer's install then dies on an
unsupported protocol — surfacing as the wonderfully misleading
`Unable to find entry point for custom tag`. `pnpm pack` rewrites those to
real version numbers, exactly as the publish pipeline does.
:::

That's the chapter, and the part. You can type a Marko app, test it, look at
it, lint it, build it into a package, and hand that package to a stranger
who types one tag name and gets your work — with the types.
