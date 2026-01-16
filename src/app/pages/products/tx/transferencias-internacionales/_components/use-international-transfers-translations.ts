"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";

type InternationalTransfersTranslations = {
  breadcrumb: string;
  preview: {
    title: string;
    amount: {
      tag: string;
      title: string;
      subtitle: string;
      amountLabel: string;
      recipientAria: string;
      historyTag: string;
      historyTitle: string;
      viewAll: string;
      empty: string;
    };
    recipients: {
      back: string;
      tag: string;
      title: string;
      selectAction: string;
      empty: string;
    };
    summary: {
      back: string;
      tag: string;
      title: string;
      subtitle: string;
      recipientLabel: string;
      amountLabel: string;
      noteLabel: string;
      youSend: string;
      exchangeRate: string;
      receivedIn: string;
      confirmLabel: string;
      releaseToConfirm: string;
      slideToConfirm: string;
    };
    processing: {
      tag: string;
      title: string;
      subtitle: string;
    };
    historyDetail: {
      back: string;
      tag: string;
      titlePrefix: string;
      amountSent: string;
      receives: string;
      exchangeRateLabel: string;
      recipientLabel: string;
      reference: string;
      purpose: string;
      fee: string;
      share: string;
    };
    success: {
      title: string;
      subtitle: string;
      cta: string;
      transactionDetails: string;
      dateHour: string;
      recipient: string;
      transactionNumber: string;
      paymentMethod: string;
      amount: string;
      fee: string;
      total: string;
      share: string;
      download: string;
    };
    statuses: {
      completed: string;
      pending: string;
      failed: string;
    };
    defaultNote: string;
  };
  config: {
    title: string;
    description: string;
    currencyLabel: string;
  };
};

const INTERNATIONAL_TRANSFERS_TRANSLATIONS: Record<Language, InternationalTransfersTranslations> = {
  en: {
    breadcrumb: "Tx / International transfers",
    preview: {
      title: "Mobile Preview",
      amount: {
        tag: "Transfers",
        title: "How much do you want to transfer?",
        subtitle: "Select the currency according to the country.",
        amountLabel: "Amount",
        recipientAria: "Select recipient",
        historyTag: "History",
        historyTitle: "Recent transfers",
        viewAll: "View all",
        empty: "No recent transfers for this country.",
      },
      recipients: {
        back: "← Back",
        tag: "Contacts",
        title: "Select the recipient",
        selectAction: "Select",
        empty: "No saved international recipients available from this country yet.",
      },
      summary: {
        back: "← Change recipient",
        tag: "Summary",
        title: "Confirm the transfer",
        subtitle: "Review the details before sending.",
        recipientLabel: "Recipient",
        amountLabel: "Amount",
        noteLabel: "Note",
        youSend: "You send",
        exchangeRate: "Exchange rate",
        receivedIn: "Received in",
        confirmLabel: "Confirm",
        releaseToConfirm: "Release to confirm",
        slideToConfirm: "Slide to confirm",
      },
      processing: {
        tag: "Processing",
        title: "Processing your transaction",
        subtitle: "This may take a few seconds",
      },
      historyDetail: {
        back: "← Back to history",
        tag: "Details",
        titlePrefix: "Transfer to",
        amountSent: "Amount sent",
        receives: "Receives",
        exchangeRateLabel: "Exchange rate:",
        recipientLabel: "Recipient",
        reference: "Referencia",
        purpose: "Purpose",
        fee: "Fee",
        share: "Share",
      },
      success: {
        title: "Transfer sent",
        subtitle: "Zelify notified the recipient",
        cta: "Make another transfer",
        transactionDetails: "Transaction Details",
        dateHour: "Date/Hour",
        recipient: "Recipient",
        transactionNumber: "Transaction number",
        paymentMethod: "Payment method",
        amount: "Amount",
        fee: "Fee",
        total: "Total",
        share: "Share",
        download: "Download",
      },
      statuses: {
        completed: "Completed",
        pending: "Pending",
        failed: "Failed",
      },
      defaultNote: "Weekly payment",
    },
    config: {
      title: "Configuration",
      description: "Select the country to adjust currency.",
      currencyLabel: "Currency:",
    },
  },
  es: {
    breadcrumb: "Tx / Transferencias internacionales",
    preview: {
      title: "Vista previa móvil",
      amount: {
        tag: "Transferencias",
        title: "¿Cuánto deseas transferir?",
        subtitle: "Selecciona la divisa según el país.",
        amountLabel: "Monto",
        recipientAria: "Seleccionar destinatario",
        historyTag: "Historial",
        historyTitle: "Transferencias recientes",
        viewAll: "Ver todo",
        empty: "No hay transferencias recientes para este país.",
      },
      recipients: {
        back: "← Regresar",
        tag: "Contactos",
        title: "Selecciona el destinatario",
        selectAction: "Seleccionar",
        empty: "Aún no hay destinatarios internacionales guardados disponibles desde este país.",
      },
      summary: {
        back: "← Cambiar destinatario",
        tag: "Resumen",
        title: "Confirma la transferencia",
        subtitle: "Revisa los detalles antes de enviar.",
        recipientLabel: "Destinatario",
        amountLabel: "Monto",
        noteLabel: "Nota",
        youSend: "Envías",
        exchangeRate: "Tasa de cambio",
        receivedIn: "Recibido en",
        confirmLabel: "Confirmar",
        releaseToConfirm: "Suelta para confirmar",
        slideToConfirm: "Desliza para confirmar",
      },
      processing: {
        tag: "Procesando",
        title: "Procesando tu transacción",
        subtitle: "Esto podría tomar unos segundos",
      },
      historyDetail: {
        back: "← Volver al historial",
        tag: "Detalles",
        titlePrefix: "Transferencia a",
        amountSent: "Monto enviado",
        receives: "Recibe",
        exchangeRateLabel: "Tasa de cambio:",
        recipientLabel: "Destinatario",
        reference: "Referencia",
        purpose: "Propósito",
        fee: "Comisión",
        share: "Compartir",
      },
      success: {
        title: "Transferencia enviada",
        subtitle: "Zelify notificó al destinatario",
        cta: "Hacer otra transferencia",
        transactionDetails: "Detalles de la transacción",
        dateHour: "Fecha/Hora",
        recipient: "Destinatario",
        transactionNumber: "Número de transacción",
        paymentMethod: "Método de pago",
        amount: "Monto",
        fee: "Comisión",
        total: "Total",
        share: "Compartir",
        download: "Descargar",
      },
      statuses: {
        completed: "Completada",
        pending: "Pendiente",
        failed: "Fallida",
      },
      defaultNote: "Pago semanal",
    },
    config: {
      title: "Configuración",
      description: "Selecciona el país para ajustar la divisa.",
      currencyLabel: "Divisa:",
    },
  },
};

export function useInternationalTransfersTranslations() {
  return useLanguageTranslations(INTERNATIONAL_TRANSFERS_TRANSLATIONS);
}

