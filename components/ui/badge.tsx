import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill border px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "border-border/80 text-foreground",
        accent:
          "border-transparent bg-primary-tint text-primary",
        success:
          "border-transparent bg-score-high-tint text-score-high",
        warning:
          "border-transparent bg-score-mid-tint text-score-mid",
        danger:
          "border-transparent bg-score-low-tint text-score-low",
        coral:
          "border-transparent bg-coral-100 text-coral-700",
        teal:
          "border-transparent bg-teal-100 text-teal-700",
        amber:
          "border-transparent bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
