/**
 * Simple markdown to HTML converter for blog posts.
 * Handles: headings, paragraphs, bold, italic, lists, links, code.
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown
    // Code blocks (fenced) - handle before inline code
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold (must come before italic to handle ** before *)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>');

  const lines = html.split("\n");
  const result: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let inOl = false;
  let olItems: string[] = [];

  const flushList = () => {
    if (inList) {
      result.push("<ul class='mb-4 ml-4 list-disc space-y-1'>" + listItems.join("") + "</ul>");
      listItems = [];
      inList = false;
    }
  };
  const flushOl = () => {
    if (inOl) {
      result.push("<ol class='mb-4 ml-4 list-decimal space-y-1'>" + olItems.join("") + "</ol>");
      olItems = [];
      inOl = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushOl();
      result.push("");
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      flushOl();
      result.push("<h3 class='mt-6 mb-3 text-lg font-semibold'>" + trimmed.slice(4) + "</h3>");
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      flushOl();
      result.push("<h2 class='mt-8 mb-4 text-xl font-semibold'>" + trimmed.slice(3) + "</h2>");
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      flushOl();
      result.push("<h1 class='text-2xl font-bold mb-4'>" + trimmed.slice(2) + "</h1>");
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushOl();
      if (!inList) inList = true;
      listItems.push("<li>" + trimmed.slice(2) + "</li>");
      continue;
    }

    // Numbered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      flushList();
      if (!inOl) inOl = true;
      olItems.push("<li>" + olMatch[2] + "</li>");
      continue;
    }

    flushList();
    flushOl();

    // Paragraph
    result.push("<p class='mb-4 leading-relaxed'>" + line + "</p>");
  }

  flushList();
  flushOl();

  return result.join("\n");
}
