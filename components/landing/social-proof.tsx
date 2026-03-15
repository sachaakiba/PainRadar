"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function SocialProof() {
  const t = useTranslations("socialProof");

  const testimonials = [
    { text: t("testimonial1Text"), author: t("testimonial1Author"), role: t("testimonial1Role") },
    { text: t("testimonial2Text"), author: t("testimonial2Author"), role: t("testimonial2Role") },
    { text: t("testimonial3Text"), author: t("testimonial3Author"), role: t("testimonial3Role") },
  ];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("badge")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-border/50 bg-card/50 p-6"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="mt-4 border-t border-border/50 pt-3">
                <p className="text-sm font-semibold text-foreground">{item.author}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>{t("usedBy")}</span>
          <div className="flex gap-4">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Product Hunt</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Indie Hackers</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Reddit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
