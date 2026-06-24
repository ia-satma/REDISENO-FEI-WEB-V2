/** Los 15 elementos de materialidad del SAT, agrupados en 5 frentes.
 *  Iconos por nombre (resueltos con lib/icons.getIcon) para que sean editables. */
export const materialidadContent = {
  categorias: [
    {
      n: "01",
      title: "Capacidad y existencia del proveedor",
      question: "¿Existe, está localizable y puede hacerlo?",
      icon: "Building2",
      tint: "bg-mint-soft",
      items: [
        { t: "Existencia del proveedor", d: "Alta vigente en el RFC, domicilio localizable y operaciones reales — que no sea un EFOS del 69-B.", icon: "Building2" },
        { t: "Capacidad técnica", d: "Experiencia, certificaciones o know-how para prestar justo ese servicio.", icon: "Cpu" },
        { t: "Capacidad material", d: "Activos, equipo e instalaciones suficientes para ejecutar la operación.", icon: "Boxes" },
        { t: "Personal calificado", d: "Plantilla dada de alta en el IMSS, congruente con el servicio facturado.", icon: "Users" },
      ],
    },
    {
      n: "02",
      title: "Soporte contractual de la operación",
      question: "¿Qué se pactó y bajo qué condiciones?",
      icon: "FileStack",
      tint: "bg-sky",
      items: [
        { t: "Contrato formal", d: "Contrato firmado con objeto, alcance, contraprestación y vigencia claros.", icon: "FileStack" },
        { t: "Orden de trabajo", d: "El pedido o instrucción que activa y delimita cada entrega.", icon: "ClipboardList" },
        { t: "Correspondencia", d: "Correos, minutas y mensajes que prueban una relación de negocio viva.", icon: "Mail" },
      ],
    },
    {
      n: "03",
      title: "Evidencia de ejecución y entrega",
      question: "¿Realmente ocurrió y se entregó?",
      icon: "FileSearch",
      tint: "bg-lavender",
      items: [
        { t: "Evidencia de ejecución", d: "Reportes, bitácoras, fotos o accesos que demuestran el trabajo hecho.", icon: "FileSearch" },
        { t: "Entregables", d: "Los productos o resultados concretos que efectivamente se recibieron.", icon: "Package" },
        { t: "Acta de entrega", d: "Documento de aceptación que formaliza y cierra la entrega.", icon: "FileCheck2" },
      ],
    },
    {
      n: "04",
      title: "Soporte financiero, fiscal y contable",
      question: "¿Hay rastro del dinero?",
      icon: "Banknote",
      tint: "bg-mint-soft",
      items: [
        { t: "Pagos bancarizados", d: "Transferencias trazables que cuadran con el CFDI, el contrato y las fechas.", icon: "Banknote" },
        { t: "CFDIs", d: "Comprobantes timbrados, vigentes y con uso y método de pago correctos.", icon: "Receipt" },
        { t: "Pólizas contables", d: "Registro contable que refleja fielmente la operación.", icon: "BookOpen" },
      ],
    },
    {
      n: "05",
      title: "Razonabilidad económica y beneficio empresarial",
      question: "¿Tiene sentido económico y beneficio para el negocio?",
      icon: "TrendingUp",
      tint: "bg-sky",
      items: [
        { t: "Razonabilidad del gasto", d: "Precio de mercado y proporción lógica frente al beneficio obtenido.", icon: "Calculator" },
        { t: "Beneficio empresarial demostrable", d: "Impacto real y medible en la operación o los resultados del negocio.", icon: "TrendingUp" },
      ],
    },
  ],
};
