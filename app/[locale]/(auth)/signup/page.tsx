"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpInput } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-button";

export default function SignUpPage() {
  const t = useTranslations("auth");
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: SignUpInput) {
    try {
      const checkResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const checkData = await checkResponse.json();
      
      if (checkData.exists) {
        form.setError("email", { message: t("emailAlreadyExists") });
        return;
      }
    } catch {
      // Continue with signup if check fails
    }

    const { data, error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard",
    });

    if (error) {
      const errorCode = (error.code ?? "").toUpperCase();
      const errorMessage = (error.message ?? "").toLowerCase();
      
      if (
        errorCode.includes("USER_ALREADY_EXISTS") ||
        errorMessage.includes("already exists") ||
        errorMessage.includes("existe déjà")
      ) {
        form.setError("email", { message: t("emailAlreadyExists") });
      } else {
        form.setError("root", { message: error.message ?? t("signUpError") });
      }
      return;
    }

    if (data) {
      setUserEmail(values.email);
      setEmailSent(true);
    }
  }

  if (emailSent) {
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
          <p className="text-muted-foreground">
            {t("verificationEmailSentTo")}
          </p>
          <p className="font-medium text-foreground">{userEmail}</p>
          <div className="rounded-lg bg-muted/50 p-4 mt-4">
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

  return (
    <Card className="w-full max-w-md border-2 border-border/50 shadow-card-lg">
      <CardHeader className="space-y-2 text-center pb-2">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          {t("createAccount")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("createAccountDesc")}</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pt-4">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 font-medium text-muted-foreground tracking-wider">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-sm">{t("name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("namePlaceholder")}
                      autoComplete="name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-sm">{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      autoComplete="email"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-sm">{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-destructive text-center">
                {form.formState.errors.root.message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                t("createButton")
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/signin"
                className="font-semibold text-coral-500 underline-offset-4 hover:underline"
              >
                {t("signInLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
