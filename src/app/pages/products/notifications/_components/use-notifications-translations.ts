"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";
import type { TemplateKey } from "./notifications-data";

type TemplateCopy = Record<
  TemplateKey,
  {
    name: string;
    subject: string;
    description: string;
  }
>;

type NotificationsTranslations = {
  breadcrumb: string;
  pageTitle: string;
  pageDescription: string;
  categorySelector: {
    title: string;
    mailing: {
      label: string;
      description: string;
    };
    notifications: {
      label: string;
      description: string;
    };
  };
  summaryCards: {
    total: string;
    active: string;
    lastUpdated: string;
  };
  templateList: {
    title: string;
    lastUsed: string;
    status: {
      active: string;
      inactive: string;
      draft: string;
    };
    channel: {
      email: string;
      push: string;
    };
  };
  previewPanel: {
    title: string;
    html: string;
    live: string;
    activate: string;
    save: string;
    activeBadge: string;
    noSelection: string;
  };
  alerts: {
    saved: string;
    activated: string;
  };
  templates: TemplateCopy;
};

const NOTIFICATIONS_TRANSLATIONS: Record<Language, NotificationsTranslations> = {
  es: {
    breadcrumb: "Notificaciones / Plantillas",
    pageTitle: "Centro de plantillas",
    pageDescription:
      "Administra tus notificaciones de mailing y push. Activa variaciones, revisa su código y publica cambios en segundos.",
    categorySelector: {
      title: "Canales disponibles",
      mailing: {
        label: "Mailing",
        description: "Plantillas HTML optimizadas para email y correos automatizados.",
      },
      notifications: {
        label: "Notificaciones",
        description: "Alertas push e in-app con mensajes cortos y contexto transaccional.",
      },
    },
    summaryCards: {
      total: "Plantillas disponibles",
      active: "Plantilla activa",
      lastUpdated: "Última actualización",
    },
    templateList: {
      title: "Previsualizaciones",
      lastUsed: "Último uso",
      status: {
        active: "Activa",
        inactive: "Inactiva",
        draft: "Borrador",
      },
      channel: {
        email: "Email",
        push: "Push",
      },
    },
    previewPanel: {
      title: "Panel de edición",
      html: "Código HTML",
      live: "Vista previa",
      activate: "Activar plantilla",
      save: "Guardar cambios",
      activeBadge: "Activa",
      noSelection: "Selecciona una plantilla para ver el código y la vista previa",
    },
    alerts: {
      saved: "Plantilla guardada correctamente.",
      activated: "Plantilla activada para el canal seleccionado.",
    },
    templates: {
      otpCode: {
        name: "Envío de código OTP",
        subject: "Tu código para continuar",
        description: "Entrega códigos de verificación seguros por correo electrónico.",
      },
      otpReminder: {
        name: "Recordatorio de OTP",
        subject: "Tu código sigue activo",
        description: "Envía un recordatorio antes de que el código expire.",
      },
      securityAlert: {
        name: "Alerta de seguridad",
        subject: "Nuevo inicio de sesión detectado",
        description: "Envía advertencias inmediatas cuando se detectan accesos inusuales.",
      },
      monthlySummary: {
        name: "Resumen mensual",
        subject: "Actividad y métricas del mes",
        description: "Compila la actividad de la cuenta y próximos pagos.",
      },
      transferPush: {
        name: "Push de transferencias",
        subject: "Cash-out confirmado",
        description: "Mensaje corto para confirmar envíos salientes exitosos.",
      },
      cashOutAlert: {
        name: "Alerta de cash-out",
        subject: "Revisa este movimiento",
        description: "Pide confirmación cuando detectas retiros con riesgo.",
      },
    },
  },
  en: {
    breadcrumb: "Notifications / Templates",
    pageTitle: "Templates workspace",
    pageDescription:
      "Manage your email and push templates. Activate variations, inspect their code and publish changes in seconds.",
    categorySelector: {
      title: "Channels",
      mailing: {
        label: "Mailing",
        description: "HTML templates optimized for onboarding and automated email flows.",
      },
      notifications: {
        label: "Notifications",
        description: "Push or in-app alerts with compact transactional messaging.",
      },
    },
    summaryCards: {
      total: "Templates available",
      active: "Active template",
      lastUpdated: "Last edit",
    },
    templateList: {
      title: "Preview gallery",
      lastUsed: "Last triggered",
      status: {
        active: "Active",
        inactive: "Inactive",
        draft: "Draft",
      },
      channel: {
        email: "Email",
        push: "Push",
      },
    },
    previewPanel: {
      title: "Editing panel",
      html: "HTML code",
      live: "Live preview",
      activate: "Activate template",
      save: "Save changes",
      activeBadge: "Active",
      noSelection: "Pick a template to display its code and preview",
    },
    alerts: {
      saved: "Template saved successfully.",
      activated: "Template activated for the selected channel.",
    },
    templates: {
      otpCode: {
        name: "OTP delivery",
        subject: "Your verification code",
        description: "Send secure verification codes via email.",
      },
      otpReminder: {
        name: "OTP reminder",
        subject: "Your code is still valid",
        description: "Remind users to finish verification before the code expires.",
      },
      securityAlert: {
        name: "Security alert",
        subject: "New login detected",
        description: "Warns users when unusual access attempts appear.",
      },
      monthlySummary: {
        name: "Monthly summary",
        subject: "Activity recap",
        description: "Shares account metrics and next scheduled payment.",
      },
      transferPush: {
        name: "Transfer push",
        subject: "Cash-out confirmed",
        description: "Short push to confirm outgoing transfers.",
      },
      cashOutAlert: {
        name: "Cash-out alert",
        subject: "Review this movement",
        description: "Requests confirmation for risky withdrawals.",
      },
    },
  },
};

export function useNotificationsTranslations() {
  return useLanguageTranslations(NOTIFICATIONS_TRANSLATIONS);
}
