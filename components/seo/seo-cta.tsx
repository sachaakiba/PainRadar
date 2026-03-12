import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export type SeoCtaProps = {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  href?: string;
  className?: string;
};

export function SeoCta({ title, subtitle, buttonLabel, href = "/signup", className }: SeoCtaProps) {
  return (
    <section
      className={
        className ??
        "rounded-xl border border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 px-6 py-12 text-center sm:px-8 sm:py-16"
      }
    >
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      <Button asChild size="lg" className="mt-6">
        <Link href={href}>{buttonLabel}</Link>
      </Button>
    </section>
  );
}
