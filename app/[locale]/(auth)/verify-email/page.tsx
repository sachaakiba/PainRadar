"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";

type VerificationState = "verifying" | "success" | "error" | "invalid";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "invalid_token") {
      setState("invalid");
      return;
    }

    if (!token) {
      setState("invalid");
      return;
    }

    async function verifyEmail() {
      try {
        const result = await authClient.verifyEmail({
          query: { token: token! },
        });

        if (result.error) {
          setState("error");
          setErrorMessage(result.error.message ?? "");
        } else {
          setState("success");
        }
      } catch {
        setState("error");
      }
    }

    verifyEmail();
  }, [token, error]);

  return (
    <Card className="w-full max-w-md border-2 border-border/50 shadow-card-lg">
      <CardHeader className="space-y-2 text-center pb-2">
        <div className="mx-auto mb-2">
          {state === "verifying" && (
            <Loader2 className="h-12 w-12 animate-spin text-coral-500" />
          )}
          {state === "success" && (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          )}
          {(state === "error" || state === "invalid") && (
            <XCircle className="h-12 w-12 text-red-500" />
          )}
        </div>
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          {state === "verifying" && t("verifyingEmail")}
          {state === "success" && t("emailVerified")}
          {state === "error" && t("verificationFailed")}
          {state === "invalid" && t("invalidVerificationLink")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          {state === "verifying" && t("verifyingEmailDesc")}
          {state === "success" && t("emailVerifiedDesc")}
          {state === "error" && (errorMessage || t("verificationFailedDesc"))}
          {state === "invalid" && t("invalidVerificationLinkDesc")}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        {state === "success" && (
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">{t("goToDashboard")}</Link>
          </Button>
        )}
        {(state === "error" || state === "invalid") && (
          <>
            <Button asChild className="w-full" size="lg">
              <Link href="/signin">{t("backToSignIn")}</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("needNewLink")}{" "}
              <Link
                href="/resend-verification"
                className="font-semibold text-coral-500 underline-offset-4 hover:underline"
              >
                {t("resendVerificationLink")}
              </Link>
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
