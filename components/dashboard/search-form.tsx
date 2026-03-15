"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Users } from "lucide-react";
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<AnalysisInput>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      query: "",
      topic: "",
      audience: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [autoResize]);

  async function onSubmit(values: AnalysisInput) {
    const payload = {
      query: values.query || values.topic,
      topic: values.topic.trim(),
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
        className="rounded-2xl border-2 border-border/60 bg-card shadow-card-sm"
      >

        {/* ── Section 1 : Sujet ── */}
        <div className="px-5 pt-5 pb-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-sm text-foreground font-semibold">
                  {t("topic")}
                </FormLabel>
                <FormControl>
                  <textarea
                    ref={(el) => {
                      textareaRef.current = el;
                      field.ref(el);
                    }}
                    value={field.value}
                    placeholder={t("topicPlaceholder")}
                    disabled={isSubmitting}
                    rows={2}
                    onInput={autoResize}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v);
                      form.setValue("query", v, { shouldValidate: true });
                      autoResize();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    className="mt-1.5 w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-3 text-base leading-relaxed placeholder:text-muted-foreground/60 outline-none focus:border-primary disabled:opacity-50 min-h-[80px] max-h-[400px] overflow-y-auto transition-colors duration-150"
                  />
                </FormControl>
                <FormMessage className="mt-1 text-xs" />
                <p className="mt-1.5 text-xs text-muted-foreground/70 select-none">
                  {t("topicHint")}
                </p>
              </FormItem>
            )}
          />
        </div>

        {/* ── Séparateur ── */}
        <div className="border-t border-border/40 mx-5" />

        {/* ── Section 2 : Audience + bouton ── */}
        <div className="px-5 pt-4 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="label-sm text-foreground font-semibold flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("audience")}
                    <span className="font-normal text-muted-foreground">
                      {t("audienceOptional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("audiencePlaceholder")}
                      disabled={isSubmitting}
                      className="mt-1.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="mt-1.5 text-xs text-muted-foreground/70">
                    {t("audienceHint")}
                  </p>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="shrink-0 gap-2 sm:mb-[1.625rem]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isSubmitting ? t("analyzing") : t("analyze")}
            </Button>
          </div>
        </div>

      </form>
    </Form>
  );
}
