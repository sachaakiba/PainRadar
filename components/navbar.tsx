"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Radar, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher, LocaleSwitcherButton } from "@/components/locale-switcher";
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/features", label: t("features") },
    { href: "/pricing", label: t("pricing") },
    { href: "/use-cases", label: t("useCases") },
    { href: "/blog", label: t("blog") },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

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
          ? "border-border/50 bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-primary" aria-hidden />
          <span className="text-lg font-semibold tracking-tight">
            PainRadar
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitcher />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link href="/signin">{t("signIn")}</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t("getStarted")}</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" aria-label="Open menu" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-[calc(100vw-2rem)] border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md"
            showClose={true}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Radar className="h-5 w-5" />
                PainRadar
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 pt-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    pathname === href
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              <div className="flex flex-col gap-2">
                <LocaleSwitcherButton />
                {mounted && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setMobileOpen(false);
                    }}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        {t("lightMode")}
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        {t("darkMode")}
                      </>
                    )}
                  </Button>
                )}
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
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
