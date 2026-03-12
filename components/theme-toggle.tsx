"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ThemeToggleProps {
  onToggle?: () => void;
}

export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    onToggle?.();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

interface ThemeToggleButtonProps {
  lightLabel: string;
  darkLabel: string;
  onToggle?: () => void;
}

export function ThemeToggleButton({ lightLabel, darkLabel, onToggle }: ThemeToggleButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-10 w-full" />;
  }

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    onToggle?.();
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      {theme === "dark" ? (
        <>
          <Sun className="mr-2 h-4 w-4" />
          {lightLabel}
        </>
      ) : (
        <>
          <Moon className="mr-2 h-4 w-4" />
          {darkLabel}
        </>
      )}
    </Button>
  );
}
