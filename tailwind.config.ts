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
          tint: "hsl(var(--primary-tint))",
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
        // Editorial ramps. The legacy `coral`/`teal`/`amber` keys are kept but
        // repointed to rust / forest / ochre so existing utility classes stay on-palette.
        coral: {
          50: "#FBF1EC",
          100: "#F1DDD2",
          200: "#E6C4B5",
          300: "#D6A18C",
          400: "#C2664B",
          500: "#A8452B",
          600: "#8C3820",
          700: "#74301C",
          800: "#5F2818",
          900: "#4A2014",
        },
        teal: {
          50: "#EEF4F1",
          100: "#DCE8E1",
          200: "#BBD1C6",
          300: "#8DB3A3",
          400: "#5A8B78",
          500: "#3D7361",
          600: "#2F5D4E",
          700: "#274C40",
          800: "#1F3B32",
          900: "#182E27",
        },
        amber: {
          50: "#FAF3E1",
          100: "#F2E7CB",
          200: "#E6D19B",
          300: "#D4B463",
          400: "#BE982F",
          500: "#A5831F",
          600: "#93701E",
          700: "#78591A",
          800: "#5F4716",
          900: "#4B3812",
        },
        // Raw editorial tokens (match the design system's named scales).
        cream: {
          50: "#FBF9F4",
          100: "#F6F2E9",
          200: "#EFE9DA",
          300: "#E4DBC6",
        },
        ink: {
          200: "#CBC4B3",
          300: "#A69F8F",
          500: "#6F6A5E",
          700: "#39332A",
          900: "#191510",
        },
        rust: {
          100: "#F1DDD2",
          600: "#A8452B",
          700: "#8C3820",
        },
        forest: {
          100: "#DCE8E1",
          600: "#2F5D4E",
        },
        ochre: {
          100: "#F2E7CB",
          600: "#93701E",
        },
        brick: {
          100: "#F0DAD3",
          600: "#8C3B2E",
        },
        // Opportunity-score semantics (0–100).
        score: {
          high: "hsl(var(--score-high))",
          "high-tint": "hsl(var(--score-high-tint))",
          mid: "hsl(var(--score-mid))",
          "mid-tint": "hsl(var(--score-mid-tint))",
          low: "hsl(var(--score-low))",
          "low-tint": "hsl(var(--score-low-tint))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--sidebar-foreground))",
          active: "hsl(var(--sidebar-active))",
          hover: "hsl(var(--sidebar-hover))",
        },
      },
      borderRadius: {
        xl: "20px",
        lg: "var(--radius)", // 14px
        md: "10px",
        sm: "6px",
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
      // Very soft, warm-tinted shadows — used only to lift cards off the cream page.
      boxShadow: {
        "card-xs": "0 1px 2px rgba(25, 21, 16, 0.05)",
        "card-sm": "0 2px 6px rgba(25, 21, 16, 0.06)",
        "card-md": "0 6px 20px rgba(25, 21, 16, 0.08)",
        "card-lg": "0 16px 40px rgba(25, 21, 16, 0.10)",
        "card-hover": "0 16px 40px rgba(25, 21, 16, 0.10)",
      },
    },
  },
  plugins: [tailwindAnimate, typography],
};

export default config;
