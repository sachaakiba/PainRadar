"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserPlan } from "@/actions/user";
import { formatDate } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  emailVerified: boolean;
  locale: string;
  plan: string;
  credits: number;
  createdAt: string;
};

async function fetchAdminUsers(): Promise<AdminUser[]> {
  const response = await fetch("/api/admin/users", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load users");
  }
  const data: { users: AdminUser[] } = await response.json();
  return data.users;
}

export default function AdminPage() {
  const t = useTranslations("dashboard");
  const { data: userPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ["user-plan"],
    queryFn: getUserPlan,
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
    enabled: !!userPlan?.isSuperAdmin,
  });

  const relanceMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/relance", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to send relance");
      }
      return (await response.json()) as { sent: number; failed: number };
    },
    onSuccess: ({ sent, failed }) => {
      toast.success(t("adminRelanceSuccess", { sent, failed }));
    },
    onError: () => {
      toast.error(t("adminRelanceError"));
    },
  });

  if (isPlanLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!userPlan?.isSuperAdmin) {
    return (
      <Card className="border-l-4 border-l-coral-500">
        <CardHeader>
          <CardTitle>{t("adminAccessDenied")}</CardTitle>
          <CardDescription>{t("adminAccessDeniedDesc")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("adminTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("adminDesc")}</p>
      </div>

      <Card className="fade-up fade-up-2 border-l-4 border-l-coral-500">
        <CardHeader>
          <CardTitle className="text-base">{t("adminRelanceTitle")}</CardTitle>
          <CardDescription>{t("adminRelanceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => relanceMutation.mutate()}
            disabled={relanceMutation.isPending}
            className="w-fit"
          >
            {relanceMutation.isPending ? t("adminRelanceSending") : t("adminRelanceCta")}
          </Button>
          <Button variant="outline" onClick={() => refetch()} disabled={isUsersLoading}>
            {t("adminRefreshUsers")}
          </Button>
        </CardContent>
      </Card>

      <Card className="fade-up fade-up-3">
        <CardHeader>
          <CardTitle className="text-base">{t("adminUsersTitle")}</CardTitle>
          <CardDescription>{t("adminUsersDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isUsersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((row) => (
                <Skeleton key={row} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            users?.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-border/60 bg-background/60 p-4 hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.emailVerified ? "secondary" : "outline"}>
                      {user.emailVerified ? t("adminVerified") : t("adminUnverified")}
                    </Badge>
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{t("adminLocale", { locale: user.locale })}</span>
                  <span>{t("adminPlan", { plan: user.plan })}</span>
                  <span>{t("adminCredits", { credits: user.credits })}</span>
                  <span>{t("adminJoined", { date: formatDate(user.createdAt) })}</span>
                </div>
              </div>
            ))
          )}
          {!isUsersLoading && users?.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("adminNoUsers")}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
