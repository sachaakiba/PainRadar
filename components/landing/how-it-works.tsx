"use client";

import { useTranslations } from "next-intl";

const stepNumbers = ["01", "02", "03"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = [
    { number: stepNumbers[0], title: t("step1Title"), description: t("step1Desc") },
    { number: stepNumbers[1], title: t("step2Title"), description: t("step2Desc") },
    { number: stepNumbers[2], title: t("step3Title"), description: t("step3Desc") },
  ];
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl">
          {/* Desktop: horizontal layout with connecting lines */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 text-2xl font-bold text-primary">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="absolute left-[calc(50%+2rem)] top-8 h-0.5 w-[calc(100%-4rem)] bg-border"
                    aria-hidden
                  />
                )}
                <h3 className="mt-8 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          {/* Mobile: vertical layout */}
          <div className="space-y-12 lg:hidden">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 px-4 py-2 text-xl font-bold text-primary">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
