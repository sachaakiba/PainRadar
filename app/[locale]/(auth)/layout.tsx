import { Link } from "@/i18n/routing";
import { Radar } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500/15">
            <Radar className="h-4 w-4 text-coral-500" />
          </div>
          <span className="font-display font-bold">PainRadar</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </div>
    </div>
  );
}
