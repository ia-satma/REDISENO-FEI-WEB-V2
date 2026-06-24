import { brand } from "./brand";

/** Single source of truth for the production origin (centralized in brand.domain).
 *  Change the domain ONCE in config/brand.ts and every canonical/OG/sitemap/JSON-LD
 *  surface follows. */
export const SITE = `https://${brand.domain}`;

/** Local SEO / GEO signals (Monterrey, Nuevo León). */
export const GEO = {
  region: "MX-NLE",
  placename: "Monterrey",
  lat: 25.6866,
  lng: -100.3161,
} as const;

export const seo = {
  defaults: {
    titleTemplate: `%s | ${brand.name}`,
    defaultTitle: `${brand.name} — ${brand.tagline}`,
    description:
      "Construimos, organizamos y validamos los expedientes de materialidad fiscal que sustentan tus operaciones ante revisiones fiscales. +50 documentos estructurados por operación.",
    ogImage: "/og-image.jpg",
    locale: "es_MX",
    type: "website" as const,
    siteName: brand.name,
  },
  pages: {
    home: {
      title: "Expedientes de Materialidad Fiscal listos para auditoría | FEI Consultores",
      description:
        "Construimos, organizamos y validamos expedientes de materialidad fiscal que sustentan tus operaciones ante revisiones fiscales. +50 documentos estructurados por operación.",
    },
    servicios: {
      title: "Servicios de Materialidad Fiscal",
      description:
        "Diagnóstico de materialidad, expediente documental fiscal y defensa preventiva para empresas mexicanas.",
    },
    metodologia: {
      title: "Metodología FEI",
      description:
        "4 fases de construcción documental: diagnóstico, ejecución, entrega y cierre fiscal. Un expediente trazable y preparado para revisión.",
    },
    materialidad: {
      title: "Los 15 elementos críticos de materialidad fiscal",
      description:
        "La materialidad fiscal consiste en demostrar, con evidencia documental suficiente, que una operación realmente ocurrió. Se sostiene en 15 elementos críticos.",
    },
    impacto: {
      title: "Impacto y Resultados",
      description:
        "Más de $1,200 millones en operaciones con expediente fiscal estructurado. 35x de valor documental soportado frente a la inversión.",
    },
    seguridad: {
      title: "Seguridad y Custodia del Expediente Fiscal",
      description:
        "Cadena de custodia documental, estructura de 9 carpetas, trazabilidad, seguridad de la información y alcance claro del servicio.",
    },
    blog: {
      title: "Blog — Inteligencia Fiscal",
      description:
        "Artículos sobre materialidad fiscal, preparación ante revisiones y mejores prácticas de evidencia documental.",
    },
    contacto: {
      title: "Agenda un diagnóstico",
      description:
        "Evaluamos tu situación documental sin compromiso. Agenda una llamada con nuestros especialistas.",
    },
    faq: {
      title: "Preguntas Frecuentes sobre Materialidad Fiscal",
      description:
        "¿Qué incluye un expediente de materialidad? ¿Cuánto toma? Resolvemos tus dudas sobre el proceso FEI.",
    },
    legal: {
      title: "Aviso de Privacidad",
      description: "Aviso de privacidad de FEI Consultores conforme a la LFPDPPP.",
    },
  },
} as const;

export type SEO = typeof seo;
