import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl gradient-shimmer", className)}
      {...props}
    />
  );
}

export { Skeleton };
