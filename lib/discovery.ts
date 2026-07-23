/**
 * Discussion discovery — multi-source retrieval of real user complaints.
 *
 * Replaces the old unauthenticated Reddit `.json` scraping (lib/reddit.ts),
 * which Reddit now blocks (403/429) from datacenter IPs. Uses Tavily, a
 * web-search API built for LLM pipelines, so results come from Reddit AND
 * forums AND review sites — matching the product's "Reddit, forums, reviews"
 * promise — and remain reliable from serverless.
 *
 * The provider is isolated behind `fetchDiscussions` so it can be swapped
 * (Exa, Reddit OAuth, …) without touching the analysis pipeline.
 */

export type DiscussionSourceType = "reddit" | "forum" | "review" | "web";

export interface Discussion {
  title: string;
  content: string;
  url: string;
  sourceName: string;
  sourceType: DiscussionSourceType;
  score: number;
}

/** Thrown when retrieval cannot run at all (e.g. missing/invalid API key). */
export class DiscoveryError extends Error {
  constructor(
    message: string,
    readonly reason: "missing_key" | "provider_error"
  ) {
    super(message);
    this.name = "DiscoveryError";
  }
}

const TAVILY_ENDPOINT = "https://api.tavily.com/search";
const MAX_RESULTS = 12;
const KEEP_RESULTS = 10;
const CONTENT_MAX = 1500;

const REVIEW_HOSTS = [
  "g2.com",
  "capterra.com",
  "trustpilot.com",
  "trustradius.com",
  "getapp.com",
  "producthunt.com",
  "apps.apple.com",
  "play.google.com",
];
const FORUM_HOSTS = [
  "news.ycombinator.com",
  "quora.com",
  "stackoverflow.com",
  "stackexchange.com",
  "indiehackers.com",
  "discord.com",
  "community.",
  "forum.",
  "forums.",
];

function classifySource(url: string): {
  sourceType: DiscussionSourceType;
  sourceName: string;
} {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }

  if (host.includes("reddit.com")) {
    // Try to surface the subreddit (r/xxx) as the source name.
    const match = url.match(/reddit\.com\/(r\/[^/]+)/i);
    return { sourceType: "reddit", sourceName: match ? match[1] : "reddit.com" };
  }
  if (REVIEW_HOSTS.some((h) => host.includes(h))) {
    return { sourceType: "review", sourceName: host };
  }
  if (FORUM_HOSTS.some((h) => host.includes(h))) {
    return { sourceType: "forum", sourceName: host };
  }
  return { sourceType: "web", sourceName: host || "web" };
}

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
  raw_content?: string | null;
  score?: number;
}

/**
 * Fetch real discussions about a topic across the web (Reddit, forums, reviews).
 * Returns [] when the provider ran but found nothing. Throws DiscoveryError when
 * it could not run at all — the caller decides what to do (never fabricate data).
 */
export async function fetchDiscussions(
  topic: string,
  audience?: string
): Promise<Discussion[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new DiscoveryError("TAVILY_API_KEY is not set", "missing_key");
  }

  const query = [topic, audience]
    .filter(Boolean)
    .join(" ")
    .concat(" problems complaints frustrations pain points reviews");

  let res: Response;
  try {
    res = await fetch(TAVILY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        api_key: apiKey, // back-compat with older Tavily auth
        query,
        search_depth: "advanced",
        max_results: MAX_RESULTS,
        include_raw_content: true,
        include_answer: false,
      }),
    });
  } catch (err) {
    throw new DiscoveryError(
      `Tavily request failed: ${(err as Error).message}`,
      "provider_error"
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DiscoveryError(
      `Tavily API error: ${res.status} ${res.statusText} ${body.slice(0, 200)}`,
      "provider_error"
    );
  }

  const data = (await res.json().catch(() => null)) as
    | { results?: TavilyResult[] }
    | null;
  const results = data?.results ?? [];

  const discussions: Discussion[] = results
    .filter((r): r is TavilyResult & { url: string } => Boolean(r?.url))
    .map((r) => {
      const { sourceType, sourceName } = classifySource(r.url);
      const raw = (r.raw_content ?? r.content ?? "").trim();
      return {
        title: (r.title ?? "").trim(),
        content: raw.slice(0, CONTENT_MAX),
        url: r.url,
        sourceName,
        sourceType,
        score: typeof r.score === "number" ? r.score : 0,
      };
    })
    .filter((d) => d.content.length > 0 || d.title.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, KEEP_RESULTS);

  return discussions;
}

export function formatDiscussionsForPrompt(discussions: Discussion[]): string {
  if (discussions.length === 0) {
    return "No discussions found for this topic.";
  }

  return discussions
    .map((d, i) => {
      let text = `### Source ${i + 1}: "${d.title}" (${d.sourceName}, type: ${d.sourceType})\n`;
      if (d.content) {
        text += `Content: ${d.content}\n`;
      }
      text += `URL: ${d.url}\n`;
      return text;
    })
    .join("\n---\n\n");
}
