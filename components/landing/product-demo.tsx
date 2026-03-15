"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Radio, AlertTriangle, Rocket, Wand2 } from "lucide-react";

const stepIcons = [Search, Radio, AlertTriangle, Rocket, Wand2] as const;

export function ProductDemo() {
  const t = useTranslations("productDemo");

  const steps = [
    { icon: stepIcons[0], label: t("step1") },
    { icon: stepIcons[1], label: t("step2") },
    { icon: stepIcons[2], label: t("step3") },
    { icon: stepIcons[3], label: t("step4") },
    { icon: stepIcons[4], label: t("step5"), highlight: true },
  ];

  const youtubeVideoId = "CHxO_ym7dOk";

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 }}
                    className={`flex items-center gap-4 rounded-xl border px-6 py-4 shadow-lg shadow-black/5 backdrop-blur-sm ${
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
                      initial={{ scaleY: 0 }}
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

        {/* YouTube video embed with autoplay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-xl border border-border/50 shadow-2xl shadow-black/10"
        >
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&playsinline=1`}
              title="PainRadar Product Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
