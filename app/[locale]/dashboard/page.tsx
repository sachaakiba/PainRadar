"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisCard } from "@/components/dashboard/analysis-card";

interface AnalysisSummary {
  id: string;
  query: string;
  topic: string;
  opportunityScore: number;
  saved: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: session } = useSession();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analyses")
      .then((res) => res.ok ? res.json() : { analyses: [] })
      .then((data) => {
        setAnalyses(data.analyses ?? []);
      })
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  const totalAnalyses = analyses.length;
  const savedCount = analyses.filter((a) => a.saved).length;
  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((s, a) => s + a.opportunityScore, 0) / analyses.length
        )
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("welcome")}{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("overviewDesc")}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("totalAnalyses")}</CardDescription>
              <CardTitle className="text-3xl">{totalAnalyses}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("savedAnalyses")}</CardDescription>
              <CardTitle className="text-3xl">{savedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("avgScore")}</CardDescription>
              <CardTitle className="text-3xl">{avgScore}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("recentAnalyses")}</h2>
          <Button asChild>
            <Link href="/dashboard/analyses">
              <Search className="mr-2 h-4 w-4" />
              {t("newAnalysis")}
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <Card className="mt-4 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">
                {t("noAnalyses")} {t("startFirst")}
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/analyses">
                  <Search className="mr-2 h-4 w-4" />
                  {t("newAnalysis")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 space-y-3">
            {analyses.slice(0, 5).map((a) => (
              <AnalysisCard key={a.id} analysis={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
