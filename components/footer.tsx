"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Radar } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  const columns = [
    {
      title: t("product"),
      links: [
        { href: "/features" as const, label: t("features") },
        { href: "/pricing" as const, label: t("pricing") },
        { href: "/examples" as const, label: t("examples") },
        { href: "/use-cases" as const, label: t("useCases") },
      ],
    },
    {
      title: t("resources"),
      links: [
        { href: "/blog" as const, label: t("blog") },
        { href: "/saas-ideas" as const, label: t("saasIdeas") },
        { href: "/pain" as const, label: t("painPointsByNiche") },
        { href: "/startup-validation" as const, label: t("startupValidation") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about" as const, label: t("about") },
        { href: "/contact" as const, label: t("contact") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/privacy" as const, label: t("privacy") },
        { href: "/terms" as const, label: t("terms") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-muted-foreground" aria-hidden />
              <span className="text-lg font-semibold tracking-tight">
                PainRadar
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-medium text-foreground">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
