"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  Radar,
  LayoutDashboard,
  Search,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

const iconMap = {
  LayoutDashboard,
  Search,
  Bookmark,
  Settings,
} as const;

const links = [
  { href: "/dashboard", labelKey: "overview", icon: "LayoutDashboard" },
  { href: "/dashboard/analyses", labelKey: "analyses", icon: "Search" },
  { href: "/dashboard/saved", labelKey: "saved", icon: "Bookmark" },
  { href: "/dashboard/settings", labelKey: "settings", icon: "Settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80",
          "transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-1 flex-col gap-6 p-4 pt-16 lg:pt-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-1.5"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Radar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">PainRadar</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1">
            {links.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-zinc-800/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="space-y-4">
            <Separator className="bg-zinc-800" />
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {session?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
