"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  const t = useTranslations("auth");

  return (
    <Card className="w-full max-w-md border-2 border-border/50 shadow-card-lg">
      <CardHeader className="space-y-2 text-center pb-2">
        <div className="mx-auto mb-2">
          <Mail className="h-12 w-12 text-coral-500" />
        </div>
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          {t("checkYourEmail")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{t("checkYourEmailDesc")}</p>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {t("didntReceiveEmail")}
          </p>
          <ul className="mt-2 text-sm text-muted-foreground text-left list-disc list-inside space-y-1">
            <li>{t("checkSpamFolder")}</li>
            <li>{t("waitFewMinutes")}</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        <Link
          href="/resend-verification"
          className="text-sm font-semibold text-coral-500 underline-offset-4 hover:underline"
        >
          {t("resendVerificationLink")}
        </Link>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href="/signin">{t("backToSignIn")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
