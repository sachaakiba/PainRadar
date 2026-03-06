"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getScoreBg } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-32 sm:px-6 sm:pt-32 sm:pb-40 lg:px-8">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t("headline")}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            {t("subheadline")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">{t("cta")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/examples/invoicing-freelancers">
                {t("secondaryCta")}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="rounded-xl border border-border/50 bg-card/50 p-6 shadow-2xl shadow-black/5 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {t("previewQuery")}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getScoreBg(87)}`}
              >
                {t("previewScore")}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                {t("previewPain1")}
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                {t("previewPain2")}
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                {t("previewPain3")}
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-foreground">
              {t("previewSuggested")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
