"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Database, TrendingUp, Target } from "lucide-react";

const featureIcons = [Database, TrendingUp, Target] as const;

export function WhyThisWorks() {
  const t = useTranslations("whyThisWorks");

  const features = [
    { icon: featureIcons[0], title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: featureIcons[1], title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: featureIcons[2], title: t("feature3Title"), desc: t("feature3Desc") },
  ];

  return (
    <section className="border-t border-border/50 bg-muted/20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-12 max-w-lg rounded-xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <p className="text-base font-semibold text-foreground">
            {t("punchline")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
