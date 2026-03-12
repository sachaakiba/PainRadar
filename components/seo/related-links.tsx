import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type RelatedLinkGroup = {
  title: string;
  links: { href: string; label: string }[];
};

export type RelatedLinksProps = {
  groups: RelatedLinkGroup[];
  className?: string;
};

export function RelatedLinks({ groups, className }: RelatedLinksProps) {
  return (
    <aside className={className} aria-label="Related pages">
      <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">Related</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.title} className="border-border/50">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  );
}
