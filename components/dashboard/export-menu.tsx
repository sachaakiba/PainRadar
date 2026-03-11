"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Copy,
  Link2,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExportMenuProps {
  data: unknown;
  shareUrl?: string;
  filename?: string;
}

export function ExportMenu({
  data,
  shareUrl,
  filename = "analysis.json",
}: ExportMenuProps) {
  const t = useTranslations("analysis");
  const [copied, setCopied] = useState<"json" | "link" | null>(null);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied("json");
      toast.success(t("jsonCopied"));
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloadStarted"));
  };

  const handleCopyLink = async () => {
    const url = shareUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(url);
      setCopied("link");
      toast.success(t("linkCopied"));
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error(t("copyLinkFailed"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {t("export")}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyJson}>
          <Copy className="mr-2 h-4 w-4" />
          {copied === "json" ? t("copied") : t("copyJson")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadJson}>
          <Download className="mr-2 h-4 w-4" />
          {t("downloadJson")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link2 className="mr-2 h-4 w-4" />
          {copied === "link" ? t("copied") : t("copyLink")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
