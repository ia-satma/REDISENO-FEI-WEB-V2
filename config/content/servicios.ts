export const serviciosContent = {
  hero: {
    eyebrow: "Nuestros Servicios",
    title: "Materialidad fiscal que sustenta tu operación",
    subtitle:
      "Tres líneas de servicio diseñadas para cubrir cada ángulo de tu exposición documental.",
  },

  services: [
    {
      id: "diagnostico",
      icon: "Search",
      title: "Diagnóstico de Materialidad",
      subtitle: "Evaluación documental de tus operaciones",
      description:
        "Analizamos tus operaciones frente a 15 elementos críticos de materialidad fiscal. Identificamos brechas documentales, priorizamos riesgos y diseñamos un plan de integración del expediente.",
      includes: [
        "Análisis de operaciones actuales",
        "Evaluación de 15 elementos críticos de materialidad",
        "Mapa de brechas documentales",
        "Plan de integración documental priorizado",
        "Reporte ejecutivo de hallazgos",
      ],
      result: "Identificas tus brechas documentales y el plan para cerrarlas.",
    },
    {
      id: "evidencia",
      icon: "FileStack",
      title: "Expediente Documental Fiscal",
      subtitle: "Expedientes documentales de materialidad fiscal",
      description:
        "Construimos el expediente documental de cada operación con evidencia contractual, operativa, fiscal y contable. La documentación se organiza en una estructura de carpetas y matrices preparada para consulta, revisión y seguimiento.",
      includes: [
        "Contrato de servicios profesionales",
        "Documentación de ejecución (minutas, reportes, correspondencia)",
        "Entregables técnicos completos (7+ por operación)",
        "Pólizas contables y conciliación fiscal",
        "Teoría del caso y matriz de consistencia documental",
      ],
      result: "Expediente estructurado y preparado para revisión.",
    },
    {
      id: "defensa",
      icon: "Shield",
      title: "Defensa Fiscal Preventiva",
      subtitle: "Preparación ante requerimientos de la autoridad",
      description:
        "No esperamos a que llegue un requerimiento. Preparamos el expediente documental desde antes, integrando teoría del caso, matriz de consistencia y soporte organizado para responder con mayor claridad ante una revisión fiscal.",
      includes: [
        "Teoría del caso por operación",
        "Matriz de consistencia documental",
        "Memo de riesgos identificados",
        "Estrategia de respuesta ante requerimientos",
        "Soporte técnico ante requerimientos de autoridad",
      ],
      result: "Si llega una revisión, tu evidencia ya está organizada.",
    },
  ],

  process: {
    title: "¿Cómo funciona?",
    steps: [
      { number: "1", title: "Agenda un diagnóstico", description: "Llamada inicial de 30 minutos para entender tus operaciones y nivel de exposición documental." },
      { number: "2", title: "Evaluamos", description: "Analizamos tus operaciones, documentos existentes y brechas frente a los elementos críticos de materialidad." },
      { number: "3", title: "Construimos", description: "Integramos evidencia contractual, operativa, fiscal y contable en un expediente estructurado por operación." },
      { number: "4", title: "Entregamos", description: "Entregamos el expediente organizado, la matriz de consistencia y las recomendaciones de mantenimiento documental." },
    ],
  },
} as const;

export type ServiciosContent = typeof serviciosContent;
