"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getShareUrl, type SocialPlatform } from "@/lib/share-text";
import { absoluteUrl } from "@/lib/ut
interface ShareAnalysisData {
  id: string;
  topic: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  painPoints: { text: string }[];
}

interface ShareSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ShareAnalysisData;
}

const PLATFORMS: {
  key: SocialPlatform;
  labelKey: string;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    key: "twitter",
    labelKey: "shareOnTwitter",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    className:
      "bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black",
  },
  {
    key: "linkedin",
    labelKey: "shareOnLinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    className: "bg-[#0A66C2] hover:bg-[#004182] text-white",
  },
  {
    key: "facebook",
    labelKey: "shareOnFacebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    className: "bg-[#1877F2] hover:bg-[#0C5DC7] text-white",
  },
  {
    key: "reddit",
    labelKey: "shareOnReddit",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.14c.065.326.1.665.1 1.01 0 3.163-3.671 5.73-8.2 5.73-4.53 0-8.2-2.567-8.2-5.73 0-.345.035-.684.1-1.01A1.775 1.775 0 011 11.5c0-.98.794-1.775 1.775-1.775.455 0 .87.172 1.182.455C5.508 9.168 7.49 8.5 9.628 8.437l1.665-5.23a.296.296 0 01.354-.2l3.698.83a1.265 1.265 0 112.393.18l-3.46-.776-1.504 4.724c2.063.092 3.973.76 5.504 1.766a1.768 1.768 0 011.167-.44c.98 0 1.775.794 1.775 1.775a1.78 1.78 0 01-.754 1.455zM8.15 12.666c-.735 0-1.333.598-1.333 1.334 0 .735.598 1.333 1.333 1.333.736 0 1.334-.598 1.334-1.333 0-.736-.598-1.334-1.334-1.334zm7.7 0c-.736 0-1.334.598-1.334 1.334 0 .735.598 1.333 1.334 1.333.735 0 1.333-.598 1.333-1.333 0-.736-.598-1.334-1.333-1.334zm-6.5 4.4c-.1.1-.1.26 0 .36.894.894 2.612 1.008 2.66 1.008.046 0 1.765-.114 2.658-1.008.1-.1.1-.26 0-.36-.1-.1-.262-.1-.362 0-.68.68-1.975.79-2.297.79-.32 0-1.618-.11-2.297-.79-.1-.098-.262-.098-.362 0z" />
      </svg>
    ),
    className: "bg-[#FF4500] hover:bg-[#E03D00] text-white",
  },
];

export function ShareSocialModal({
  isOpen,
  onClose,
  analysis,
}: ShareSocialModalProps) {
  const t = useTranslations("analysis");

  const shareUrl = absoluteUrl(`/share/${analysis.id}`);

  const shareData = {
    topic: analysis.topic,
    opportunityScore: analysis.opportunityScore,
    demandScore: analysis.demandScore,
    urgencyScore: analysis.urgencyScore,
    painPointCount: analysis.painPoints.length,
    topPainPoints: analysis.painPoints.map((p) => p.text),
    shareUrl,
  };

  const handleShare = (platform: SocialPlatform) => {
    const url = getShareUrl(platform, shareData);
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const scoreEmoji =
    analysis.opportunityScore >= 80
      ? "🔥"
      : analysis.opportunityScore >= 60
        ? "👀"
        : "📊";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center font-display text-xl">
            {t("shareModalTitle")}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {t("shareModalDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-xl border border-border/50 bg-gradient-to-br from-coral-500/5 to-amber-500/5 p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {analysis.topic}
          </p>
          <p className="mt-2 text-4xl font-bold font-mono tabular-nums text-coral-600 dark:text-coral-400">
            {scoreEmoji} {analysis.opportunityScore}
            <span className="text-lg text-muted-foreground">/100</span>
          </p>
          <p className="mt-1.5 text-sm text-foreground/80">
            {t("shareModalPainCount", {
              count: analysis.painPoints.length,
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map((platform) => (
            <Button
              key={platform.key}
              variant="ghost"
              className={`h-12 gap-2.5 ${platform.className}`}
              onClick={() => handleShare(platform.key)}
            >
              {platform.icon}
              <span className="text-sm font-medium">
                {t(platform.labelKey)}
              </span>
            </Button>
          ))}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            {t("shareLater")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
