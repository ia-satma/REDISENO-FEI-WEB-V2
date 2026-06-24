export const faqContent = {
  hero: {
    eyebrow: "Preguntas Frecuentes",
    title: "Todo lo que necesitas saber sobre materialidad fiscal",
  },

  categories: [
    {
      title: "Sobre Materialidad Fiscal",
      questions: [
        {
          question: "\u00bfQu\u00e9 es la materialidad fiscal?",
          answer:
            "La materialidad fiscal es la capacidad de demostrar, con evidencia documental suficiente, que una operaci\u00f3n realmente ocurri\u00f3, fue necesaria, fue ejecutada y tuvo sustancia econ\u00f3mica. Se sostiene en 15 elementos cr\u00edticos, desde la existencia del proveedor hasta la evidencia de ejecuci\u00f3n del servicio. Sin materialidad documentada, el soporte de tus deducciones queda expuesto en una revisi\u00f3n.",
        },
        {
          question: "\u00bfQu\u00e9 son los 15 elementos de materialidad?",
          answer:
            "Son los criterios que el SAT utiliza para evaluar si una operaci\u00f3n es real: (1) existencia del proveedor, (2) capacidad t\u00e9cnica, (3) capacidad material, (4) personal calificado, (5) contrato formal, (6) orden de trabajo, (7) evidencia de ejecuci\u00f3n, (8) entregables, (9) acta de entrega, (10) correspondencia, (11) pagos bancarizados, (12) CFDIs, (13) p\u00f3lizas contables, (14) razonabilidad del gasto, (15) beneficio empresarial demostrable.",
        },
        {
          question: "\u00bfPor qu\u00e9 no basta con tener facturas?",
          answer:
            "La factura (CFDI) solo demuestra que se emiti\u00f3 un comprobante fiscal. No demuestra que el servicio se prest\u00f3, que fue necesario, ni que realmente se ejecut\u00f3. En una revisi\u00f3n fiscal, la empresa debe poder sustentar con evidencia documental la sustancia econ\u00f3mica de cada operaci\u00f3n.",
        },
      ],
    },
    {
      title: "Sobre el Servicio FEI",
      questions: [
        {
          question: "\u00bfQu\u00e9 incluye un expediente de materialidad?",
          answer:
            "Cada expediente incluye m\u00e1s de 50 documentos organizados en 9 carpetas: identidad corporativa, contrataci\u00f3n, cumplimiento del proveedor, ejecuci\u00f3n, entregables t\u00e9cnicos, cierre, fiscal-contable, defensa preventiva y bit\u00e1cora de trazabilidad. Todo organizado para responder ante una revisi\u00f3n fiscal.",
        },
        {
          question: "\u00bfCu\u00e1nto tiempo toma construir un expediente?",
          answer:
            "El proceso est\u00e1ndar toma 3 semanas: semana 1 para diagn\u00f3stico, semana 2 para construcci\u00f3n documental, semana 3 para entrega y capacitaci\u00f3n. Para operaciones urgentes, ofrecemos un proceso acelerado.",
        },
        {
          question: "\u00bfNecesito un expediente por cada operaci\u00f3n?",
          answer:
            "S\u00ed. Cada operaci\u00f3n (contrato, servicio, compra) que quieras deducir necesita su propio expediente de materialidad. Esto es justamente lo que se revisa operaci\u00f3n por operaci\u00f3n en materia de materialidad fiscal.",
        },
        {
          question: "\u00bfQu\u00e9 pasa si ya tengo una auditor\u00eda en curso?",
          answer:
            "Podemos ayudarte a construir la evidencia de forma retroactiva mediante un proceso de regularizaci\u00f3n. No es ideal (siempre es mejor prevenir), pero es significativamente mejor que enfrentar la auditor\u00eda sin documentaci\u00f3n.",
        },
      ],
    },
    {
      title: "Sobre Costos y Proceso",
      questions: [
        {
          question: "\u00bfCu\u00e1nto cuesta el servicio?",
          answer:
            "El costo depende del n\u00famero de operaciones y su complejidad. Ofrecemos un diagn\u00f3stico inicial sin compromiso donde evaluamos tu situaci\u00f3n documental y presentamos una propuesta detallada. El valor documental estructurado equivale, en promedio, a 35x la inversi\u00f3n.",
        },
        {
          question: "\u00bfC\u00f3mo empiezo?",
          answer:
            "Agenda una llamada de diagn\u00f3stico de 30 minutos sin compromiso. Evaluamos tu situaci\u00f3n fiscal, identificamos las operaciones prioritarias y te presentamos un plan de acci\u00f3n con cotizaci\u00f3n.",
        },
      ],
    },
  ],
} as const;

export type FAQContent = typeof faqContent;
