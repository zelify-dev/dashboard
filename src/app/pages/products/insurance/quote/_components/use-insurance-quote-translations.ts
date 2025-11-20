"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";

type InsuranceQuoteTranslations = {
  breadcrumb: string;
  preview: {
    title: string;
    mobilePreview: string;
    webPreview: string;
    start: {
      tag: string;
      title: string;
      subtitle: string;
      startingAt: string;
    };
    types: {
      auto: {
        name: string;
      };
      home: {
        name: string;
      };
      health: {
        name: string;
      };
      life: {
        name: string;
      };
    };
    info: {
      back: string;
      tellUs: string;
      fullName: string;
      fullNamePlaceholder: string;
      age: string;
      agePlaceholder: string;
      continue: string;
    };
    coverage: {
      back: string;
      title: string;
      subtitle: string;
      basic: {
        name: string;
        desc: string;
        price: string;
      };
      standard: {
        name: string;
        desc: string;
        price: string;
      };
      premium: {
        name: string;
        desc: string;
        price: string;
      };
    };
    quote: {
      back: string;
      title: string;
      personalizedFor: string;
      monthlyPremium: string;
      perMonth: string;
      coverageType: string;
      age: string;
      years: string;
      acceptQuote: string;
    };
    success: {
      title: string;
      subtitle: string;
      getAnotherQuote: string;
    };
  };
  settings: {
    title: string;
    description: string;
    defaultCurrency: string;
    ageMultiplier: string;
    premiumCoverageMultiplier: string;
  };
};

const INSURANCE_QUOTE_TRANSLATIONS: Record<Language, InsuranceQuoteTranslations> = {
  en: {
    breadcrumb: "Insurance / Quote",
    preview: {
      title: "Mobile Preview",
      mobilePreview: "Mobile Preview",
      webPreview: "Web Preview",
      start: {
        tag: "Insurance",
        title: "Get a Quote",
        subtitle: "Find the perfect insurance plan for you",
        startingAt: "Starting at",
      },
      types: {
        auto: {
          name: "Auto Insurance",
        },
        home: {
          name: "Home Insurance",
        },
        health: {
          name: "Health Insurance",
        },
        life: {
          name: "Life Insurance",
        },
      },
      info: {
        back: "← Back",
        tellUs: "Tell us about yourself",
        fullName: "Full Name",
        fullNamePlaceholder: "John Doe",
        age: "Age",
        agePlaceholder: "30",
        continue: "Continue",
      },
      coverage: {
        back: "← Back",
        title: "Select Coverage",
        subtitle: "Choose the level of protection",
        basic: {
          name: "Basic",
          desc: "Essential coverage",
          price: "Base",
        },
        standard: {
          name: "Standard",
          desc: "Enhanced protection",
          price: "+20%",
        },
        premium: {
          name: "Premium",
          desc: "Comprehensive coverage",
          price: "+50%",
        },
      },
      quote: {
        back: "← Back",
        title: "Your Quote",
        personalizedFor: "Personalized for",
        monthlyPremium: "Monthly Premium",
        perMonth: "per month",
        coverageType: "Coverage Type",
        age: "Age",
        years: "years",
        acceptQuote: "Accept Quote",
      },
      success: {
        title: "Quote Accepted!",
        subtitle: "Your insurance application is being processed",
        getAnotherQuote: "Get Another Quote",
      },
    },
    settings: {
      title: "Quote Settings",
      description: "Configure insurance quote parameters",
      defaultCurrency: "Default Currency",
      ageMultiplier: "Age Multiplier (50+)",
      premiumCoverageMultiplier: "Premium Coverage Multiplier",
    },
  },
  es: {
    breadcrumb: "Seguros / Cotización",
    preview: {
      title: "Vista previa móvil",
      mobilePreview: "Vista previa móvil",
      webPreview: "Vista previa web",
      start: {
        tag: "Seguros",
        title: "Obtener Cotización",
        subtitle: "Encuentra el plan de seguros perfecto para ti",
        startingAt: "Desde",
      },
      types: {
        auto: {
          name: "Seguro de Auto",
        },
        home: {
          name: "Seguro de Hogar",
        },
        health: {
          name: "Seguro de Salud",
        },
        life: {
          name: "Seguro de Vida",
        },
      },
      info: {
        back: "← Regresar",
        tellUs: "Cuéntanos sobre ti",
        fullName: "Nombre Completo",
        fullNamePlaceholder: "Juan Pérez",
        age: "Edad",
        agePlaceholder: "30",
        continue: "Continuar",
      },
      coverage: {
        back: "← Regresar",
        title: "Seleccionar Cobertura",
        subtitle: "Elige el nivel de protección",
        basic: {
          name: "Básico",
          desc: "Cobertura esencial",
          price: "Base",
        },
        standard: {
          name: "Estándar",
          desc: "Protección mejorada",
          price: "+20%",
        },
        premium: {
          name: "Premium",
          desc: "Cobertura integral",
          price: "+50%",
        },
      },
      quote: {
        back: "← Regresar",
        title: "Tu Cotización",
        personalizedFor: "Personalizada para",
        monthlyPremium: "Prima Mensual",
        perMonth: "por mes",
        coverageType: "Tipo de Cobertura",
        age: "Edad",
        years: "años",
        acceptQuote: "Aceptar Cotización",
      },
      success: {
        title: "¡Cotización Aceptada!",
        subtitle: "Tu solicitud de seguro está siendo procesada",
        getAnotherQuote: "Obtener Otra Cotización",
      },
    },
    settings: {
      title: "Configuración de Cotización",
      description: "Configura los parámetros de cotización de seguros",
      defaultCurrency: "Moneda Predeterminada",
      ageMultiplier: "Multiplicador de Edad (50+)",
      premiumCoverageMultiplier: "Multiplicador de Cobertura Premium",
    },
  },
};

export function useInsuranceQuoteTranslations() {
  return useLanguageTranslations(INSURANCE_QUOTE_TRANSLATIONS);
}

