export const serviciosContent = {
  hero: {
    eyebrow: "Nuestros Servicios",
    title: "Materialidad fiscal que protege tu operaci\u00f3n",
    subtitle:
      "Tres l\u00edneas de servicio dise\u00f1adas para cubrir cada \u00e1ngulo de tu exposici\u00f3n fiscal.",
  },

  services: [
    {
      id: "diagnostico",
      icon: "Search",
      title: "Diagn\u00f3stico de Materialidad",
      subtitle: "Evaluaci\u00f3n completa de tu situaci\u00f3n fiscal",
      description:
        "Analizamos tus operaciones contra los 15 elementos de materialidad que el SAT eval\u00faa. Identificamos brechas, priorizamos riesgos y dise\u00f1amos el plan de blindaje.",
      includes: [
        "An\u00e1lisis de operaciones actuales",
        "Evaluaci\u00f3n de 15 elementos de materialidad",
        "Mapa de riesgos fiscales",
        "Plan de acci\u00f3n priorizado",
        "Reporte ejecutivo de hallazgos",
      ],
      result: "Sabes exactamente d\u00f3nde est\u00e1s y qu\u00e9 necesitas.",
    },
    {
      id: "evidencia",
      icon: "FileStack",
      title: "Organización de Evidencia Documental",
      subtitle: "Expedientes completos de materialidad",
      description:
        "Construimos el expediente documental completo para cada operaci\u00f3n. M\u00e1s de 50 documentos organizados en 9 carpetas, listos para cualquier revisi\u00f3n del SAT.",
      includes: [
        "Contrato de servicios profesionales",
        "Documentaci\u00f3n de ejecuci\u00f3n (minutas, reportes, correspondencia)",
        "Entregables t\u00e9cnicos completos (7+ por operaci\u00f3n)",
        "P\u00f3lizas contables y conciliaci\u00f3n fiscal",
        "Teor\u00eda del caso y defensa preventiva",
      ],
      result: "Expediente blindado listo para auditor\u00eda.",
    },
    {
      id: "defensa",
      icon: "Shield",
      title: "Defensa Fiscal Preventiva",
      subtitle: "Preparaci\u00f3n ante requerimientos del SAT",
      description:
        "No esperamos a que llegue el requerimiento. Construimos la defensa antes de que la necesites. Teor\u00eda del caso, matriz de consistencia y estrategia de respuesta documentada.",
      includes: [
        "Teor\u00eda del caso por operaci\u00f3n",
        "Matriz de consistencia documental",
        "Memo de riesgos identificados",
        "Estrategia de respuesta ante requerimientos",
        "Soporte t\u00e9cnico en caso de auditor\u00eda",
      ],
      result: "Si llega la auditor\u00eda, ya est\u00e1s listo.",
    },
  ],

  process: {
    title: "\u00bfC\u00f3mo funciona?",
    steps: [
      { number: "1", title: "Agenda", description: "Llamada de diagn\u00f3stico sin compromiso de 30 minutos." },
      { number: "2", title: "Evaluamos", description: "Analizamos tus operaciones y dise\u00f1amos tu expediente." },
      { number: "3", title: "Construimos", description: "Generamos toda la evidencia documental." },
      { number: "4", title: "Entregamos", description: "Expediente completo listo para auditor\u00eda." },
    ],
  },
} as const;

export type ServiciosContent = typeof serviciosContent;
