"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";

type InsuranceAssistanceTranslations = {
  breadcrumb: string;
  preview: {
    title: string;
    mobilePreview: string;
    webPreview: string;
    home: {
      tag: string;
      title: string;
      subtitle: string;
      contactSupport: string;
    };
    categories: {
      claims: {
        name: string;
        description: string;
      };
      coverage: {
        name: string;
        description: string;
      };
      emergency: {
        name: string;
        description: string;
      };
      documents: {
        name: string;
        description: string;
      };
    };
    details: {
      back: string;
      status: string;
      statusValue: string;
      responseTime: string;
      responseTimeValue: string;
      getAssistance: string;
    };
    contact: {
      back: string;
      title: string;
      subtitle: string;
      phone: string;
      email: string;
      liveChat: string;
      availableNow: string;
    };
  };
  settings: {
    title: string;
    description: string;
    supportHours: string;
    supportHoursOptions: {
      always: string;
      business: string;
      custom: string;
    };
    responseTime: string;
    enableLiveChat: string;
    enablePhoneSupport: string;
  };
};

const INSURANCE_ASSISTANCE_TRANSLATIONS: Record<Language, InsuranceAssistanceTranslations> = {
  en: {
    breadcrumb: "Insurance / Assistance",
    preview: {
      title: "Mobile Preview",
      mobilePreview: "Mobile Preview",
      webPreview: "Web Preview",
      home: {
        tag: "Insurance",
        title: "Assistance Center",
        subtitle: "Get help with your insurance needs",
        contactSupport: "Contact Support",
      },
      categories: {
        claims: {
          name: "Claims",
          description: "File and track insurance claims",
        },
        coverage: {
          name: "Coverage Info",
          description: "View your policy details",
        },
        emergency: {
          name: "Emergency",
          description: "24/7 emergency assistance",
        },
        documents: {
          name: "Documents",
          description: "Access policy documents",
        },
      },
      details: {
        back: "← Back",
        status: "Status",
        statusValue: "Available 24/7",
        responseTime: "Response Time",
        responseTimeValue: "Within 2 hours",
        getAssistance: "Get Assistance",
      },
      contact: {
        back: "← Back",
        title: "Contact Support",
        subtitle: "We're here to help you",
        phone: "Phone",
        email: "Email",
        liveChat: "Live Chat",
        availableNow: "Available now",
      },
    },
    settings: {
      title: "Settings",
      description: "Configure insurance assistance options",
      supportHours: "Support Hours",
      supportHoursOptions: {
        always: "24/7",
        business: "Business Hours",
        custom: "Custom",
      },
      responseTime: "Response Time",
      enableLiveChat: "Enable Live Chat",
      enablePhoneSupport: "Enable Phone Support",
    },
  },
  es: {
    breadcrumb: "Seguros / Asistencia",
    preview: {
      title: "Vista previa móvil",
      mobilePreview: "Vista previa móvil",
      webPreview: "Vista previa web",
      home: {
        tag: "Seguros",
        title: "Centro de Asistencia",
        subtitle: "Obtén ayuda con tus necesidades de seguros",
        contactSupport: "Contactar Soporte",
      },
      categories: {
        claims: {
          name: "Reclamos",
          description: "Presenta y rastrea reclamos de seguros",
        },
        coverage: {
          name: "Info de Cobertura",
          description: "Ver los detalles de tu póliza",
        },
        emergency: {
          name: "Emergencia",
          description: "Asistencia de emergencia 24/7",
        },
        documents: {
          name: "Documentos",
          description: "Acceder a documentos de póliza",
        },
      },
      details: {
        back: "← Regresar",
        status: "Estado",
        statusValue: "Disponible 24/7",
        responseTime: "Tiempo de Respuesta",
        responseTimeValue: "En menos de 2 horas",
        getAssistance: "Obtener Asistencia",
      },
      contact: {
        back: "← Regresar",
        title: "Contactar Soporte",
        subtitle: "Estamos aquí para ayudarte",
        phone: "Teléfono",
        email: "Correo",
        liveChat: "Chat en Vivo",
        availableNow: "Disponible ahora",
      },
    },
    settings: {
      title: "Configuración",
      description: "Configura las opciones de asistencia de seguros",
      supportHours: "Horas de Soporte",
      supportHoursOptions: {
        always: "24/7",
        business: "Horario Comercial",
        custom: "Personalizado",
      },
      responseTime: "Tiempo de Respuesta",
      enableLiveChat: "Habilitar Chat en Vivo",
      enablePhoneSupport: "Habilitar Soporte Telefónico",
    },
  },
};

export function useInsuranceAssistanceTranslations() {
  return useLanguageTranslations(INSURANCE_ASSISTANCE_TRANSLATIONS);
}

