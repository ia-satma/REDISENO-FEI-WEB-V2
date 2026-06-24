import { serviciosContent } from "./servicios";

export const homeContent = {
  hero: {
    badge: "Protecci\u00f3n Fiscal Inteligente",
    title: "Infraestructura de Evidencia Fiscal",
    titleParts: {
      prefix: "Infraestructura de",
      rotating: ["Evidencia", "Materialidad", "Defensa", "Blindaje"],
      suffix: "Fiscal",
    },
    subtitle:
      "Construimos el expediente documental que protege tus operaciones. Cada deducci\u00f3n respaldada, cada operaci\u00f3n demostrable, cada auditor\u00eda superada.",
    stats: [
      { value: "15/15", label: "Elementos de materialidad cubiertos" },
      { value: "4", label: "Fases sistem\u00e1ticas de implementaci\u00f3n" },
      { value: "+50", label: "Documentos por operaci\u00f3n" },
    ],
    cta: { label: "Agenda tu Demo", href: "/contacto" },
    ctaSecondary: { label: "Conoce la Metodolog\u00eda", href: "/metodologia" },
  },

  contexto: {
    sectionId: "contexto",
    eyebrow: "El Contexto",
    title: "La brecha entre operar y poder probarlo",
    description:
      "Tu empresa opera correctamente. Facturas, pagas impuestos, cumples contratos. Pero cuando el SAT pregunta \u00ab\u00bfc\u00f3mo demuestras que esta operaci\u00f3n realmente ocurri\u00f3?\u00bb, la mayor\u00eda de las empresas no tiene respuesta.",
    cards: [
      {
        icon: "FileWarning",
        title: "\u00bfTienes contrato firmado?",
        description:
          "No basta con facturar. El SAT exige evidencia documental completa de que el servicio fue real, necesario y efectivamente prestado.",
      },
      {
        icon: "Scale",
        title: "\u00bfPuedes demostrar la ejecuci\u00f3n?",
        description:
          "Minutas de trabajo, reportes de avance, entregables t\u00e9cnicos, correspondencia. Sin esto, tu deducci\u00f3n es vulnerable.",
      },
      {
        icon: "ShieldAlert",
        title: "\u00bfTu expediente resiste una auditor\u00eda?",
        description:
          "El promedio de las empresas mexicanas cumple solo 6 de 15 elementos de materialidad. Eso es un expediente indefendible.",
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
    title: "FEI: Infraestructura de Evidencia Fiscal",
    subtitle:
      "No somos un despacho contable. Somos la infraestructura que construye, organiza y blinda tu evidencia documental.",
    columns: [
      {
        icon: "BrainCircuit",
        title: "Especialistas en Materialidad",
        description:
          "Equipo dedicado exclusivamente a construir expedientes de materialidad fiscal. No contabilidad general \u2014 evidencia documental pura.",
      },
      {
        icon: "Cpu",
        title: "Automatizaci\u00f3n Inteligente",
        description:
          "Tecnolog\u00eda propietaria que genera, valida y organiza m\u00e1s de 50 documentos por operaci\u00f3n con consistencia perfecta.",
      },
      {
        icon: "FolderCheck",
        title: "Expedientes Blindados",
        description:
          "Cada expediente cubre los 15 elementos de materialidad que el SAT eval\u00faa. Estructura de 9 carpetas lista para auditor\u00eda.",
      },
    ],
    banner: "Construimos la evidencia que tus operaciones necesitan para ser indefendibles.",
  },

  metodologia: {
    sectionId: "metodologia",
    eyebrow: "La Metodolog\u00eda",
    title: "4 fases sistem\u00e1ticas",
    subtitle:
      "Cada expediente es un traje a la medida. No aplicamos recetas \u2014 entendemos tu operaci\u00f3n y construimos la evidencia que la respalda.",
    phases: [
      {
        number: "01",
        title: "Contrataci\u00f3n",
        description:
          "Diagn\u00f3stico fiscal, contrato de servicios, NDA, orden de trabajo. Base legal s\u00f3lida para toda la operaci\u00f3n.",
        items: ["Diagn\u00f3stico de materialidad", "Contrato mercantil", "Acuerdo de confidencialidad", "Alcance de trabajo"],
      },
      {
        number: "02",
        title: "Ejecuci\u00f3n",
        description:
          "Minutas de trabajo, reportes de avance, correspondencia profesional. Evidencia viva de que el servicio se prest\u00f3.",
        items: ["Minutas mensuales", "Reportes de avance", "Correspondencia formal", "Control de calidad"],
      },
      {
        number: "03",
        title: "Entrega",
        description:
          "Entregables t\u00e9cnicos completos, acta de entrega-recepci\u00f3n, carta de satisfacci\u00f3n. Cierre documental impecable.",
        items: ["Entregables t\u00e9cnicos (7+)", "Acta entrega-recepci\u00f3n", "Carta de satisfacci\u00f3n", "Gu\u00eda operativa"],
      },
      {
        number: "04",
        title: "Cierre",
        description:
          "P\u00f3lizas contables, conciliaci\u00f3n fiscal, teor\u00eda del caso. Tu expediente queda blindado y listo para cualquier revisi\u00f3n.",
        items: ["P\u00f3lizas contables", "Conciliaci\u00f3n fiscal", "Teor\u00eda del caso", "Matriz de consistencia"],
      },
    ],
    banner: "Cada fase genera evidencia real \u2014 no documentos de relleno.",
  },

  impacto: {
    sectionId: "impacto",
    eyebrow: "El Impacto",
    title: "Resultados que hablan",
    metrics: [
      { value: "$1,200", suffix: "MDP", label: "En operaciones protegidas" },
      { value: "$80", suffix: "MDP", label: "En deducciones blindadas" },
      { value: "35", suffix: "x", label: "ROI promedio sobre inversi\u00f3n" },
    ],
    banner: "Cada peso invertido en materialidad protege 35 pesos en deducciones.",
  },

  comparativa: {
    sectionId: "comparativa",
    eyebrow: "La Comparativa",
    title: "Sin FEI vs. Con FEI",
    without: {
      label: "Sin FEI",
      variant: "danger" as const,
      items: [
        "6/15 elementos de materialidad",
        "Expediente incompleto y vulnerable",
        "Deducciones en riesgo de rechazo",
        "Sin defensa ante auditor\u00eda",
        "Responsabilidad solidaria directivos",
        "Reacci\u00f3n tard\u00eda ante requerimientos",
      ],
    },
    with: {
      label: "Con FEI",
      variant: "success" as const,
      items: [
        "15/15 elementos de materialidad",
        "Expediente blindado con +50 documentos",
        "Deducciones respaldadas al 100%",
        "Defensa preventiva documentada",
        "Protecci\u00f3n directiva completa",
        "Preparaci\u00f3n proactiva permanente",
      ],
    },
    banner: "La diferencia entre sobrevivir una auditor\u00eda y perderla.",
  },

  implementacion: {
    sectionId: "implementacion",
    eyebrow: "La Implementaci\u00f3n",
    title: "Activo en 3 semanas",
    subtitle: "Del diagn\u00f3stico al expediente completo en un tiempo que no interrumpe tu operaci\u00f3n.",
    timeline: [
      { week: "Semana 1", title: "Diagn\u00f3stico", description: "Evaluaci\u00f3n fiscal, an\u00e1lisis de operaciones, dise\u00f1o del expediente." },
      { week: "Semana 2", title: "Construcci\u00f3n", description: "Generaci\u00f3n documental, validaci\u00f3n cruzada, control de calidad." },
      { week: "Semana 3", title: "Entrega", description: "Expediente completo, capacitaci\u00f3n del equipo, transferencia de conocimiento." },
      { week: "Continuo", title: "Mantenimiento", description: "Actualizaci\u00f3n peri\u00f3dica, soporte ante requerimientos, mejora continua." },
    ],
    banner: "3 semanas para blindar lo que tardaste a\u00f1os en construir.",
  },

  cta: {
    sectionId: "cta-final",
    title: "Tu pr\u00f3xima auditor\u00eda no tiene que ser una crisis",
    subtitle:
      "Agenda una demo sin compromiso. Evaluamos tu situaci\u00f3n fiscal y te mostramos exactamente qu\u00e9 necesitas.",
    cta: { label: "Agenda tu Demo Gratuita", href: "/contacto" },
    ctaSecondary: { label: "Conoce Nuestros Servicios", href: "/servicios" },
  },

  serviciosGrid: {
    eyebrow: "Nuestros Servicios",
    title: "Protecci\u00f3n fiscal integral",
    subtitle:
      "Tres l\u00edneas de servicio dise\u00f1adas para cubrir cada \u00e1ngulo de tu exposici\u00f3n fiscal.",
    cta: { label: "Ver todos los servicios", href: "/servicios" },
    services: serviciosContent.services,
  },

  seguridad: {
    eyebrow: "Seguridad y Custodia",
    title: "El custodio de tu evidencia fiscal",
    subtitle:
      "No solo construimos tu expediente: lo resguardamos con trazabilidad, consistencia y preparación ante cualquier revisión del SAT.",
    pillars: [
      {
        icon: "FileSearch",
        title: "Trazabilidad y cadena de custodia",
        description:
          "Cada documento versionado, fechado y trazable. Sabes exactamente qué respalda cada operación y cómo se construyó, en todo momento.",
      },
      {
        icon: "ShieldCheck",
        title: "Audit-ready: defensa preventiva",
        description:
          "El expediente queda listo antes del requerimiento. Teoría del caso y matriz de consistencia construidas de antemano, no improvisadas.",
      },
      {
        icon: "Cpu",
        title: "Consistencia por diseño",
        description:
          "Nuestra tecnología genera, valida y organiza +50 documentos por operación con consistencia perfecta — sin huecos ni contradicciones.",
      },
    ],
    proof: [
      { value: "180", label: "Operaciones blindadas en un ejercicio" },
      { value: "15/15", label: "Elementos de materialidad del SAT" },
      { value: "+50", label: "Documentos por operación" },
      { value: "9", label: "Carpetas estructuradas y trazables" },
    ],
    note: "Honestidad ante todo: protegemos con lo que realmente hacemos — evidencia documental verificable, no promesas.",
  },

  confianza: {
    eyebrow: "Confianza",
    title: "Lo que dicen nuestros clientes",
    testimonials: [
      {
        quote:
          "Con FEI logramos blindar m\u00e1s de 180 operaciones en un solo ejercicio fiscal. Su metodolog\u00eda es infalible.",
        author: "Director de Finanzas",
        company: "Grupo Industrial del Norte",
      },
      {
        quote:
          "Pasamos de tener 6 elementos de materialidad a 15/15. El SAT revis\u00f3 y no encontr\u00f3 nada que objetar.",
        author: "CFO",
        company: "Distribuidora Nacional, S.A.",
      },
      {
        quote:
          "Invertimos en FEI y el retorno fue inmediato. Deducciones blindadas al 100\u0025 en menos de 4 semanas.",
        author: "Socio Director",
        company: "Constructora Regio",
      },
    ],
  },
} as const;

export type HomeContent = typeof homeContent;
