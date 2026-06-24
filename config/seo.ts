import { brand } from "./brand";

export const seo = {
  defaults: {
    titleTemplate: `%s | ${brand.name}`,
    defaultTitle: `${brand.name} \u2014 ${brand.tagline}`,
    description:
      "Construimos la infraestructura documental que protege tus operaciones fiscales. Expedientes de materialidad con +50 documentos de soporte por operaci\u00f3n.",
    ogImage: "/og-image.jpg",
    locale: "es_MX",
    type: "website" as const,
    siteName: brand.name,
  },
  pages: {
    home: {
      title: `${brand.name} \u2014 ${brand.tagline}`,
      description:
        "Construimos la infraestructura documental que protege tus operaciones fiscales. Expedientes con +50 documentos por operaci\u00f3n.",
    },
    servicios: {
      title: "Servicios de Materialidad Fiscal",
      description:
        "Diagn\u00f3stico fiscal, construcci\u00f3n de evidencia documental y defensa preventiva para empresas mexicanas.",
    },
    metodologia: {
      title: "Metodolog\u00eda FEI",
      description:
        "4 fases sistem\u00e1ticas: contrataci\u00f3n, ejecuci\u00f3n, entrega y cierre. Cada expediente es un traje a la medida.",
    },
    materialidad: {
      title: "\u00bfQu\u00e9 es la Materialidad Fiscal?",
      description:
        "La materialidad fiscal es la capacidad de demostrar que una operaci\u00f3n realmente ocurri\u00f3. El SAT exige 15 elementos de prueba.",
    },
    impacto: {
      title: "Impacto y Resultados",
      description:
        "M\u00e1s de $1,200 MDP en operaciones protegidas. ROI promedio de 35x sobre la inversi\u00f3n en materialidad.",
    },
    blog: {
      title: "Blog \u2014 Inteligencia Fiscal",
      description:
        "Art\u00edculos sobre materialidad fiscal, defensa ante el SAT, y mejores pr\u00e1cticas de evidencia documental.",
    },
    contacto: {
      title: "Agenda tu Demo",
      description:
        "Evaluamos tu situaci\u00f3n fiscal sin compromiso. Agenda una llamada con nuestros especialistas.",
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
