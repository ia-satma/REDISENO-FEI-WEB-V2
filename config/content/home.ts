import { serviciosContent } from "./servicios";

export const homeContent = {
  hero: {
    badge: "Materialidad Fiscal Documentada",
    title: "Expedientes de Materialidad Fiscal listos para auditor\u00eda",
    titleParts: {
      prefix: "Expedientes de Materialidad Fiscal",
      rotating: ["trazables", "consistentes", "defendibles", "preparados"],
      suffix: "para auditor\u00eda",
    },
    subtitle:
      "Construimos, organizamos y validamos la evidencia documental que respalda tus operaciones ante revisiones fiscales. Cada operaci\u00f3n queda estructurada en expedientes trazables, consistentes y defendibles.",
    stats: [
      { value: "15/15", label: "Elementos cr\u00edticos de materialidad fiscal" },
      { value: "4", label: "Fases de construcci\u00f3n documental" },
      { value: "+50", label: "Documentos estructurados por operaci\u00f3n" },
    ],
    cta: { label: "Agenda un diagn\u00f3stico", href: "/contacto" },
    ctaSecondary: { label: "Conoce la metodolog\u00eda", href: "/metodologia" },
  },

  contexto: {
    sectionId: "contexto",
    eyebrow: "El Contexto",
    title: "La brecha entre operar y poder probarlo",
    description:
      "Tu empresa puede operar correctamente, emitir facturas, pagar impuestos y cumplir contratos. El problema surge cuando una autoridad pregunta: \u00bfc\u00f3mo demuestras que esta operaci\u00f3n realmente ocurri\u00f3, fue necesaria y gener\u00f3 un beneficio empresarial?",
    cards: [
      {
        icon: "FileWarning",
        title: "\u00bfTienes contrato firmado?",
        description:
          "No basta con facturar. En una revisi\u00f3n fiscal, la empresa debe poder sustentar con evidencia documental que el servicio fue real, necesario, ejecutado y razonable.",
      },
      {
        icon: "Scale",
        title: "\u00bfPuedes demostrar la ejecuci\u00f3n?",
        description:
          "Minutas de trabajo, reportes de avance, entregables t\u00e9cnicos, correspondencia. Sin esto, el soporte de tu deducci\u00f3n queda incompleto.",
      },
      {
        icon: "ShieldAlert",
        title: "\u00bfTu expediente est\u00e1 preparado para revisi\u00f3n?",
        description:
          "En diagn\u00f3sticos documentales es com\u00fan encontrar operaciones con evidencia parcial, dispersa o incompleta. Eso es un expediente con brechas documentales.",
      },
      {
        icon: "TrendingDown",
        title: "\u00bfCu\u00e1nto cuesta no estar preparado?",
        description:
          "Una deducci\u00f3n rechazada implica el pago del ISR no deducido, m\u00e1s actualizaci\u00f3n, m\u00e1s recargos, m\u00e1s multas de hasta el 75%.",
      },
    ],
    banner: "El SAT no cuestiona si pagaste \u2014 cuestiona si puedes probarlo.",
  },

  problema: {
    sectionId: "problema",
    eyebrow: "El Problema",
    stat: { value: "6/15", label: "elementos de materialidad cubiertos en promedio" },
    title: "La mayor\u00eda de las empresas mexicanas son fiscalmente vulnerables",
    cards: [
      {
        icon: "Receipt",
        variant: "danger" as const,
        title: "Riesgo Fiscal",
        description:
          "Deducciones rechazadas por falta de soporte documental. Cr\u00e9ditos fiscales no reconocidos. Determinaciones presuntivas del SAT.",
      },
      {
        icon: "Building2",
        variant: "warning" as const,
        title: "Riesgo Operativo",
        description:
          "Contratos sin evidencia de ejecuci\u00f3n. Pagos sin soporte de entrega. Proveedores sin validaci\u00f3n de cumplimiento fiscal.",
      },
      {
        icon: "Users",
        variant: "info" as const,
        title: "Riesgo Directivo",
        description:
          "Responsabilidad solidaria de administradores. Implicaciones penales por simulaci\u00f3n de operaciones. Da\u00f1o reputacional irreversible.",
      },
    ],
    banner: "No es cuesti\u00f3n de si te van a auditar \u2014 es cu\u00e1ndo.",
  },

  solucion: {
    sectionId: "solucion",
    eyebrow: "La Soluci\u00f3n",
    title: "La arquitectura de tu expediente fiscal",
    subtitle:
      "No somos un despacho contable tradicional. Somos una metodolog\u00eda documental que construye, organiza y valida la evidencia necesaria para sustentar operaciones empresariales ante revisiones fiscales.",
    columns: [
      {
        icon: "BrainCircuit",
        title: "Especialistas en evidencia fiscal",
        description:
          "Equipo dedicado a construir expedientes de materialidad fiscal con enfoque documental, operativo, contable y fiscal.",
      },
      {
        icon: "Cpu",
        title: "Automatizaci\u00f3n inteligente",
        description:
          "Tecnolog\u00eda que apoya la generaci\u00f3n, clasificaci\u00f3n, validaci\u00f3n y organizaci\u00f3n de evidencia documental por operaci\u00f3n, reduciendo errores, omisiones e inconsistencias.",
      },
      {
        icon: "FolderCheck",
        title: "Expedientes estructurados",
        description:
          "Cada expediente se organiza alrededor de elementos cr\u00edticos de materialidad fiscal, integrando documentos contractuales, operativos, fiscales, contables y de razonabilidad econ\u00f3mica.",
      },
    ],
    banner: "Construimos la evidencia que tus operaciones necesitan para sustentar su materialidad.",
  },

  metodologia: {
    sectionId: "metodologia",
    eyebrow: "La Metodolog\u00eda",
    title: "4 fases sistem\u00e1ticas",
    subtitle:
      "No aplicamos formatos gen\u00e9ricos. Analizamos la naturaleza de cada operaci\u00f3n, identificamos la evidencia requerida y construimos un expediente documental consistente, trazable y preparado para revisi\u00f3n.",
    phases: [
      {
        number: "01",
        title: "Diagn\u00f3stico y alcance",
        description:
          "Evaluamos la operaci\u00f3n, definimos el alcance documental y establecemos la base contractual necesaria para construir el expediente de materialidad.",
        items: ["Diagn\u00f3stico de materialidad", "Contrato mercantil o de servicios", "Acuerdo de confidencialidad", "Orden o alcance de trabajo"],
      },
      {
        number: "02",
        title: "Ejecuci\u00f3n y documentaci\u00f3n",
        description:
          "Durante la prestaci\u00f3n del servicio, recopilamos y estructuramos evidencia viva de ejecuci\u00f3n: minutas, reportes, correspondencia formal y controles de avance.",
        items: ["Minutas de trabajo", "Reportes de avance", "Correspondencia formal", "Control de calidad documental"],
      },
      {
        number: "03",
        title: "Entrega y validaci\u00f3n",
        description:
          "Integramos los entregables t\u00e9cnicos, actas de entrega-recepci\u00f3n y evidencia de aceptaci\u00f3n para demostrar que el servicio fue efectivamente recibido.",
        items: ["Entregables t\u00e9cnicos", "Acta de entrega-recepci\u00f3n", "Carta de satisfacci\u00f3n o aceptaci\u00f3n", "Gu\u00eda operativa o evidencia final"],
      },
      {
        number: "04",
        title: "Cierre fiscal y expediente final",
        description:
          "Integramos el soporte contable, fiscal y documental para generar un expediente consistente, trazable y preparado para una eventual revisi\u00f3n.",
        items: ["P\u00f3lizas contables", "Conciliaci\u00f3n fiscal", "Teor\u00eda del caso", "Matriz de consistencia documental"],
      },
    ],
    banner: "Cada fase genera evidencia real \u2014 no documentos de relleno.",
  },

  impacto: {
    sectionId: "impacto",
    eyebrow: "El Impacto",
    title: "Resultados que hablan",
    metrics: [
      { value: "$1,200", suffix: "M", label: "En operaciones con expediente fiscal estructurado" },
      { value: "180", suffix: "", label: "Operaciones documentadas durante un ejercicio fiscal" },
      { value: "35", suffix: "x", label: "Valor documental soportado frente a la inversi\u00f3n" },
    ],
    banner: "Por cada peso invertido en documentaci\u00f3n fiscal, se estructuran hasta 35 pesos en deducciones soportadas documentalmente.",
  },

  comparativa: {
    sectionId: "comparativa",
    eyebrow: "La Comparativa",
    title: "Sin FEI vs. Con FEI",
    without: {
      label: "Sin FEI",
      variant: "danger" as const,
      items: [
        "Evidencia documental parcial o dispersa",
        "Operaciones con soporte incompleto",
        "Mayor exposici\u00f3n ante revisiones fiscales",
        "Respuesta reactiva ante requerimientos",
        "Falta de matriz documental por operaci\u00f3n",
        "Dificultad para demostrar ejecuci\u00f3n y beneficio",
      ],
    },
    with: {
      label: "Con FEI",
      variant: "success" as const,
      items: [
        "Expediente estructurado bajo 15 elementos cr\u00edticos",
        "+50 documentos organizados por operaci\u00f3n",
        "Evidencia contractual, operativa, fiscal y contable integrada",
        "Teor\u00eda del caso y matriz de consistencia documental",
        "Preparaci\u00f3n preventiva ante revisiones",
        "Mayor trazabilidad para sustentar la materialidad",
      ],
    },
    banner: "La diferencia entre responder con documentos dispersos y presentar un expediente estructurado.",
  },

  implementacion: {
    sectionId: "implementacion",
    eyebrow: "La Implementaci\u00f3n",
    title: "Implementaci\u00f3n desde 3 semanas",
    subtitle: "Un proceso estructurado para pasar del diagn\u00f3stico inicial a un expediente documental funcional, sin interrumpir la operaci\u00f3n del negocio.",
    note: "El plazo puede variar seg\u00fan el volumen, complejidad y disponibilidad de la informaci\u00f3n.",
    timeline: [
      { week: "Semana 1", title: "Diagn\u00f3stico", description: "Evaluamos las operaciones relevantes, identificamos brechas documentales y definimos la arquitectura del expediente." },
      { week: "Semana 2", title: "Construcci\u00f3n", description: "Recopilamos, generamos y organizamos evidencia documental, validando consistencia entre contrato, ejecuci\u00f3n, CFDI, pagos y soporte contable." },
      { week: "Semana 3", title: "Entrega", description: "Entregamos el expediente estructurado, capacitamos al equipo responsable y dejamos documentada la l\u00f3gica de defensa preventiva." },
      { week: "Continuo", title: "Mantenimiento", description: "Actualizamos el expediente conforme evolucionan las operaciones, nuevos documentos o posibles requerimientos de autoridad." },
    ],
    banner: "Tres semanas para estructurar la evidencia que tardaste a\u00f1os en construir.",
  },

  cta: {
    sectionId: "cta-final",
    title: "Tu pr\u00f3xima revisi\u00f3n fiscal no tiene que ser una crisis",
    subtitle:
      "Agenda un diagn\u00f3stico sin compromiso. Evaluamos tu situaci\u00f3n documental y te mostramos qu\u00e9 elementos necesitan reforzarse.",
    cta: { label: "Agenda un diagn\u00f3stico", href: "/contacto" },
    ctaSecondary: { label: "Conoce nuestros servicios", href: "/servicios" },
  },

  serviciosGrid: {
    eyebrow: "Nuestros Servicios",
    title: "Materialidad fiscal documentada de extremo a extremo",
    subtitle:
      "Tres l\u00edneas de servicio dise\u00f1adas para cubrir cada \u00e1ngulo de tu exposici\u00f3n documental.",
    cta: { label: "Ver todos los servicios", href: "/servicios" },
    services: serviciosContent.services,
  },

  seguridad: {
    eyebrow: "Seguridad y Custodia",
    title: "El custodio de tu evidencia fiscal",
    subtitle:
      "No solo construimos tu expediente: lo resguardamos con trazabilidad documental, control de versiones, validaciones cruzadas y preparación preventiva ante revisiones fiscales.",
    pillars: [
      {
        icon: "FileSearch",
        title: "Trazabilidad y cadena de custodia",
        description:
          "Cada documento versionado, fechado y trazable. Sabes exactamente qué respalda cada operación y cómo se construyó, en todo momento.",
      },
      {
        icon: "ShieldCheck",
        title: "Preparación preventiva",
        description:
          "El expediente se organiza antes del requerimiento. Teoría del caso y matriz de consistencia construidas de antemano, no improvisadas.",
      },
      {
        icon: "Cpu",
        title: "Consistencia por diseño",
        description:
          "Nuestra tecnología genera, valida y organiza +50 documentos por operación con consistencia — reduciendo huecos y contradicciones.",
      },
    ],
    proof: [
      { value: "180", label: "Operaciones documentadas en un ejercicio" },
      { value: "15/15", label: "Elementos críticos de materialidad fiscal" },
      { value: "+50", label: "Documentos por operación" },
      { value: "9", label: "Carpetas estructuradas y trazables" },
    ],
    note: "Honestidad ante todo: trabajamos con lo que realmente hacemos — evidencia documental verificable, no promesas.",
  },

  confianza: {
    eyebrow: "Confianza",
    title: "Lo que dicen nuestros clientes",
    testimonials: [
      {
        quote:
          "FEI nos ayud\u00f3 a transformar evidencia dispersa en expedientes documentales estructurados por operaci\u00f3n. Hoy tenemos mayor claridad sobre qu\u00e9 respalda cada deducci\u00f3n.",
        author: "Director de Finanzas",
        company: "Empresa industrial",
      },
      {
        quote:
          "Pasamos de documentos aislados a una matriz clara de materialidad fiscal. El proceso nos permiti\u00f3 identificar brechas y fortalecer nuestro soporte documental.",
        author: "CFO",
        company: "Empresa nacional de distribuci\u00f3n",
      },
      {
        quote:
          "La metodología de FEI nos dio orden, trazabilidad y una lógica documental clara para preparar nuestras operaciones ante posibles revisiones.",
        author: "Socio Director",
        company: "Empresa de servicios",
      },
    ],
  },
} as const;

export type HomeContent = typeof homeContent;
