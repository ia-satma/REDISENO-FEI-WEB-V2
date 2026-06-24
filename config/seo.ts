import { brand } from "./brand";

export const seo = {
  defaults: {
    titleTemplate: `%s | ${brand.name}`,
    defaultTitle: `${brand.name} \u2014 ${brand.tagline}`,
    description:
      "Construimos, organizamos y validamos los expedientes de materialidad fiscal que sustentan tus operaciones ante revisiones fiscales. +50 documentos estructurados por operaci\u00f3n.",
    ogImage: "/og-image.jpg",
    locale: "es_MX",
    type: "website" as const,
    siteName: brand.name,
  },
  pages: {
    home: {
      title: `${brand.name} \u2014 ${brand.tagline}`,
      description:
        "Construimos, organizamos y validamos expedientes de materialidad fiscal que sustentan tus operaciones. +50 documentos estructurados por operaci\u00f3n.",
    },
    servicios: {
      title: "Servicios de Materialidad Fiscal",
      description:
        "Diagn\u00f3stico de materialidad, expediente documental fiscal y defensa preventiva para empresas mexicanas.",
    },
    metodologia: {
      title: "Metodolog\u00eda FEI",
      description:
        "4 fases de construcci\u00f3n documental: diagn\u00f3stico, ejecuci\u00f3n, entrega y cierre fiscal. Un expediente trazable y preparado para revisi\u00f3n.",
    },
    materialidad: {
      title: "Los 15 elementos cr\u00edticos de materialidad fiscal",
      description:
        "La materialidad fiscal consiste en demostrar, con evidencia documental suficiente, que una operaci\u00f3n realmente ocurri\u00f3. Se sostiene en 15 elementos cr\u00edticos.",
    },
    impacto: {
      title: "Impacto y Resultados",
      description:
        "M\u00e1s de $1,200 millones en operaciones con expediente fiscal estructurado. 35x de valor documental soportado frente a la inversi\u00f3n.",
    },
    blog: {
      title: "Blog \u2014 Inteligencia Fiscal",
      description:
        "Art\u00edculos sobre materialidad fiscal, preparaci\u00f3n ante revisiones y mejores pr\u00e1cticas de evidencia documental.",
    },
    contacto: {
      title: "Agenda un diagn\u00f3stico",
      description:
        "Evaluamos tu situaci\u00f3n documental sin compromiso. Agenda una llamada con nuestros especialistas.",
    },
    faq: {
      title: "Preguntas Frecuentes",
      description:
        "\u00bfQu\u00e9 incluye un expediente de materialidad? \u00bfCu\u00e1nto toma? Resolvemos tus dudas sobre el proceso FEI.",
    },
    legal: {
      title: "Aviso de Privacidad",
      description: "Aviso de privacidad de FEI Consultores conforme a la LFPDPPP.",
    },
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brand.name,
    description: "Infraestructura de Evidencia Fiscal para empresas mexicanas",
    url: `https://${brand.domain}`,
    telephone: brand.contact.phone,
    email: brand.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Monterrey",
      addressRegion: "Nuevo Le\u00f3n",
      addressCountry: "MX",
    },
    areaServed: {
      "@type": "Country",
      name: "M\u00e9xico",
    },
    serviceType: [
      "Materialidad Fiscal",
      "Evidencia Documental",
      "Defensa Fiscal Preventiva",
      "Consultor\u00eda Fiscal",
    ],
  },
} as const;

export type SEO = typeof seo;
