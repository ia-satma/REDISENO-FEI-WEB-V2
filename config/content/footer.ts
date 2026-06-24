import { brand } from "../brand";

export const footerContent = {
  description:
    "Infraestructura de evidencia fiscal para empresas mexicanas. Construimos expedientes de materialidad que sustentan tus operaciones.",
  copyright: `\u00a9 ${new Date().getFullYear()} ${brand.name}. Todos los derechos reservados.`,
  // draft: fundamentos legales pendientes de validaci\u00f3n con abogado fiscal antes de publicar.
  certifications: [
    { label: "LISR Arts. 25 y 27", draft: true },
    { label: "CFF Arts. 29, 29-A y 30", draft: true },
    { label: "Criterios de materialidad fiscal", draft: false },
  ],
  newsletter: {
    title: "Inteligencia Fiscal",
    description:
      "Art\u00edculos sobre materialidad, defensa ante el SAT y mejores pr\u00e1cticas documentales.",
    placeholder: "tu@empresa.com",
    ctaLabel: "Suscribirse",
    loadingLabel: "Suscribiendo...",
    successMessage: "\u00a1Suscripci\u00f3n exitosa!",
    errorMessage: "No se pudo suscribir. Intenta de nuevo.",
  },
} as const;

export type FooterContent = typeof footerContent;
