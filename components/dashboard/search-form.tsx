"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
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
        throw new Error(data.error ?? "Failed to create analysis");
      }

      const { analysis } = await res.json();
      toast.success("Analysis started! Redirecting...");
      router.push(`/dashboard/analyses/${analysis.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("topic")}</FormLabel>
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
            <FormItem className="sm:w-48">
              <FormLabel>{t("audience")}</FormLabel>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("analyzing")}
            </>
          ) : (
            t("analyze")
          )}
        </Button>
      </form>
    </Form>
  );
}
