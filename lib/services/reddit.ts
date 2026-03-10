const REDDIT_BASE_URL = "https://www.reddit.com";

const RELEVANT_SUBREDDITS = [
  "entrepreneur",
  "startups", 
  "SaaS",
  "smallbusiness",
  "freelance",
  "Entrepreneurs",
  "business",
  "marketing",
  "webdev",
  "programming",
  "ProductManagement",
  "indiehackers",
];

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  subreddit: string;
  author: string;
  score: number;
  numComments: number;
  url: string;
  createdUtc: number;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  postId: string;
  subreddit: string;
}

export interface RedditSearchResult {
  posts: RedditPost[];
  comments: RedditComment[];
  totalContent: string[];
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "PainRadar/1.0 (pain point analysis tool)",
        },
      });
      
      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Max retries reached");
}

export async function searchReddit(query: string, limit = 50): Promise<RedditSearchResult> {
  const posts: RedditPost[] = [];
  const comments: RedditComment[] = [];
  const seenIds = new Set<string>();

  const searchTerms = [
    query,
    `${query} problem`,
    `${query} frustrating`,
    `${query} hate`,
    `${query} wish`,
    `${query} alternative`,
  ];

  for (const term of searchTerms.slice(0, 3)) {
    try {
      const encodedQuery = encodeURIComponent(term);
      const url = `${REDDIT_BASE_URL}/search.json?q=${encodedQuery}&sort=relevance&t=year&limit=25`;
      
      const response = await fetchWithRetry(url);
      if (!response.ok) continue;
      
      const data = await response.json();
      const children = data?.data?.children || [];
      
      for (const child of children) {
        const post = child.data;
        if (seenIds.has(post.id)) continue;
        seenIds.add(post.id);
        
        if (post.selftext === "[removed]" || post.selftext === "[deleted]") continue;
        
        posts.push({
          id: post.id,
          title: post.title || "",
          selftext: post.selftext || "",
          subreddit: post.subreddit || "",
          author: post.author || "[deleted]",
          score: post.score || 0,
          numComments: post.num_comments || 0,
          url: `https://reddit.com${post.permalink}`,
          createdUtc: post.created_utc || 0,
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error searching Reddit for "${term}":`, error);
    }
  }

  for (const subreddit of RELEVANT_SUBREDDITS.slice(0, 5)) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${REDDIT_BASE_URL}/r/${subreddit}/search.json?q=${encodedQuery}&restrict_sr=1&sort=relevance&t=year&limit=10`;
      
      const response = await fetchWithRetry(url);
      if (!response.ok) continue;
      
      const data = await response.json();
      const children = data?.data?.children || [];
      
      for (const child of children) {
        const post = child.data;
        if (seenIds.has(post.id)) continue;
        seenIds.add(post.id);
        
        if (post.selftext === "[removed]" || post.selftext === "[deleted]") continue;
        
        posts.push({
          id: post.id,
          title: post.title || "",
          selftext: post.selftext || "",
          subreddit: post.subreddit || "",
          author: post.author || "[deleted]",
          score: post.score || 0,
          numComments: post.num_comments || 0,
          url: `https://reddit.com${post.permalink}`,
          createdUtc: post.created_utc || 0,
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error searching r/${subreddit}:`, error);
    }
  }

  const topPosts = posts
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  for (const post of topPosts.slice(0, 8)) {
    try {
      const url = `${REDDIT_BASE_URL}/r/${post.subreddit}/comments/${post.id}.json?limit=50&sort=top`;
      
      const response = await fetchWithRetry(url);
      if (!response.ok) continue;
      
      const data = await response.json();
      const commentData = data[1]?.data?.children || [];
      
      const extractComments = (items: any[], depth = 0) => {
        if (depth > 2) return;
        
        for (const item of items) {
          if (item.kind !== "t1") continue;
          const comment = item.data;
          
          if (!comment.body || comment.body === "[removed]" || comment.body === "[deleted]") continue;
          if (comment.body.length < 50) continue;
          
          comments.push({
            id: comment.id,
            body: comment.body,
            author: comment.author || "[deleted]",
            score: comment.score || 0,
            postId: post.id,
            subreddit: post.subreddit,
          });
          
          if (comment.replies?.data?.children) {
            extractComments(comment.replies.data.children, depth + 1);
          }
        }
      };
      
      extractComments(commentData);
      await new Promise(resolve => setTimeout(resolve, 400));
    } catch (error) {
      console.error(`Error fetching comments for post ${post.id}:`, error);
    }
  }

  const sortedComments = comments
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

  const totalContent: string[] = [];
  
  for (const post of topPosts) {
    const content = `[POST in r/${post.subreddit}] ${post.title}\n${post.selftext}`.trim();
    if (content.length > 50) {
      totalContent.push(content);
    }
  }
  
  for (const comment of sortedComments) {
    const content = `[COMMENT in r/${comment.subreddit}] ${comment.body}`.trim();
    if (content.length > 50) {
      totalContent.push(content);
    }
  }

  return {
    posts: topPosts,
    comments: sortedComments,
    totalContent,
  };
}

export function formatRedditDataForAnalysis(result: RedditSearchResult): string {
  const lines: string[] = [];
  
  lines.push("=== REDDIT POSTS ===\n");
  for (const post of result.posts.slice(0, 10)) {
    lines.push(`[r/${post.subreddit}] (score: ${post.score})`);
    lines.push(`Title: ${post.title}`);
    if (post.selftext) {
      const text = post.selftext.slice(0, 500);
      lines.push(`Content: ${text}${post.selftext.length > 500 ? "..." : ""}`);
    }
    lines.push(`URL: ${post.url}`);
    lines.push("---");
  }
  
  lines.push("\n=== TOP COMMENTS ===\n");
  for (const comment of result.comments.slice(0, 30)) {
    lines.push(`[r/${comment.subreddit}] (score: ${comment.score})`);
    const text = comment.body.slice(0, 400);
    lines.push(`${text}${comment.body.length > 400 ? "..." : ""}`);
    lines.push("---");
  }
  
  return lines.join("\n");
}
