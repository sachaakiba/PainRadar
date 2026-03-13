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
    <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-amber-500/10 dark:from-violet-500/5 dark:via-fuchsia-500/5 dark:to-amber-500/5">
      <div className="absolute inset-0 rounded-[inherit] border-2 border-transparent [background:linear-gradient(var(--card),var(--card))_padding-box,linear-gradient(135deg,hsl(var(--color-primary)),hsl(270,80%,60%),hsl(var(--color-accent-2)))_border-box] pointer-events-none" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{t("aiPromptTitle")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("aiPromptDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-0">
              {t("aiPromptReady")}
            </Badge>
            <Button
              size="sm"
              onClick={handleCopy}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30"
            >
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
        <div className="rounded-xl bg-slate-950 dark:bg-black/60 p-5 font-mono text-sm text-slate-300 leading-relaxed overflow-hidden relative">
          <pre className="whitespace-pre-wrap break-words overflow-x-hidden">
            {expanded ? prompt : previewLines}
            {!expanded && hasMoreContent && "…"}
          </pre>

          {!expanded && hasMoreContent && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 dark:from-black/60 to-transparent pointer-events-none" />
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
