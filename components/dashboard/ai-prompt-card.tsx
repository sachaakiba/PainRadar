"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AiPromptCardProps {
  prompt: string;
}

export function AiPromptCard({ prompt }: AiPromptCardProps) {
  const t = useTranslations("analysis");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success(t("aiPromptCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  }, [prompt, t]);

  const lines = prompt.split("\n");
  const previewLines = lines.slice(0, 12).join("\n");
  const hasMoreContent = lines.length > 12;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{t("aiPromptTitle")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("aiPromptDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">{t("aiPromptReady")}</Badge>
            <Button size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 mr-1.5" />
              ) : (
                <Copy className="h-4 w-4 mr-1.5" />
              )}
              {copied ? t("copied") : t("aiPromptCopy")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="relative overflow-hidden rounded-md border border-border bg-secondary/60 p-5 font-mono text-sm leading-relaxed text-foreground/80">
          <pre className="whitespace-pre-wrap break-words overflow-x-hidden">
            {expanded ? prompt : previewLines}
            {!expanded && hasMoreContent && "…"}
          </pre>

          {!expanded && hasMoreContent && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-secondary to-transparent pointer-events-none" />
          )}
        </div>

        {hasMoreContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1.5" />
                {t("aiPromptCollapse")}
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1.5" />
                {t("aiPromptExpand")}
              </>
            )}
          </Button>
        )}

        <p className="mt-4 text-xs text-muted-foreground text-center">
          {t("aiPromptHint")}
        </p>
      </CardContent>
    </Card>
  );
}
