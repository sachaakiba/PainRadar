import { useTranslations } from "next-intl";
import { Radar, Lightbulb, Star, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const icons = [Radar, Lightbulb, Star, Share2] as const;

export function Roadmap() {
  const t = useTranslations("roadmap");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="border-t border-border/50 bg-muted/20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="accent" className="mb-4">
            {t("badge")}
          </Badge>
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
          {items.map((item, i) => {
            const Icon = icons[i] ?? Radar;
            return (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-6 shadow-card-xs"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
