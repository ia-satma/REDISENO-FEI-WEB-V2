import { brand } from "../brand";

export const footerContent = {
  description:
    "Infraestructura de evidencia fiscal para empresas mexicanas. Construimos expedientes de materialidad que protegen tus operaciones.",
  copyright: `\u00a9 ${new Date().getFullYear()} ${brand.name}. Todos los derechos reservados.`,
  certifications: [
    "Cumplimiento LISR Art. 5\u00b0",
    "Norma CFF Art. 29/29-A",
    "Criterios SAT Materialidad",
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
