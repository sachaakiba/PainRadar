import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Opportunity-score semantics: high (>=80) forest, mid (>=55) ochre, low brick.
export function getScoreColor(score: number) {
  if (score >= 80) return "text-score-high";
  if (score >= 55) return "text-score-mid";
  return "text-score-low";
}

export function getScoreBg(score: number) {
  if (score >= 80) return "bg-score-high-tint text-score-high";
  if (score >= 55) return "bg-score-mid-tint text-score-mid";
  return "bg-score-low-tint text-score-low";
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pain-radar.com";

export function absoluteUrl(path: string) {
  return `${baseUrl}${path}`;
}
