export const brand = {
  name: "FEI Consultores",
  tagline: "Expedientes de Materialidad Fiscal",
  // Production origin — change ONCE here; SITE in config/seo.ts derives from it
  // and every canonical/OG/sitemap/JSON-LD surface follows. (Pending: confirm
  // final domain; email uses @feiconsultoria.mx — align NAP before launch.)
  domain: "feiconsultores.com",
  contact: {
    email: "contacto@feiconsultoria.mx",
    phone: "(+52) 55 2303-2000",
    location: "Monterrey, N.L., M\u00e9xico",
  },
  colors: {
    primary: "#4CC9F0",
    primaryDark: "#3BA8D0",
    primaryLight: "#7DD8F4",
    navy: "#1A2332",
    navyLight: "#2D3A4E",
    dark: "#0D1117",
    white: "#FFFFFF",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    accent: {
      red: "#DC2626",
      green: "#16A34A",
      amber: "#D97706",
    },
  },
  logo: {
    main: "/logo.png",
    white: "/logo-white.png",
  },
  social: {
    linkedin: "https://linkedin.com/company/fei-consultores",
  },
} as const;

export type Brand = typeof brand;
