export type StoryType = keyof typeof StoryType;
const StoryType = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs",
} as const;

export interface PartialStory {
  id: number;
  comments_count: number;
  domain?: string;
  points?: number;
  time_ago: string;
  time: number;
  title: string;
  type: string;
  url: string;
  user?: string;
}
export interface Story {
  id: number;
  comments_count: number;
  comments: Comment[];
  domain: string;
  points: number;
  time_ago: string;
  time: number;
  title: string;
  type: string;
  url: string;
  user: string;
}

export interface Comment {
  id: number;
  comments: Comment[];
  content: string;
  level: number;
  time_ago: string;
  time: number;
  user: string;
}

export interface User {
  id: string;
  about?: string;
  created: number;
  karma: number;
  submitted: number[];
}

export function getUser(id: string) {
  return get<User>(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);
}

export function getStory(id: number) {
  return get<Story>(`https://api.hnpwa.com/v0/item/${id}.json`);
}

export function getStories(type: StoryType, page: number) {
  return get<PartialStory[]>(
    `https://api.hnpwa.com/v0/${StoryType[type]}/${page}.json`,
  );
}

async function get<T>(href: string | URL | Request) {
  // A bare GET is a CORS "simple request" — the browser skips the preflight.
  // (StackBlitz WebContainers proxy even server-side fetches through the browser,
  // and api.hnpwa.com rejects the preflight that a Content-Type header would force.)
  const res = await fetch(href);

  return res.json() as T;
}
