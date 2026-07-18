# Deploying the Marko tutorial to Netlify

This bundle contains the two config files the tutorial needs to run when
hosted, plus this guide. The tutorial is a static site (Astro/TutorialKit),
so hosting is simple — with exactly one catch, explained below.

## What's in this bundle

- **`netlify.toml`** → goes in your repo **root**. Tells Netlify how to build
  (`npm run build`, publish `dist/`) and — critically — sends the two headers
  the lessons need.
- **`_headers`** → goes in your repo's **`public/`** folder. A portable,
  host-agnostic copy of the same headers (works on Cloudflare Pages too). The
  build copies it into `dist/` automatically.

Drop both into your repo, commit, and you're ready to deploy.

## The one thing that matters: the headers

TutorialKit runs each lesson inside a **WebContainer** (the in-browser Node
that powers the terminal and preview). WebContainers only work when the page
is "cross-origin isolated," which the browser grants **only** if the server
sends these two headers:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

TutorialKit sets these on its **dev** server for you — which is why `npm run
dev` works locally. But a production build is just static files with **no
server**, so the **host** has to send them. If it doesn't, the deployed site
loads fine, the lesson text shows fine, and every terminal and preview
**silently fails to boot**. That is the single failure mode to watch for, and
the two files in this bundle are what prevent it.

## Part 1 — deploy free, look, before buying anything

You get a live `something.netlify.app` URL with no domain purchased.

1. Push your repo to GitHub (if it isn't already).
2. Go to **app.netlify.com** → **Add new site** → **Import an existing
   project** → pick your GitHub repo.
3. Netlify reads `netlify.toml`, so build command and publish dir are already
   filled in. Just confirm and **Deploy**.
4. Wait ~2 minutes. You get a URL like `marko-tutorial-abc123.netlify.app`.

**Now test the thing that can silently break:** open the deployed URL, go to
any lesson, and confirm the **terminal comes alive and a preview renders**. If
it does, the headers are working and you're done. If the terminal is blank or
the preview never loads, the headers didn't apply — check that `netlify.toml`
is in the repo root and redeploy.

Every `git push` from here rebuilds and redeploys automatically.

## Part 2 — attach your domain (after you've bought it)

The site doesn't move. You're just giving it a nicer name.

1. Buy the domain (any registrar; Netlify can also sell you one directly,
   which skips the DNS step below).
2. In your Netlify site: **Domain management** → **Add a domain** → type your
   domain.
3. Netlify shows you what DNS records to set. Two common paths:
   - **Domain bought at Netlify** → nothing to do, it's automatic.
   - **Domain bought elsewhere** → either point the registrar's nameservers
     at Netlify (Netlify gives you the addresses), or add the CNAME/A records
     Netlify lists. The panel walks you through whichever you pick.
4. HTTPS is provisioned automatically once DNS resolves (minutes to a couple
   hours).

That's it. Free preview first, domain whenever you're ready, no rework
between the two.

## If you use Cloudflare Pages instead

The `_headers` file already works there (that's why it's included). Set the
build command to `npm run build` and the output dir to `dist` in the Pages
project settings. Same header caveat, same test: confirm a lesson boots on
the deployed URL.
