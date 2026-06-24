export const seguridadContent = {
  hero: {
    eyebrow: "Seguridad y Custodia",
    title: "El custodio de tu evidencia fiscal",
    subtitle:
      "Construimos y organizamos tu expediente de materialidad con trazabilidad documental, control de versiones, validaciones cruzadas y preparación preventiva ante revisiones fiscales. Aquí explicamos cómo se recibe, clasifica, valida y resguarda la evidencia de cada operación, así como los límites de nuestro alcance.",
  },

  cadena: {
    eyebrow: "Cadena de custodia",
    title: "Cadena de custodia documental del expediente",
    subtitle:
      "Cada documento sigue un proceso trazable desde su recepción hasta la integración final del expediente. El objetivo es que la operación pueda explicarse con evidencia ordenada, consistente y verificable.",
    stages: [
      {
        n: "01",
        icon: "Inbox",
        label: "Recepción",
        title: "Recepción y captura",
        description:
          "Recibimos la documentación de la operación y de las partes involucradas. Cada archivo se registra en un inventario inicial para identificar qué evidencia existe, qué falta y qué debe integrarse al expediente.",
        points: [
          "Inventario documental de entrada",
          "Identificación de cliente, proveedor y operación",
          "Digitalización y registro de la evidencia recibida",
          "Clasificación inicial por tipo de documento",
        ],
      },
      {
        n: "02",
        icon: "Layers",
        label: "Versionado",
        title: "Versionado y fechado",
        description:
          "Cada documento se clasifica, fecha y versiona bajo una convención documental definida. Esto permite identificar qué versión respalda cada operación y mantener trazabilidad sobre cambios, sustituciones o actualizaciones.",
        points: [
          "Convención de nombres y carpetas",
          "Control de versiones y fechas",
          "Bitácora documental trazable",
          "Registro de actualizaciones",
        ],
      },
      {
        n: "03",
        icon: "CheckCircle2",
        label: "Validación",
        title: "Validación cruzada",
        description:
          "Validamos la consistencia entre contrato, CFDI, pagos, entregables, fechas, montos y partes involucradas. Cuando se detectan brechas o inconsistencias, se documentan y se solicita la evidencia complementaria necesaria.",
        points: [
          "Cruce CFDI ↔ contrato ↔ entregable",
          "Consistencia de fechas, montos y partes",
          "Identificación de brechas documentales",
          "Solicitud de aclaraciones y soporte adicional",
        ],
      },
      {
        n: "04",
        icon: "FolderCheck",
        label: "Integración",
        title: "Integración documental",
        description:
          "Integramos el expediente bajo una estructura documental alineada a los elementos críticos de materialidad fiscal. Cada operación queda organizada en carpetas, soportes y matrices que facilitan su revisión.",
        points: [
          "Cobertura de elementos críticos de materialidad",
          "Estructura documental por operación",
          "Organización de carpetas y anexos",
          "Matriz de consistencia documental",
        ],
      },
      {
        n: "05",
        icon: "FileCheck2",
        label: "Preparación para revisión",
        title: "Preparación para revisión",
        description:
          "Construimos la teoría del caso documental y preparamos el expediente para responder de forma ordenada ante una eventual revisión o requerimiento de autoridad.",
        points: [
          "Teoría del caso por operación",
          "Matriz de consistencia documental",
          "Expediente preparado para revisión",
          "Soporte documental ante requerimientos",
        ],
      },
    ],
  },

  pillars: {
    eyebrow: "Cómo trabajamos",
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
        title: "Preparación preventiva",
        description:
          "El expediente se organiza antes del requerimiento. Teoría del caso y matriz de consistencia construidas de antemano, no improvisadas bajo presión.",
      },
      {
        icon: "Cpu",
        title: "Consistencia por diseño",
        description:
          "Nuestra tecnología genera, valida y organiza más de 50 documentos por operación con consistencia — reduciendo huecos y contradicciones entre piezas.",
      },
    ],
  },

  carpetas: {
    eyebrow: "Estructura del expediente",
    title: "9 carpetas, todo en su lugar",
    subtitle:
      "Cada expediente de materialidad se organiza en una estructura fija de 9 carpetas. Así cualquier revisor —tu equipo o la autoridad— encuentra cada pieza donde debe estar.",
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
    title: "En lo que sí nos comprometemos",
    items: [
      { icon: "Lock", title: "Confidencialidad", desc: "Acuerdo de confidencialidad (NDA) en cada operación. Tu información se maneja con reserva." },
      { icon: "FileSearch", title: "Trazabilidad verificable", desc: "Cada pieza del expediente es rastreable hasta su origen, fecha y versión." },
      { icon: "ShieldCheck", title: "Evidencia real, no relleno", desc: "Cada documento aporta sustancia a la operación. Nada de papeles de adorno." },
      { icon: "Cpu", title: "Soporte ante requerimientos", desc: "Si llega una revisión, te acompañamos con el expediente organizado y la estrategia documentada." },
    ],
  },

  infoSeguridad: {
    eyebrow: "Seguridad de la información",
    title: "Seguridad de la información",
    intro:
      "La evidencia fiscal contiene información sensible: contratos, CFDIs, pagos, proveedores, entregables, datos corporativos y documentación interna. Por eso FEI opera con controles de acceso, trazabilidad documental y manejo confidencial de la información.",
    items: [
      { icon: "Lock", title: "Control de accesos", desc: "Acceso limitado por usuario, rol y necesidad operativa." },
      { icon: "ShieldCheck", title: "Confidencialidad", desc: "Manejo de información bajo acuerdos de confidencialidad y políticas internas." },
      { icon: "FileSearch", title: "Bitácora documental", desc: "Registro de recepción, cambios, versiones y documentos integrados." },
      { icon: "FolderCheck", title: "Respaldo y conservación", desc: "Estructura documental preparada para consulta, revisión y mantenimiento." },
      { icon: "Layers", title: "Segregación de información", desc: "Cada cliente y operación se administra en expedientes independientes." },
      { icon: "Cpu", title: "Uso responsable de tecnología", desc: "La tecnología apoya la clasificación, validación y organización documental sin sustituir el juicio profesional." },
    ],
  },

  alcance: {
    eyebrow: "Alcance del servicio",
    title: "Alcance claro del servicio",
    intro:
      "FEI opera con una premisa simple: evidencia documental verificable, no promesas absolutas. Nuestro trabajo consiste en estructurar, validar y preparar expedientes de materialidad fiscal con trazabilidad y consistencia.",
    hacemosLabel: "Lo que hacemos",
    hacemos: [
      "Construimos expedientes de materialidad fiscal.",
      "Organizamos evidencia contractual, operativa, fiscal y contable.",
      "Validamos consistencia documental entre soportes.",
      "Identificamos brechas y evidencia faltante.",
      "Preparamos matrices y teoría documental del caso.",
      "Acompañamos la preparación preventiva ante revisiones fiscales.",
    ],
    noHacemosLabel: "Lo que no hacemos",
    noHacemos: [
      "No garantizamos el criterio de la autoridad fiscal.",
      "No sustituimos la asesoría legal o fiscal especializada del cliente.",
      "No alteramos documentos ni reconstruimos evidencia inexistente.",
      "No prometemos la aceptación automática de deducciones.",
      "No reemplazamos la responsabilidad documental de la empresa.",
      "No aseguramos el resultado de una auditoría o revisión.",
    ],
  },

  transparencia: {
    title: "Honestidad ante todo",
    body:
      "No vendemos certificaciones que no tenemos ni prometemos resultados absolutos. Trabajamos tu operación con lo que realmente hacemos: evidencia documental verificable, trazable y consistente. Si una operación necesita algo que no podemos respaldar honestamente, te lo decimos.",
  },

  proof: [
    { value: "180", label: "Operaciones documentadas en un ejercicio" },
    { value: "15/15", label: "Elementos críticos de materialidad fiscal" },
    { value: "+50", label: "Documentos por operación" },
    { value: "9", label: "Carpetas estructuradas y trazables" },
  ],

  cta: {
    title: "Estructura la evidencia de tu próxima operación",
    subtitle: "Agenda un diagnóstico y te mostramos, con tu caso, cómo se construye y resguarda el expediente.",
  },
} as const;

export type SeguridadContent = typeof seguridadContent;
