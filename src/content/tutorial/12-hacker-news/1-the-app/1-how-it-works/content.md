---
type: lesson
template: marko-hackernews
title: How It Works
focus: /src/routes/+page.marko
previews:
  - [3000, 'Hacker News']
mainCommand: ['pnpm run dev', 'Starting the Hacker News app']
---

# The Hacker News App

This is a working [Hacker News](https://news.ycombinator.com) reader — the
classic benchmark app that every framework builds — written in Marko. It's
live in the preview: browse the feed, open a story to read its comments,
click a username. It fetches real data from Hacker News as you navigate.

It's also a tour of nearly everything in this tutorial, in one small
codebase. Nothing here is new — you've met every piece. What's worth seeing
is how little there is.

## File-based routing

The whole site is four files in `src/routes/` (part five):

- **`+layout.marko`** — the shared shell: the `<head>`, the nav bar, and
  `<${input.content}/>`, where each page renders.
- **`+page.marko`** — the story list at `/`. It reads `?stories=` and
  `?page=` from `$global.url` to choose the feed and page.
- **`story.$id+page.marko`** — one story at `/story/123`. The `$id` in the
  filename is the dynamic segment, read from `$global.params.id`.
- **`user.$id+page.marko`** — a profile at `/user/pg`.

No router config, no route table — the filenames *are* the routes.

## The data stays on the server

Open `src/api/index.ts`. It's pulled in with **`server import`** (part
five), so this code — and every fetch it makes — **only ever runs on the
server** and never ships to the browser. `getStories`, `getStory`, and
`getUser` each request a Hacker News API and return fully typed data.

## The list streams in

In `+page.marko`, the feed is wrapped in an **`<await>`** (part three):

```marko
<await|storyList|=getStories(stories, page)>
  <for|story| of=storyList>
    <story story=story/>
  </for>
</await>
```

The shell — nav and pagination — flushes to the browser immediately, and
the story list streams in the moment the API answers. That's HTML streaming
(part eleven), for free, just from using `<await>`.

## Comments are recursive

Hacker News threads nest arbitrarily deep. Open `src/tags/comment.marko` and
notice it **renders itself**:

```marko
<for|nested| of=input.comment.comments>
  <comment comment=nested/>
</for>
```

A component that includes its own tag is how you render a tree of unknown
depth. Each comment also has a `[-]` toggle — a small interactive
`<let/open>` (part two) — to collapse its replies.

## Almost no JavaScript ships

Here's the payoff. Think back to the *Fine-Grained Bundling* lesson, then
look at what each route actually sends:

- The **story list** and **user page** ship **0 kB** of client JavaScript —
  pure server-rendered HTML, nothing to hydrate.
- The **story page** ships a couple of kilobytes: just enough for the
  comment-collapse toggles, and nothing else.

You wrote a full, data-driven, multi-page application, and the browser
downloads almost nothing. And when you're ready to ship it, marko-run's
[adapters](/8-advanced-marko-run/3-deployment/1-deploying-with-adapters)
build this same code for Node, static hosting, serverless, or the edge — no
rewrite (part eight).

## Explore

The code is all here, and this lesson is read-only — poke around. Follow a
story from the list into `story.$id+page.marko`, watch how `story.marko`
renders a row, trace a request through `src/api/index.ts`. As you navigate,
watch the preview's address bar: the URL changes with each page (`/`,
`/story/…`, `/user/…`) — file-based routing at work. When you go to build
one of your own, `src/routes/` and an `<await>` is genuinely most of what it
takes.
