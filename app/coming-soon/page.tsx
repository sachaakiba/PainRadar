"use client";

import { useState } from "react";

const content = {
  fr: {
    headline: "On arrive bientôt.",
    subheadline:
      "PainRadar débarque pour vous aider à dénicher les vrais problèmes — et à construire des produits dont les gens ont besoin.",
    cta: "Restez connecté",
    badge: "En construction",
  },
  en: {
    headline: "Coming soon.",
    subheadline:
      "PainRadar is landing to help you surface real problems — and build products people actually need.",
    cta: "Stay tuned",
    badge: "In the works",
  },
} as const;

export default function ComingSoonPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const t = content[lang];

  return (
    <div className="min-h-screen font-sans antialiased">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-20">
          {/* Left accent hairline */}
          <div className="absolute left-0 top-0 h-full w-[3px] bg-primary/70" />

          {/* Language toggle */}
          <div className="absolute right-6 top-6 flex gap-2">
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                lang === "fr"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
            <span className="mb-8 inline-flex items-center gap-2 rounded-pill border border-primary/30 bg-primary-tint px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              {t.badge}
            </span>

            <h1 className="font-display text-5xl font-medium tracking-tight text-foreground sm:text-7xl md:text-8xl">
              {t.headline}
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t.subheadline}
            </p>

            <div className="mt-12 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{t.cta}</span>
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>

          {/* Logo / branding */}
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-base tracking-wide text-muted-foreground">
            PainRadar
          </p>
        </div>
      </div>
  );
}
