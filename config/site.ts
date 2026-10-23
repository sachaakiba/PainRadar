export const siteConfig = {
  name: "PainRadar",
  description:
    "PainRadar scans Reddit, forums, and review sites to find real customer pain points — and turns them into validated SaaS ideas. Get opportunity scores, product ideas, and SEO keywords in seconds.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://painradar.com",
  ogImage: "/og.png",
  icon: "/icon.png",
  links: {
    twitter: "https://twitter.com/painradar",
    github: "https://github.com/painradar",
  },
  creator: "PainRadar",
};

export const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/blog", label: "Blog" },
] as const;

export const dashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/analyses", label: "Analyses", icon: "Search" },
  { href: "/dashboard/saved", label: "Saved", icon: "Bookmark" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
