"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { analysisSchema, type AnalysisInput } from "@/lib/validations";
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
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export function SearchForm() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const form = useForm<AnalysisInput>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      query: "",
      topic: "",
      audience: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: AnalysisInput) {
    const payload = {
      query: values.query || values.topic,
      topic: values.topic,
      audience: values.audience || undefined,
    };
    try {
      const res = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data.error ?? t("analysisError");
        if (data.code === "plan_limit_exceeded") {
          toast.error(message, {
            action: {
              label: t("upgradeNow"),
              onClick: () => router.push("/dashboard/settings"),
            },
          });
          return;
        }
        throw new Error(message);
      }

      const { analysis } = await res.json();
      toast.success(t("analysisStarted"));
      router.push(`/dashboard/analyses/${analysis.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("somethingWentWrong"));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl border-2 border-border/60 bg-card p-5 shadow-card-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="label-sm">{t("topic")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("topicPlaceholder")}
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v);
                      form.setValue("query", v, { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem className="sm:w-52">
                <FormLabel className="label-sm">{t("audience")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("audiencePlaceholder")}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t("analyze")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
