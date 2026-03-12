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
    <div className="min-h-screen font-sans antialiased" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(225,25%,7%)] px-6 py-20">
          {/* Gradient orb background */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            <div className="h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,hsl(14_100%_64%_/_0.15)_0%,transparent_70%)]" />
          </div>

          {/* Left accent line */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[hsl(14,100%,64%)] via-[hsl(37,100%,64%)] to-transparent" />

          {/* Language toggle */}
          <div className="absolute right-6 top-6 flex gap-2">
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                lang === "fr"
                  ? "bg-[hsl(14,100%,64%)] text-white"
                  : "text-[hsl(225,10%,70%)] hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                lang === "en"
                  ? "bg-[hsl(14,100%,64%)] text-white"
                  : "text-[hsl(225,10%,70%)] hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[hsl(14,100%,64%/0.4)] bg-[hsl(14,100%,64%/0.1)] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[hsl(14,100%,70%)]">
              {t.badge}
            </span>

            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl">
              {t.headline}
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-[hsl(225,10%,75%)] sm:text-xl">
              {t.subheadline}
            </p>

            <div className="mt-12 flex items-center gap-3">
              <span className="text-sm text-[hsl(225,10%,55%)]">{t.cta}</span>
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[hsl(14,100%,64%)]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[hsl(14,100%,64%)]" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[hsl(14,100%,64%)]" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>

          {/* Logo / branding */}
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium tracking-wider text-[hsl(225,10%,45%)]">
            PainRadar
          </p>
        </div>
      </div>
  );
}
