"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";

type TransfersTranslations = {
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
  };
  slider: {
    label: string;
    release: string;
    drag: string;
  };
  historyDetail: {
    back: string;
    tag: string;
    titlePrefix: string;
    dateLabel: string;
    amountLabel: string;
    recipientLabel: string;
    reference: string;
    concept: string;
    fee: string;
    share: string;
  };
  processing: {
    tag: string;
    title: string;
    subtitle: string;
  };
  success: {
    title: string;
    subtitle: string;
    cta: string;
  };
  config: {
    title: string;
    description: string;
    currencyLabel: string;
  };
  customization: {
    title: string;
    description: string;
    txGuardLabel: string;
    accountTypes: {
      operational: { name: string; description: string };
      individual: { name: string; description: string };
    };
    dailyLimitLabel: string;
    perTransactionLabel: string;
    dualApproval: { title: string; desc: string; active: string; inactive: string };
    autoBlock: { title: string; desc: string; active: string; inactive: string };
    saveButton: string;
  };
  statuses: Record<"completed" | "pending" | "failed", string>;
  previewTitle: string;
  defaultNote: string;
};

const TRANSFERS_TRANSLATIONS: Record<Language, TransfersTranslations> = {
  en: {
    amount: {
      tag: "Transfers",
      title: "How much do you want to transfer?",
      subtitle: "Select the currency based on the destination country.",
      amountLabel: "Amount",
      recipientAria: "Choose recipient",
      historyTag: "History",
      historyTitle: "Latest transfers",
      viewAll: "View all",
      empty: "No recent transfers for this country.",
    },
    recipients: {
      back: "← Back",
      tag: "Contacts",
      title: "Select the recipient",
      selectAction: "Select",
      empty: "No saved recipients for this country.",
    },
    summary: {
      back: "← Change recipient",
      tag: "Summary",
      title: "Confirm the transfer",
      subtitle: "Review the details before sending.",
      recipientLabel: "Recipient",
      amountLabel: "Amount",
      noteLabel: "Note",
    },
    slider: {
      label: "Confirm",
      release: "Release to confirm",
      drag: "Slide to confirm",
    },
    historyDetail: {
      back: "← Back to history",
      tag: "Details",
      titlePrefix: "Transfer to",
      dateLabel: "Date",
      amountLabel: "Amount sent",
      recipientLabel: "Recipient",
      reference: "Reference",
      concept: "Concept",
      fee: "Fee",
      share: "Share",
    },
    processing: {
      tag: "Processing",
      title: "Sending transfer...",
      subtitle: "This will just take a moment.",
    },
    success: {
      title: "Transfer sent",
      subtitle: "Zelify notified the recipient.",
      cta: "Make another transfer",
    },
    config: {
      title: "Configuration",
      description: "Select the country to adjust currency.",
      currencyLabel: "Currency:",
    },
    customization: {
      title: "Custom rules",
      description: "Configure limits and policies per account type.",
      txGuardLabel: "Tx Guard",
      accountTypes: {
        operational: { name: "Operational account", description: "Day-to-day payments with automated monitoring." },
        individual: { name: "Individual account", description: "Users with limited access and basic controls." },
      },
      dailyLimitLabel: "Daily limit",
      perTransactionLabel: "Per transaction",
      dualApproval: { title: "Dual approval", desc: "Require two approvers for sensitive amounts.", active: "Active", inactive: "Inactive" },
      autoBlock: { title: "Auto block", desc: "Stop accounts with more than 3 alerts in 24h.", active: "Active", inactive: "Inactive" },
      saveButton: "Save settings",
    },
    statuses: {
      completed: "Completed",
      pending: "Pending",
      failed: "Failed",
    },
    previewTitle: "Mobile Preview",
    defaultNote: "Weekly payment",
  },
  es: {
    amount: {
      tag: "Transferencias",
      title: "¿Cuánto deseas transferir?",
      subtitle: "Selecciona la divisa según el país.",
      amountLabel: "Monto",
      recipientAria: "Elegir destinatario",
      historyTag: "Historial",
      historyTitle: "Últimas transferencias",
      viewAll: "Ver todo",
      empty: "Sin transferencias recientes para este país.",
    },
    recipients: {
      back: "← Regresar",
      tag: "Contactos",
      title: "Selecciona el destinatario",
      selectAction: "Seleccionar",
      empty: "No hay destinatarios guardados para este país.",
    },
    summary: {
      back: "← Cambiar destinatario",
      tag: "Resumen",
      title: "Confirma la transferencia",
      subtitle: "Revisa los detalles antes de enviar.",
      recipientLabel: "Destinatario",
      amountLabel: "Monto",
      noteLabel: "Nota",
    },
    slider: {
      label: "Confirmar",
      release: "Suelta para confirmar",
      drag: "Desliza para confirmar",
    },
    historyDetail: {
      back: "← Volver al historial",
      tag: "Detalle",
      titlePrefix: "Transferencia a",
      dateLabel: "Fecha",
      amountLabel: "Monto enviado",
      recipientLabel: "Destinatario",
      reference: "Referencia",
      concept: "Concepto",
      fee: "Comisión",
      share: "Compartir",
    },
    processing: {
      tag: "Procesando",
      title: "Enviando transferencia...",
      subtitle: "Esto tomará solo un momento.",
    },
    success: {
      title: "Transferencia enviada",
      subtitle: "Zelify notificó al destinatario.",
      cta: "Hacer otra transferencia",
    },
    config: {
      title: "Configuración",
      description: "Selecciona el país para ajustar la divisa.",
      currencyLabel: "Divisa:",
    },
    customization: {
      title: "Reglas personalizadas",
      description: "Configura límites y políticas por tipo de cuenta.",
      txGuardLabel: "Tx Guard",
      accountTypes: {
        operational: { name: "Cuenta operativa", description: "Pagos del día a día con monitoreo automatizado." },
        individual: { name: "Cuenta individual", description: "Usuarios con acceso limitado y controles básicos." },
      },
      dailyLimitLabel: "Límite diario",
      perTransactionLabel: "Monto por operación",
      dualApproval: { title: "Doble aprobación", desc: "Solicitar dos aprobadores para montos sensibles.", active: "Activo", inactive: "Inactivo" },
      autoBlock: { title: "Bloqueo automático", desc: "Detener cuentas con más de 3 alertas en 24h.", active: "Activo", inactive: "Inactivo" },
      saveButton: "Guardar configuración",
    },
    statuses: {
      completed: "Completada",
      pending: "Pendiente",
      failed: "Fallida",
    },
    previewTitle: "Vista previa móvil",
    defaultNote: "Pago semanal",
  },
};

export function useTransfersTranslations() {
  return useLanguageTranslations(TRANSFERS_TRANSLATIONS);
}

export { TRANSFERS_TRANSLATIONS };
