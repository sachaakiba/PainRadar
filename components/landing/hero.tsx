import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ui/score-badge";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="px-4 pt-32 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
      <div className="container mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("subheadline")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="w-full gap-2 sm:w-auto">
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
          </div>
        </div>

        {/* Sample analysis card — reddit complaint → problem → suggested product */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-lg border border-border bg-card p-6 text-left shadow-card-sm sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <Badge
                variant="secondary"
                className="rounded-sm font-normal normal-case tracking-normal"
              >
                {t("exampleRedditLabel")}
              </Badge>
              <ScoreBadge score={87} />
            </div>

            <p className="mt-5 font-display text-lg italic leading-snug text-foreground/90">
              &ldquo;{t("exampleRedditQuote")}&rdquo;
            </p>

            <div className="mt-5 border-t border-border pt-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                {t("exampleProblemLabel")}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("exampleProblemText")}
              </p>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                {t("exampleIdeaLabel")}
              </p>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {t("exampleIdeaText")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("exampleCaption")}
          </p>
        </div>
      </div>
    </section>
  );
}
