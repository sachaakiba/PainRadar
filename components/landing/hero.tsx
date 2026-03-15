"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Zap, Lightbulb } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28 lg:px-8">
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
            <Button size="lg" asChild className="w-full sm:w-auto gap-2">
              <Link href="/signup">
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/examples/invoicing-freelancers">
                {t("secondaryCta")}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Live example: Reddit → Problem → SaaS idea */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Reddit complaint */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  {t("exampleRedditLabel")}
                </span>
              </div>
              <p className="text-sm italic text-foreground/80">
                &ldquo;{t("exampleRedditQuote")}&rdquo;
              </p>
            </motion.div>

            {/* Problem detected */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {t("exampleProblemLabel")}
                </span>
              </div>
              <p className="text-sm text-foreground/80">
                {t("exampleProblemText")}
              </p>
            </motion.div>

            {/* SaaS idea */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {t("exampleIdeaLabel")}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground/90">
                {t("exampleIdeaText")}
              </p>
            </motion.div>
          </div>
          <div className="mt-3 flex justify-center">
            <span className="text-xs text-muted-foreground">
              {t("exampleCaption")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
