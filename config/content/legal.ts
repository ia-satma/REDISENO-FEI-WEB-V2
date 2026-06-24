import { brand } from "../brand";

export const legalContent = {
  avisoPrivacidad: {
    slug: "/aviso-privacidad",
    label: "Aviso de Privacidad",
    title: "Aviso de Privacidad",
    lastUpdated: "2026-04-01",
    intro:
      "En FEI Consultores protegemos tus datos personales con el mismo rigor con el que blindamos tu evidencia fiscal. Este aviso describe cómo los tratamos.",
    sections: [
      {
        title: "Identidad del Responsable",
        content: `${brand.name}, con domicilio en ${brand.contact.location}, es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).`,
      },
      {
        title: "Datos Personales Recabados",
        content:
          "Recabamos los siguientes datos personales: nombre completo, correo electrónico, número telefónico, nombre de la empresa y puesto. Estos datos se obtienen directamente de usted a través de nuestro formulario de contacto.",
      },
      {
        title: "Finalidades del Tratamiento",
        content:
          "Sus datos personales serán utilizados para: (1) atender sus solicitudes de información, (2) enviar cotizaciones de servicios, (3) dar seguimiento a propuestas comerciales, (4) enviar información relevante sobre materialidad fiscal.",
      },
      {
        title: "Consentimiento",
        content:
          "Al marcar la casilla de consentimiento en nuestro formulario y enviar sus datos, usted otorga su consentimiento expreso para el tratamiento de sus datos personales conforme a las finalidades descritas en este Aviso de Privacidad.",
      },
      {
        title: "Transferencia de Datos",
        content:
          "Sus datos personales no serán transferidos a terceros sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la LFPDPPP. Los proveedores tecnológicos que nos asisten (correo, analítica, hospedaje) tratan los datos únicamente por nuestra instrucción.",
      },
      {
        title: "Derechos ARCO",
        content: `Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos derechos, envíe un correo a ${brand.contact.email} con el asunto "Derechos ARCO".`,
      },
      {
        title: "Cambios al Aviso de Privacidad",
        content:
          "Nos reservamos el derecho de modificar este aviso de privacidad. Cualquier cambio será publicado en esta página, indicando la fecha de última actualización.",
      },
    ],
  },

  terminos: {
    slug: "/terminos",
    label: "Términos y Condiciones",
    title: "Términos y Condiciones",
    lastUpdated: "2026-04-01",
    intro:
      "Estos términos rigen el uso de este sitio y la contratación de los servicios de FEI Consultores. Al utilizarlos, aceptas lo aquí descrito.",
    sections: [
      {
        title: "Aceptación de los Términos",
        content:
          "El acceso y uso de este sitio web, así como la contratación de cualquier servicio de FEI Consultores, implica la aceptación plena de estos Términos y Condiciones. Si no está de acuerdo, le pedimos abstenerse de utilizar el sitio o contratar los servicios.",
      },
      {
        title: "Naturaleza de los Servicios",
        content:
          "FEI Consultores construye, organiza y resguarda evidencia documental de materialidad fiscal. No prestamos servicios de contabilidad general, auditoría dictaminada ni representación legal. Nuestro trabajo es complementario al de su contador y/o abogado, no sustituto.",
      },
      {
        title: "Obligaciones del Cliente",
        content:
          "El cliente se obliga a proporcionar información veraz, completa y oportuna sobre sus operaciones. La calidad y defensabilidad del expediente depende de la veracidad de la información entregada. FEI no se hace responsable por información falsa, incompleta o alterada por el cliente.",
      },
      {
        title: "Confidencialidad",
        content:
          "Toda la información intercambiada se maneja de forma confidencial. En cada operación se firma un acuerdo de confidencialidad (NDA) que detalla el alcance del resguardo y la no divulgación.",
      },
      {
        title: "Propiedad Intelectual",
        content:
          "Las metodologías, plantillas, software y materiales desarrollados por FEI son propiedad de FEI Consultores. Los entregables documentales específicos de cada operación son propiedad del cliente una vez liquidados los honorarios correspondientes.",
      },
      {
        title: "Limitación de Responsabilidad",
        content:
          "FEI construye evidencia conforme a los criterios vigentes del SAT al momento de la prestación del servicio. No garantizamos un resultado específico ante una auditoría, pues la resolución depende de la autoridad fiscal. Nuestra responsabilidad se limita al valor de los honorarios pagados por el servicio correspondiente.",
      },
      {
        title: "Vigencia y Terminación",
        content:
          "La relación de servicios se rige por la propuesta y/o contrato firmado por las partes. Cualquiera de las partes puede darla por terminada conforme a lo pactado en dicho instrumento.",
      },
      {
        title: "Legislación Aplicable y Jurisdicción",
        content:
          "Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para la interpretación y cumplimiento, las partes se someten a los tribunales competentes de Monterrey, Nuevo León, renunciando a cualquier otro fuero.",
      },
    ],
  },

  seguridad: {
    slug: "/politica-seguridad",
    label: "Política de Seguridad de la Información",
    title: "Política de Seguridad de la Información",
    lastUpdated: "2026-04-01",
    intro:
      "La seguridad de la información es parte central de nuestro servicio. Esta política describe los principios con los que protegemos la evidencia que custodiamos.",
    sections: [
      {
        title: "Objetivo y Alcance",
        content:
          "Esta política establece los lineamientos para proteger la confidencialidad, integridad y disponibilidad de la información que FEI Consultores trata y custodia, tanto propia como de sus clientes. Aplica a todo el personal, colaboradores y proveedores que intervienen en la operación.",
      },
      {
        title: "Principios",
        content:
          "Nos regimos por tres principios: Confidencialidad (la información solo es accesible para quien debe), Integridad (la información es exacta, completa y trazable) y Disponibilidad (la información está disponible para quien la necesita cuando corresponde).",
      },
      {
        title: "Clasificación y Manejo de la Información",
        content:
          "La documentación se clasifica según su sensibilidad y se maneja con controles acordes. Cada documento se nombra, fecha y versiona bajo una convención que permite su trazabilidad de extremo a extremo.",
      },
      {
        title: "Control de Acceso",
        content:
          "El acceso a la información se otorga bajo el principio de mínimo privilegio: cada persona accede únicamente a lo necesario para su función. Los accesos quedan registrados.",
      },
      {
        title: "Trazabilidad y Cadena de Custodia",
        content:
          "Cada expediente sigue una cadena de custodia documentada: recepción, versionado, validación, integración y preparación para revisión. En todo momento es posible saber qué respalda cada operación y cómo se construyó.",
      },
      {
        title: "Resguardo y Continuidad",
        content:
          "La información se resguarda con respaldos periódicos para preservar su disponibilidad e integridad ante incidentes. Mantenemos medidas razonables de continuidad operativa.",
      },
      {
        title: "Gestión de Incidentes",
        content:
          "Contamos con un proceso para identificar, contener y atender incidentes de seguridad. En caso de un incidente que afecte datos personales, actuaremos conforme a la normativa aplicable y notificaremos a los titulares cuando corresponda.",
      },
      {
        title: "Cumplimiento y Mejora Continua",
        content:
          "Esta política se revisa periódicamente y se actualiza para mantenerla vigente frente a cambios normativos, tecnológicos y operativos. El incumplimiento de la misma está sujeto a las medidas que correspondan.",
      },
    ],
  },

  cookies: {
    slug: "/cookies",
    label: "Política de Cookies",
    title: "Política de Cookies",
    lastUpdated: "2026-04-01",
    intro:
      "Este sitio utiliza cookies para funcionar correctamente y para entender cómo se usa. Aquí te explicamos cuáles y para qué.",
    sections: [
      {
        title: "¿Qué son las cookies?",
        content:
          "Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo para recordar información sobre tu visita, como tus preferencias o cómo navegas el sitio.",
      },
      {
        title: "Cookies estrictamente necesarias",
        content:
          "Permiten el funcionamiento básico del sitio (navegación, seguridad y carga de contenido). Sin ellas el sitio no funcionaría correctamente. No requieren consentimiento.",
      },
      {
        title: "Cookies de rendimiento y analítica",
        content:
          "Nos ayudan a entender de forma agregada y anónima cómo se usa el sitio (páginas más visitadas, tiempo de permanencia) para mejorarlo. Solo se activan con tu consentimiento cuando aplica.",
      },
      {
        title: "Cookies de terceros",
        content:
          "Algunos componentes embebidos —como el reproductor de video (Vimeo)— pueden instalar sus propias cookies al reproducir contenido. Estas se rigen además por las políticas de dichos terceros.",
      },
      {
        title: "Cómo gestionar las cookies",
        content:
          "Puedes aceptar, rechazar o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar algunas cookies puede afectar el funcionamiento del sitio.",
      },
      {
        title: "Cambios a esta política",
        content:
          "Podemos actualizar esta política de cookies. Publicaremos cualquier cambio en esta página indicando la fecha de última actualización.",
      },
      {
        title: "Contacto",
        content: `Si tienes dudas sobre el uso de cookies, escríbenos a ${brand.contact.email}.`,
      },
    ],
  },
} as const;

export type LegalContent = typeof legalContent;
export type LegalDoc = (typeof legalContent)[keyof typeof legalContent];
