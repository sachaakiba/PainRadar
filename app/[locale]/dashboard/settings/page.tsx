"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { updateUserLocale } from "@/actions/locale";
import { saveLocaleToStorage, localeLabels } from "@/components/locale-switcher";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState(locale);

  function handleLocaleChange(newLocale: string) {
    setSelectedLocale(newLocale);
    saveLocaleToStorage(newLocale);
    startTransition(async () => {
      await updateUserLocale(newLocale);
      toast.success(t("languageUpdated"));
      router.replace(pathname, { locale: newLocale as "en" | "fr" });
    });
  }

  return (
    <div className="space-y-10">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {t("settingsTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="fade-up fade-up-2">
          <CardHeader>
            <CardTitle className="text-base">{t("profile")}</CardTitle>
            <CardDescription>{t("profileDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="label-sm">{t("name")}</Label>
              <Input
                id="name"
                value={session?.user?.name ?? ""}
                readOnly
                className="bg-secondary/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="label-sm">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email ?? ""}
                readOnly
                className="bg-secondary/40"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="fade-up fade-up-3">
          <CardHeader>
            <CardTitle className="text-base">{t("language")}</CardTitle>
            <CardDescription>{t("languageDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select
                value={selectedLocale}
                onValueChange={handleLocaleChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(localeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="fade-up fade-up-4 border-l-4 border-l-coral-500">
          <CardHeader>
            <CardTitle className="text-base">{t("currentPlan")}</CardTitle>
            <CardDescription>{t("currentPlanDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="coral">{t("freePlan")}</Badge>
              <span className="text-sm text-muted-foreground">
                {t("freePlanDesc")}
              </span>
            </div>
            <Button>{t("upgradeCta")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
