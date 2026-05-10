"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function FeedbackPage() {
  const t = useTranslations("dashboard");
  const [message, setMessage] = useState("");

  const feedbackMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }
    },
    onSuccess: () => {
      toast.success(t("feedbackSuccess"));
      setMessage("");
    },
    onError: () => {
      toast.error(t("feedbackError"));
    },
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("feedbackTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("feedbackDesc")}</p>
      </div>

      <Card className="fade-up fade-up-2 border-l-4 border-l-coral-500">
        <CardHeader>
          <CardTitle className="text-base">{t("feedbackCardTitle")}</CardTitle>
          <CardDescription>{t("feedbackCardDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-message" className="label-sm">
              {t("feedbackMessageLabel")}
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("feedbackPlaceholder")}
              className="min-h-44"
              maxLength={5000}
            />
          </div>
          <Button
            onClick={() => feedbackMutation.mutate()}
            disabled={feedbackMutation.isPending || message.trim().length < 10}
          >
            {feedbackMutation.isPending ? t("feedbackSubmitting") : t("feedbackSubmit")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
