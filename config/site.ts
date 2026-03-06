export const siteConfig = {
  name: "PainRadar",
  description:
    "Find real pain points people are complaining about — and turn them into SaaS ideas. PainRadar analyzes discussions and reveals recurring pain points, product opportunities and SEO angles.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://painradar.com",
  ogImage: "/og.png",
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
