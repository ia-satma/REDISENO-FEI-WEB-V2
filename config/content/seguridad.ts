export const seguridadContent = {
  hero: {
    eyebrow: "Seguridad y Custodia",
    title: "El custodio de tu evidencia fiscal",
    subtitle:
      "No solo construimos tu expediente: lo resguardamos con trazabilidad, consistencia y preparación ante cualquier revisión del SAT. Aquí te explicamos exactamente cómo — con honestidad sobre lo que hacemos y lo que no.",
  },

  cadena: {
    eyebrow: "Cadena de custodia",
    title: "El recorrido controlado de tu evidencia",
    subtitle:
      "Cada documento de cada operación sigue un proceso trazable de cinco etapas, de la recepción al expediente blindado y listo para auditoría.",
    stages: [
      {
        n: "01",
        icon: "Inbox",
        label: "Recepción",
        title: "Recepción y captura",
        description:
          "Recibimos la documentación de la operación y de las partes, la digitalizamos y levantamos un inventario inicial. Nada entra al expediente sin quedar registrado.",
        points: [
          "Inventario documental de entrada",
          "Digitalización y resguardo del original",
          "Identificación de las partes (cliente y proveedor)",
        ],
      },
      {
        n: "02",
        icon: "Layers",
        label: "Versionado",
        title: "Versionado y fechado",
        description:
          "Cada documento se nombra con una convención única, se fecha y se versiona. En todo momento sabes qué versión respalda qué, y quién la generó.",
        points: [
          "Convención de nombres y carpetas",
          "Control de versiones y fechas",
          "Bitácora de cambios trazable",
        ],
      },
      {
        n: "03",
        icon: "CheckCircle2",
        label: "Validación",
        title: "Validación cruzada",
        description:
          "Validamos la consistencia entre documentos: fechas, montos, partes, CFDIs contra contratos, contratos contra entregables. Si algo no cuadra, se corrige antes de cerrar.",
        points: [
          "Cruce CFDI ↔ contrato ↔ entregable",
          "Consistencia de fechas, montos y partes",
          "Detección y cierre de huecos",
        ],
      },
      {
        n: "04",
        icon: "ShieldCheck",
        label: "Blindaje",
        title: "Blindaje documental",
        description:
          "Completamos la cobertura de los 15 elementos de materialidad que evalúa el SAT y cerramos el expediente en su estructura de 9 carpetas. La operación queda demostrable.",
        points: [
          "Cobertura de los 15 elementos del SAT",
          "Cierre en estructura de 9 carpetas",
          "+50 documentos por operación",
        ],
      },
      {
        n: "05",
        icon: "FileCheck2",
        label: "Audit-ready",
        title: "Listo para auditoría",
        description:
          "Construimos la teoría del caso y la matriz de consistencia antes de que llegue cualquier requerimiento. Si el SAT pregunta, el expediente ya está listo para responder.",
        points: [
          "Teoría del caso por operación",
          "Matriz de consistencia documental",
          "Soporte ante requerimientos",
        ],
      },
    ],
  },

  pillars: {
    eyebrow: "Cómo protegemos",
    title: "Tres principios de custodia",
    items: [
      {
        icon: "FileSearch",
        title: "Trazabilidad total",
        description:
          "Cada documento versionado, fechado y trazable. Sabes exactamente qué respalda cada operación y cómo se construyó, en todo momento.",
      },
      {
        icon: "ShieldCheck",
        title: "Audit-ready: defensa preventiva",
        description:
          "El expediente queda listo antes del requerimiento. Teoría del caso y matriz de consistencia construidas de antemano, no improvisadas bajo presión.",
      },
      {
        icon: "Cpu",
        title: "Consistencia por diseño",
        description:
          "Nuestra tecnología genera, valida y organiza más de 50 documentos por operación con consistencia perfecta — sin huecos ni contradicciones entre piezas.",
      },
    ],
  },

  carpetas: {
    eyebrow: "Estructura del expediente",
    title: "9 carpetas, todo en su lugar",
    subtitle:
      "Cada expediente de materialidad se organiza en una estructura fija de 9 carpetas. Así cualquier revisor —tu equipo o el SAT— encuentra cada pieza donde debe estar.",
    items: [
      { n: "01", icon: "Building2", name: "Identidad corporativa", desc: "Acreditación de existencia y capacidad de las partes." },
      { n: "02", icon: "FileStack", name: "Contratación", desc: "Contrato, NDA, orden de trabajo y alcance." },
      { n: "03", icon: "Scale", name: "Cumplimiento del proveedor", desc: "Situación fiscal y validación del proveedor." },
      { n: "04", icon: "ClipboardList", name: "Ejecución", desc: "Minutas, reportes de avance y correspondencia." },
      { n: "05", icon: "Package", name: "Entregables técnicos", desc: "Productos del servicio, 7+ por operación." },
      { n: "06", icon: "FileCheck2", name: "Cierre", desc: "Acta entrega-recepción y carta de satisfacción." },
      { n: "07", icon: "Receipt", name: "Fiscal-contable", desc: "Pólizas, CFDIs, conciliación y pagos bancarizados." },
      { n: "08", icon: "Gavel", name: "Defensa preventiva", desc: "Teoría del caso y matriz de consistencia." },
      { n: "09", icon: "FileSearch", name: "Bitácora y trazabilidad", desc: "Índice, control de versiones y registro de custodia." },
    ],
  },

  garantias: {
    eyebrow: "Nuestros compromisos",
    title: "Lo que sí garantizamos",
    items: [
      { icon: "Lock", title: "Confidencialidad", desc: "Acuerdo de confidencialidad (NDA) en cada operación. Tu información se maneja con reserva." },
      { icon: "FileSearch", title: "Trazabilidad verificable", desc: "Cada pieza del expediente es rastreable hasta su origen, fecha y versión." },
      { icon: "ShieldCheck", title: "Evidencia real, no relleno", desc: "Cada documento aporta sustancia a la operación. Nada de papeles de adorno." },
      { icon: "Cpu", title: "Soporte ante requerimientos", desc: "Si llega una auditoría, te acompañamos con el expediente listo y la estrategia documentada." },
    ],
  },

  transparencia: {
    title: "Honestidad ante todo",
    body:
      "No vendemos certificaciones que no tenemos ni prometemos blindajes mágicos. Protegemos tu operación con lo que realmente hacemos: evidencia documental verificable, trazable y consistente. Si una operación necesita algo que no podemos respaldar honestamente, te lo decimos.",
  },

  proof: [
    { value: "180", label: "Operaciones blindadas en un ejercicio" },
    { value: "15/15", label: "Elementos de materialidad del SAT" },
    { value: "+50", label: "Documentos por operación" },
    { value: "9", label: "Carpetas estructuradas y trazables" },
  ],

  cta: {
    title: "Pon a custodia tu próxima operación",
    subtitle: "Agenda una demo y te mostramos, con tu caso, cómo se construye y resguarda el expediente.",
  },
} as const;

export type SeguridadContent = typeof seguridadContent;
