interface ShareTextData {
  topic: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  painPointCount: number;
  topPainPoints: string[];
  shareUrl: string;
}

export function buildTwitterText(data: ShareTextData): string {
  const { topic, opportunityScore, painPointCount } = data;
  const scoreEmoji = opportunityScore >= 80 ? "🔥" : opportunityScore >= 60 ? "👀" : "📊";
  return `${scoreEmoji} "${topic}" — ${opportunityScore}/100 opportunity score, ${painPointCount} real pain points found`;
}

export type SocialPlatform = "twitter" | "linkedin" | "facebook" | "reddit";

export function getShareUrl(platform: SocialPlatform, data: ShareTextData): string {
  const encodedUrl = encodeURIComponent(data.shareUrl);

  switch (platform) {
    case "twitter": {
      const text = encodeURIComponent(buildTwitterText(data));
      return `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
    }
    case "linkedin": {
      const title = encodeURIComponent(
        `"${data.topic}" — ${data.opportunityScore}/100 opportunity score`
      );
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${title}&source=PainRadar`;
    }
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "reddit": {
      const title = encodeURIComponent(
        `"${data.topic}" scores ${data.opportunityScore}/100 — ${data.painPointCount} pain points people keep complaining about`
      );
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${title}`;
    }
  }
}
