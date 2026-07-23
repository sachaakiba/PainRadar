"use client";

import { useTranslations } from "next-intl";
import { X, Check } from "lucide-react";

export function Comparison() {
  const t = useTranslations("comparison");
  const withoutItems = t.raw("withoutItems") as string[];
  const withItems = t.raw("withItems") as string[];

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-lg border border-brick-600/20 bg-brick-600/[0.04] p-8">
            <div className="mb-6">
              <span className="inline-block rounded-pill bg-brick-600/10 px-3 py-1 text-sm font-medium text-brick-600">
                {t("without")}
              </span>
            </div>
            <ul className="space-y-4">
              {withoutItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brick-600/10">
                    <X className="h-3 w-3 text-brick-600" />
                  </span>
                  <span className="text-foreground/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-forest-600/20 bg-forest-600/[0.04] p-8">
            <div className="mb-6">
              <span className="inline-block rounded-pill bg-forest-600/10 px-3 py-1 text-sm font-medium text-forest-600">
                {t("with")}
              </span>
            </div>
            <ul className="space-y-4">
              {withItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-600/10">
                    <Check className="h-3 w-3 text-forest-600" />
                  </span>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
