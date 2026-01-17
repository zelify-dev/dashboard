export const cardsTranslations = {
  es: {
    diligence: {
      pageTitle: "Diligencia de tarjetas",
      title: "Due Diligence",
      desc: "Administra y revisa los procesos de diligencia del titular de la tarjeta",
      newButton: "Nueva diligencia",
      submitted: "Enviado",
      reviewed: "Revisado",
      reviewer: "Revisor",
      documents: "Documentos",
      filesSuffix: "archivos",
      status: {
        approved: "Aprobada",
        in_review: "En revisión",
        rejected: "Rechazada",
        pending: "Pendiente",
      },
      risk: {
        low: "Bajo",
        medium: "Medio",
        high: "Alto",
        suffix: "Riesgo"
      },
      detailsTitle: "Detalles de la diligencia",
      cardholderInformation: "Información del titular",
      timeline: "Cronología",
      submittedDate: "Fecha de envío",
      reviewedDate: "Fecha de revisión",
      reviewedBy: "Revisado por",
      documentsSubmitted: (n: number) => `${n} documento${n !== 1 ? "s" : ""} enviados`,
      close: "Cerrar",
      listTitle: "Lista de Diligencias",
      listDesc: "Haz clic en cualquier diligencia para ver los detalles completos",
      newForm: {
        title: "Nueva diligencia",
        cardholderName: "Nombre del titular",
        cardNumber: "Número de tarjeta",
        riskLevel: "Nivel de riesgo",
        numberOfDocuments: "Número de documentos",
        cancel: "Cancelar",
        create: "Crear diligencia",
        placeholders: {
          cardholderName: "Ingrese el nombre del titular",
          cardNumber: "**** 1234"
        }
      }
    },
    issuing: {
      pageTitle: "Emisión / Diseño",
      designsTitle: "Diseños de tarjetas",
      addNewDesign: "Agregar nuevo diseño",
      editor: {
        back: "Volver",
        namePlaceholder: "Nombre del diseño",
        cancel: "Cancelar",
        save: "Guardar diseño",
        cardholderNameLabel: "Nombre del Portador",
        cardNetworkLabel: "Red de Tarjeta",
        colorTypeLabel: "Tipo de Color",
        solidLabel: "Color Fijo",
        gradientLabel: "Degradado",
        gradientColorsLabel: "Colores del Degradado (hasta 3)",
        finishLabel: "Acabado de la Tarjeta",
        finishStandard: "Estándar",
        finishEmbossed: "Con Relieve (Letras en relieve)",
        finishMetallic: "Metálica (Acabado metálico)",
        cancelButton: "Cancelar",
        saveButton: "Guardar Diseño"
      }
    },
    transactions: {
      pageTitle: "Transacciones de tarjetas",
      title: "Card Transactions",
      desc: "Ver y administrar todas las transacciones de tarjeta emitidas en su plataforma",
      table: {
        card: "Tarjeta",
        merchant: "Comerciante",
        category: "Categoría",
        amount: "Monto",
        date: "Fecha",
        status: "Estado",
        type: "Tipo",
        noData: "No se encontraron transacciones"
      },
      detail: {
        title: "Detalles de la transacción",
        amount: "Monto",
        transactionId: "ID de la transacción",
        type: "Tipo",
        dateTime: "Fecha y hora",
        category: "Categoría",
        cardInfo: "Información de la tarjeta",
        cardNumber: "Número de tarjeta",
        cardholder: "Titular de la tarjeta",
        merchant: "Comerciante",
        close: "Cerrar"
      },
      status: {
        completed: "Completada",
        pending: "Pendiente",
        declined: "Declinada",
        refunded: "Reembolsada"
      },
      types: {
        purchase: "Compra",
        withdrawal: "Retiro",
        refund: "Reembolso"
      }
    }
  },
  en: {
    diligence: {
      pageTitle: "Diligence",
      title: "Due Diligence",
      desc: "Manage and review cardholder due diligence processes",
      newButton: "New Diligence",
      submitted: "Submitted",
      reviewed: "Reviewed",
      reviewer: "Reviewer",
      documents: "Documents",
      filesSuffix: "files",
      status: {
        approved: "Approved",
        in_review: "In review",
        rejected: "Rejected",
        pending: "Pending",
      },
      risk: {
        low: "Low",
        medium: "Medium",
        high: "High",
        suffix: "Risk"
      },
      detailsTitle: "Diligence Details",
      cardholderInformation: "Cardholder Information",
      timeline: "Timeline",
      submittedDate: "Submitted",
      reviewedDate: "Reviewed",
      reviewedBy: "Reviewed By",
      documentsSubmitted: (n: number) => `${n} document${n !== 1 ? "s" : ""} submitted`,
      close: "Close",
      listTitle: "Diligence List",
      listDesc: "Click on any diligence to view complete details",
      newForm: {
        title: "New Diligence",
        cardholderName: "Cardholder Name",
        cardNumber: "Card Number",
        riskLevel: "Risk Level",
        numberOfDocuments: "Number of Documents",
        cancel: "Cancel",
        create: "Create Diligence",
        placeholders: {
          cardholderName: "Enter cardholder name",
          cardNumber: "**** 1234"
        }
      }
    },
    issuing: {
      pageTitle: "Issuing / Design",
      designsTitle: "Cards designs",
      addNewDesign: "Add new design",
      editor: {
        back: "Back",
        namePlaceholder: "Design name",
        cancel: "Cancel",
        save: "Save design",
        cardholderNameLabel: "Cardholder Name",
        cardNetworkLabel: "Card Network",
        colorTypeLabel: "Color Type",
        solidLabel: "Solid Color",
        gradientLabel: "Gradient",
        gradientColorsLabel: "Gradient Colors (up to 3)",
        finishLabel: "Card Finish",
        finishStandard: "Standard",
        finishEmbossed: "Embossed",
        finishMetallic: "Metallic",
        cancelButton: "Cancel",
        saveButton: "Save Design"
      }
    },
    transactions: {
      pageTitle: "Card Transactions",
      title: "Card Transactions",
      desc: "View and manage all card transactions issued through your platform",
      table: {
        card: "Card",
        merchant: "Merchant",
        category: "Category",
        amount: "Amount",
        date: "Date",
        status: "Status",
        type: "Type",
        noData: "No transactions found"
      },
      detail: {
        title: "Transaction Details",
        amount: "Amount",
        transactionId: "Transaction ID",
        type: "Type",
        dateTime: "Date & Time",
        category: "Category",
        cardInfo: "Card Information",
        cardNumber: "Card Number",
        cardholder: "Cardholder",
        merchant: "Merchant",
        close: "Close"
      },
      status: {
        completed: "Completed",
        pending: "Pending",
        declined: "Declined",
        refunded: "Refunded"
      },
      types: {
        purchase: "Purchase",
        withdrawal: "Withdrawal",
        refund: "Refund"
      }
    }
  }
};
