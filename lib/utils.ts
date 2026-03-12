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

export function getScoreColor(score: number) {
  if (score >= 80) return "text-teal-500";
  if (score >= 60) return "text-amber-500";
  if (score >= 40) return "text-coral-500";
  return "text-red-500";
}

export function getScoreBg(score: number) {
  if (score >= 80) return "bg-teal-500/10 text-teal-600 dark:text-teal-400";
  if (score >= 60) return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  if (score >= 40) return "bg-coral-500/10 text-coral-600 dark:text-coral-400";
  return "bg-red-500/10 text-red-500";
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pain-radar.com";

export function absoluteUrl(path: string) {
  return `${baseUrl}${path}`;
}
