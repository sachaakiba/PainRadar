"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">{t("pageNotFound")}</h2>
        <p className="text-muted-foreground max-w-md">
          {t("pageNotFoundDesc")}
        </p>
      </div>
      <Button asChild>
        <Link href="/" className="gap-2">
          <Home className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </Button>
    </div>
  );
}
