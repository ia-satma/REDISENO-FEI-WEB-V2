import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem",
        md: ".375rem",
        sm: ".1875rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        cyan: {
          DEFAULT: "#4CC9F0",
          dark: "#3BA8D0",
          light: "#7DD8F4",
          50: "#edfaff",
          100: "#d6f2ff",
          200: "#b5e9ff",
          300: "#83ddff",
          400: "#4CC9F0",
          500: "#26aede",
          600: "#1790c0",
          700: "#14749b",
          800: "#166180",
          900: "#18516a",
        },
        navy: {
          DEFAULT: "#1A2332",
          light: "#2D3A4E",
          dark: "#0D1117",
          50: "#f0f3f7",
          100: "#d9dee8",
          200: "#b3bdd0",
          300: "#8d9cb9",
          400: "#6a7fa3",
          500: "#4e6489",
          600: "#3c4e6c",
          700: "#2D3A4E",
          800: "#1A2332",
          900: "#0D1117",
        },
        dark: "#0D1117",
        // Payana-derived accents brought into FEI
        mint: {
          DEFAULT: "#97FFEB",
          soft: "#D3FFF6",
          deep: "#16C9A6",
        },
        sky: "#D9E5FF",
        lavender: "#ECE9FF",
        cream: "#FFFCF3",
        purple: {
          DEFAULT: "#7B61FF",
          dark: "#6348E0",
          light: "#9B85FF",
          50: "#f3f0ff",
          100: "#e5deff",
          200: "#cdc0ff",
          300: "#b09aff",
          400: "#9B85FF",
          500: "#7B61FF",
          600: "#6348E0",
          700: "#4D35B8",
          800: "#3C2A8E",
          900: "#2D2068",
        },
      },
      fontFamily: {
        // Payana pairing, license-free: Hanken Grotesk (Apercu-style) body, Inter headings.
        sans: ["Hanken Grotesk", "Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan-sm": "0 0 12px rgba(76, 201, 240, 0.15)",
        "glow-cyan": "0 0 24px rgba(76, 201, 240, 0.25)",
        "glow-cyan-md": "0 0 32px rgba(76, 201, 240, 0.30)",
        "glow-cyan-lg": "0 0 48px rgba(76, 201, 240, 0.35)",
        "glow-cyan-xl": "0 0 64px rgba(76, 201, 240, 0.40)",
        "card-dark": "0 4px 24px rgba(0, 0, 0, 0.35)",
        "card-dark-lg": "0 8px 40px rgba(0, 0, 0, 0.45)",
        "card-elevated": "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 1px rgba(76, 201, 240, 0.1)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-cyan": "linear-gradient(135deg, #4CC9F0 0%, #3BA8D0 100%)",
        "gradient-cyan-r": "linear-gradient(135deg, #3BA8D0 0%, #4CC9F0 100%)",
        "gradient-dark": "linear-gradient(180deg, #0D1117 0%, #1A2332 100%)",
        "gradient-dark-r": "linear-gradient(180deg, #1A2332 0%, #0D1117 100%)",
        "gradient-navy": "linear-gradient(135deg, #1A2332 0%, #2D3A4E 100%)",
      },
      backdropBlur: {
        xs: "2px",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(32px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "counter-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 16px rgba(76,201,240,0.2)" },
          "50%": { boxShadow: "0 0 32px rgba(76,201,240,0.45)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(8px)" },
          to: { opacity: "1", filter: "blur(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "fade-in-down": "fade-in-down 0.5s ease-out forwards",
        "fade-in-scale": "fade-in-scale 0.5s ease-out forwards",
        "counter-up": "counter-up 0.4s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "blur-in": "blur-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
