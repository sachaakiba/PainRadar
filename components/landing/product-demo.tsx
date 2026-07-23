"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Radio, AlertTriangle, Rocket, Wand2 } from "lucide-react";

const stepIcons = [Search, Radio, AlertTriangle, Rocket, Wand2] as const;

export function ProductDemo() {
  const t = useTranslations("productDemo");
  const locale = useLocale();
  const videoSrc =
    locale === "fr" ? "/fr/pain-radar-demo.mp4" : "/en/pain-radar-demo.mp4";

  const steps = [
    { icon: stepIcons[0], label: t("step1") },
    { icon: stepIcons[1], label: t("step2") },
    { icon: stepIcons[2], label: t("step3") },
    { icon: stepIcons[3], label: t("step4") },
    { icon: stepIcons[4], label: t("step5"), highlight: true },
  ];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="relative flex flex-col items-center gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 }}
                    className={`flex items-center gap-4 rounded-xl border px-6 py-4 shadow-card-sm ${
                      (step as { highlight?: boolean }).highlight
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-card/80"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-foreground sm:text-base">
                      {step.label}
                    </span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div
                      initial={false}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.15 + 0.2 }}
                      className="h-8 w-px origin-top bg-border"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-xl border border-border/50 shadow-card-md"
        >
          <div className="aspect-video">
            <video
              key={videoSrc}
              className="h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
