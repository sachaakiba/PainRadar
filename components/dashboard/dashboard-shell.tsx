"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSyncLocale } from "@/hooks/use-sync-locale";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useSyncLocale();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex h-screen">
        <Skeleton className="hidden w-64 shrink-0 border-r border-border lg:block" />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-6xl mx-auto p-6 lg:p-8">
            <div className="space-y-8">
              <Skeleton className="h-10 w-64" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto pl-0 pt-14 lg:pl-64 lg:pt-0">
        <div className="container max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
