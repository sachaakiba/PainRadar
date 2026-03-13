const REDDIT_USER_AGENT = "PainRadar/1.0 (SaaS pain point discovery)";
const SEARCH_LIMIT = 25;
const COMMENT_LIMIT = 10;

export interface RedditPost {
  title: string;
  selftext: string;
  subreddit: string;
  score: number;
  numComments: number;
  url: string;
  permalink: string;
  topComments: RedditComment[];
}

export interface RedditComment {
  body: string;
  score: number;
  author: string;
}

async function redditFetch(url: string): Promise<Response> {
  const res = await fetch(url, {
    headers: { "User-Agent": REDDIT_USER_AGENT },
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") ?? "5", 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return redditFetch(url);
  }

  if (!res.ok) {
    throw new Error(`Reddit API error: ${res.status} ${res.statusText}`);
  }

  return res;
}

export async function fetchRedditPosts(
  topic: string,
  audience?: string
): Promise<RedditPost[]> {
  const query = audience ? `${topic} ${audience}` : topic;
  const encoded = encodeURIComponent(query);
  const searchUrl = `https://www.reddit.com/search.json?q=${encoded}&sort=relevance&limit=${SEARCH_LIMIT}&t=year`;

  const res = await redditFetch(searchUrl);
  const data = await res.json();

  const listings = data?.data?.children ?? [];

  const posts: RedditPost[] = listings
    .filter((child: any) => child.kind === "t3")
    .map((child: any) => {
      const d = child.data;
      return {
        title: d.title ?? "",
        selftext: (d.selftext ?? "").slice(0, 2000),
        subreddit: d.subreddit ?? "",
        score: d.score ?? 0,
        numComments: d.num_comments ?? 0,
        url: d.url ?? "",
        permalink: d.permalink ?? "",
        topComments: [],
      };
    });

  const topPosts = posts
    .sort((a, b) => b.score + b.numComments - (a.score + a.numComments))
    .slice(0, 8);

  const postsWithComments = await Promise.all(
    topPosts.slice(0, 5).map(async (post) => {
      try {
        const commentsUrl = `https://www.reddit.com${post.permalink}.json?limit=${COMMENT_LIMIT}&sort=top`;
        const commentsRes = await redditFetch(commentsUrl);
        const commentsData = await commentsRes.json();

        const commentListing = commentsData?.[1]?.data?.children ?? [];
        post.topComments = commentListing
          .filter((c: any) => c.kind === "t1" && c.data?.body)
          .slice(0, COMMENT_LIMIT)
          .map((c: any) => ({
            body: (c.data.body ?? "").slice(0, 1000),
            score: c.data.score ?? 0,
            author: c.data.author ?? "[deleted]",
          }));
      } catch {
        // skip comments on error
      }
      return post;
    })
  );

  const remaining = topPosts.slice(5);
  return [...postsWithComments, ...remaining];
}

export function formatRedditDataForPrompt(posts: RedditPost[]): string {
  if (posts.length === 0) {
    return "No Reddit posts found for this topic.";
  }

  return posts
    .map((post, i) => {
      let text = `### Post ${i + 1}: "${post.title}" (r/${post.subreddit}, score: ${post.score})\n`;
      if (post.selftext) {
        text += `Content: ${post.selftext}\n`;
      }
      if (post.topComments.length > 0) {
        text += `Top comments:\n`;
        post.topComments.forEach((c) => {
          text += `- [${c.author}, score: ${c.score}]: ${c.body}\n`;
        });
      }
      text += `URL: https://reddit.com${post.permalink}\n`;
      return text;
    })
    .join("\n---\n\n");
}
