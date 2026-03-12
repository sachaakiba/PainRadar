"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { Radar, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher, LocaleSwitcherButton } from "@/components/locale-switcher";
import { ThemeToggle, ThemeToggleButton } from "@/components/theme-toggle";
import { useSession } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!session?.user;

  const links = [
    { href: "/features", label: t("features") },
    { href: "/pricing", label: t("pricing") },
    { href: "/use-cases", label: t("useCases") },
    { href: "/blog", label: t("blog") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl border-border/40 bg-background/90"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500/15">
            <Radar className="h-4 w-4 text-coral-500" aria-hidden />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            PainRadar
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-coral-500",
                pathname === href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          {isLoggedIn ? (
            <Button asChild>
              <Link href="/dashboard">{t("dashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin">{t("signIn")}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t("getStarted")}</Link>
              </Button>
            </>
          )}
        </div>

        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" aria-label="Open menu" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-[calc(100vw-2rem)] border-2 border-border/50 bg-card/98 backdrop-blur-xl sm:max-w-md rounded-2xl"
            showClose={true}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500/15">
                  <Radar className="h-4 w-4 text-coral-500" />
                </div>
                <span className="font-display font-bold">PainRadar</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-1 pt-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                    pathname === href
                      ? "bg-coral-500/10 text-coral-500"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="my-3 h-px bg-border/60" />
              <div className="flex flex-col gap-2">
                <LocaleSwitcherButton />
                <ThemeToggleButton
                  lightLabel={t("lightMode")}
                  darkLabel={t("darkMode")}
                  onToggle={() => setMobileOpen(false)}
                />
                {isLoggedIn ? (
                  <Button asChild>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      {t("dashboard")}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/signin" onClick={() => setMobileOpen(false)}>
                        {t("signIn")}
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        {t("getStarted")}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
