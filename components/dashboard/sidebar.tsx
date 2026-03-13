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
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [savedCount, setSavedCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/analyses?saved=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.analyses)) {
          setSavedCount(data.analyses.length);
        }
      })
      .catch(() => {});
  }, []);

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
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar",
          "transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-1 flex-col px-4 pt-16 pb-4 lg:pt-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 mb-8"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-500/15">
              <Radar className="h-5 w-5 text-coral-400" />
            </div>
            <span className="font-display text-lg font-bold text-white">
              PainRadar
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {links.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              const isActive = pathname === link.href;
              const isSaved = link.href === "/dashboard/saved";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-coral-500/12 text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-coral-500 transition-transform origin-center" />
                  )}
                  <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-coral-400")} />
                  <span className="flex-1">{t(link.labelKey)}</span>
                  {isSaved && savedCount !== null && savedCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-500/20 px-1.5 text-xs font-semibold text-coral-400 tabular-nums">
                      {savedCount > 99 ? "99+" : savedCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 pt-4 border-t border-white/8">
            <div className="flex items-center gap-3 px-3">
              <Avatar className="h-9 w-9 ring-2 ring-white/10">
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback className="bg-coral-500/20 text-coral-300 text-sm font-bold">
                  {session?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-white">
                  {session?.user?.name ?? t("user")}
                </p>
                <p className="truncate text-xs text-sidebar-foreground">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
