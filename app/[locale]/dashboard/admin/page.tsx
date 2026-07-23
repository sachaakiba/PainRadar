"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/data-table";
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
        <h1 className="font-display text-3xl font-medium tracking-tight">{t("adminTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("adminDesc")}</p>
      </div>

      <Card className="fade-up fade-up-2">
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

      <div className="fade-up fade-up-3 space-y-4">
        <div>
          <h2 className="font-display text-xl font-medium">{t("adminUsersTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("adminUsersDesc")}</p>
        </div>

        {isUsersLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : users?.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-16 text-center">
            <p className="text-sm text-muted-foreground">{t("adminNoUsers")}</p>
          </div>
        ) : (
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>{t("name")}</DataTableHead>
                <DataTableHead>{t("email")}</DataTableHead>
                <DataTableHead>{t("colRole")}</DataTableHead>
                <DataTableHead>{t("colStatus")}</DataTableHead>
                <DataTableHead>{t("language")}</DataTableHead>
                <DataTableHead>{t("colPlan")}</DataTableHead>
                <DataTableHead className="text-right">{t("colCredits")}</DataTableHead>
                <DataTableHead className="text-right">{t("colJoined")}</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {users?.map((user) => (
                <DataTableRow key={user.id}>
                  <DataTableCell
                    className="max-w-[200px] truncate text-sm font-semibold text-foreground"
                    title={user.name}
                  >
                    {user.name}
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap text-[13px] text-muted-foreground">
                    {user.email}
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap">
                    <Badge variant={user.role === "SUPER_ADMIN" ? "accent" : "secondary"}>
                      {user.role}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap">
                    <Badge variant={user.emailVerified ? "success" : "outline"}>
                      {user.emailVerified ? t("adminVerified") : t("adminUnverified")}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap text-[13px] uppercase text-muted-foreground">
                    {user.locale}
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap text-[13px] text-muted-foreground">
                    {user.plan}
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap text-right font-mono text-[13px] tabular-nums text-foreground">
                    {user.credits}
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap text-right text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </div>
    </div>
  );
}
