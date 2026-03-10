import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        coral: {
          50: "#fff5f2",
          100: "#ffe8e1",
          200: "#ffd0c3",
          300: "#ffab94",
          400: "#ff7f5c",
          500: "#ff6b4a",
          600: "#e5502f",
          700: "#c03d22",
          800: "#9d331f",
          900: "#822e1f",
        },
        teal: {
          50: "#effef8",
          100: "#c8feed",
          200: "#95fadb",
          300: "#52f0c6",
          400: "#2dd4a8",
          500: "#0abf94",
          600: "#039a79",
          700: "#057b63",
          800: "#096150",
          900: "#094f43",
        },
        amber: {
          50: "#fffbeb",
          100: "#fff3c6",
          200: "#ffe588",
          300: "#ffd24a",
          400: "#ffb547",
          500: "#f99b1c",
          600: "#dd7408",
          700: "#b7520b",
          800: "#943f10",
          900: "#7a3411",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--sidebar-foreground))",
          active: "hsl(var(--sidebar-active))",
          hover: "hsl(var(--sidebar-hover))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "bounce-click": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
        "bounce-click": "bounce-click 0.15s ease-in-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      boxShadow: {
        "card-sm": "0 1px 3px 0 hsl(var(--foreground) / 0.04), 0 1px 2px -1px hsl(var(--foreground) / 0.04)",
        "card-md": "0 4px 12px -2px hsl(var(--foreground) / 0.06), 0 2px 4px -1px hsl(var(--foreground) / 0.04)",
        "card-lg": "0 8px 24px -4px hsl(var(--color-primary) / 0.08), 0 4px 8px -2px hsl(var(--foreground) / 0.04)",
        "card-hover": "0 12px 32px -4px hsl(var(--color-primary) / 0.12), 0 6px 12px -2px hsl(var(--foreground) / 0.06)",
      },
    },
  },
  plugins: [tailwindAnimate, typography],
};

export default config;
