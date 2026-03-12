"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
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
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

const resendSchema = z.object({
  email: z.string().email(),
});

type ResendInput = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
  const t = useTranslations("auth");
  const [sent, setSent] = useState(false);
  const form = useForm<ResendInput>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ResendInput) {
    try {
      await authClient.sendVerificationEmail({
        email: values.email,
        callbackURL: "/dashboard",
      });
      setSent(true);
      toast.success(t("verificationEmailSent"));
    } catch {
      toast.error(t("verificationEmailError"));
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md border-2 border-border/50 shadow-card-lg">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="mx-auto mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="font-display text-2xl font-bold tracking-tight">
            {t("verificationEmailSentTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            {t("verificationEmailSentDesc")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
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
        <div className="mx-auto mb-2">
          <Mail className="h-12 w-12 text-coral-500" />
        </div>
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          {t("resendVerificationTitle")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("resendVerificationDesc")}
        </p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pt-4">
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
                  {t("sending")}
                </>
              ) : (
                t("sendVerificationEmail")
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("rememberedPassword")}{" "}
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
