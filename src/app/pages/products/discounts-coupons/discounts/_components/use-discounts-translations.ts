"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";

type DiscountsTranslations = {
  preview: {
    back: string;
    continue: string;
    perMonth: string;
    planSelection: {
      title: string;
      subtitle: string;
    };
    basicInfo: {
      title: string;
      subtitle: string;
      businessNameLabel: string;
      businessNamePlaceholder: string;
      businessIdLabel: string;
      businessIdPlaceholder: string;
    };
    map: {
      businessAddress: string;
      heroAlt: string;
    };
    addressDetails: {
      title: string;
      phoneLabel: string;
      buildingLabel: string;
      buildingPlaceholder: string;
      floorLabel: string;
      floorPlaceholder: string;
      referenceLabel: string;
      referencePlaceholder: string;
    };
    description: {
      title: string;
      prompt: string;
      label: string;
      placeholder: string;
    };
    categoryDetection: {
      detected: string;
      category: string;
      noTryAgain: string;
      yesContinue: string;
    };
    plans: {
      free: { title: string; features: string[] };
      premium: { title: string; features: string[] };
    };
  };
  configPanel: {
    title: string;
    planVerification: string;
    planSuffix: string;
    hereWeGoScreenTitle: string;
    quantityDiscountsToShowLabel: string;
    configurePromoScreenTitle: string;
    showHourFieldLabel: string;
    customBrandingTitle: string;
    logoFormatsHint: string;
    unsavedChanges: string;
    fields: { title: string; price: string };
    theme: {
      title: string;
      light: string;
      dark: string;
    };
    logo: {
      title: (mode: string) => string;
      light: string;
      dark: string;
      upload: string;
      change: string;
      remove: string;
      hint: string;
    };
    colors: { title: (mode: string) => string; label: string };
      actions: { saveChanges: string; saving: string };
    errors: {
      invalidFileType: string;
      fileTooLarge: string;
      imageTooLarge: string;
      imageProcessError: string;
    };
  };
};

const DISCOUNTS_TRANSLATIONS: Record<Language, DiscountsTranslations> = {
  en: {
    preview: {
      back: "Back",
      continue: "Continue",
      perMonth: "/mo",
      planSelection: {
        title: "Business",
        subtitle: "Choose a plan",
      },
      basicInfo: {
        title: "Business",
        subtitle: "Fill the fields to continue",
        businessNameLabel: "Company or business name",
        businessNamePlaceholder: "Enter name",
        businessIdLabel: "Company or business ID",
        businessIdPlaceholder: "Enter ID",
      },
      map: {
        businessAddress: "Business Address",
        heroAlt: "Animation",
      },
      addressDetails: {
        title: "Address details",
        phoneLabel: "Business phone number",
        buildingLabel: "Building name",
        buildingPlaceholder: "e.g. Antares",
        floorLabel: "Floor/Office",
        floorPlaceholder: "e.g. 54",
        referenceLabel: "Reference",
        referencePlaceholder: "e.g. Next to Nissan",
      },
      description: {
        title: "Business",
        prompt: "Please tell us a little bit about your business",
        label: "Business Description",
        placeholder: "Type your description here...",
      },
      categoryDetection: {
        detected: "We have detected your business category:",
        category: "General",
        noTryAgain: "No, Try Again",
        yesContinue: "Yes, Continue",
      },
      plans: {
        free: {
          title: "Free",
          features: [
            "$500 Transactional Limit",
            "Up to 20 Monthly Transactions",
            "Business Geo-Location",
            "Customer Support",
          ],
        },
        premium: {
          title: "Premium",
          features: [
            "$10,000 Transactional Limit",
            "Monthly Unlimited Transactions",
            "Preferential Geo-Location",
            "Customized Cards Options",
            "Unlimited Discounts & Coupons",
            "Special Customer Support",
          ],
        },
      },
    },
    configPanel: {
      title: "Discounts Configuration",
      planVerification: "Plan Verification",
      planSuffix: "Plan",
      hereWeGoScreenTitle: "\"Here We Go\" Screen",
      quantityDiscountsToShowLabel: "Quantity of discounts to show",
      configurePromoScreenTitle: "\"Configure Promo\" Screen",
      showHourFieldLabel: "Show \"Hour\" field",
      customBrandingTitle: "Custom Branding",
      logoFormatsHint: "PNG, JPG, SVG up to 5MB",
      unsavedChanges: "Unsaved changes",
      fields: { title: "Title", price: "Price" },
      theme: { title: "Theme", light: "Light Mode", dark: "Dark Mode" },
      logo: {
        title: (mode) => `Logo (${mode} mode)`,
        light: "Light",
        dark: "Dark",
        upload: "Upload Logo",
        change: "Change Logo",
        remove: "Remove",
        hint: "Drag, paste or select an image (max. 5MB)",
      },
      colors: {
        title: (mode) => `Color Palette (${mode} mode)`,
        label: "Custom Color",
      },
      actions: { saveChanges: "Save Changes", saving: "Saving..." },
      errors: {
        invalidFileType: "Invalid file type. Please upload PNG, JPG, GIF, WEBP or SVG.",
        fileTooLarge: "File is too large. Max allowed size is 5MB.",
        imageTooLarge: "Optimized image is still too large. Try a smaller image.",
        imageProcessError: "Error processing image. Please try again.",
      },
    },
  },
  es: {
    preview: {
      back: "Volver",
      continue: "Continuar",
      perMonth: "/mes",
      planSelection: {
        title: "Negocio",
        subtitle: "Elige un plan",
      },
      basicInfo: {
        title: "Negocio",
        subtitle: "Completa los campos para continuar",
        businessNameLabel: "Nombre de la empresa o negocio",
        businessNamePlaceholder: "Ingresa el nombre",
        businessIdLabel: "ID de la empresa o negocio",
        businessIdPlaceholder: "Ingresa el ID",
      },
      map: {
        businessAddress: "Dirección del negocio",
        heroAlt: "Animación",
      },
      addressDetails: {
        title: "Detalles de dirección",
        phoneLabel: "Teléfono del negocio",
        buildingLabel: "Edificio",
        buildingPlaceholder: "Ej. Antares",
        floorLabel: "Piso/Oficina",
        floorPlaceholder: "Ej. 54",
        referenceLabel: "Referencia",
        referencePlaceholder: "Ej. Al lado de Nissan",
      },
      description: {
        title: "Negocio",
        prompt: "Cuéntanos un poco sobre tu negocio",
        label: "Descripción del negocio",
        placeholder: "Escribe tu descripción aquí...",
      },
      categoryDetection: {
        detected: "Hemos detectado la categoría de tu negocio:",
        category: "General",
        noTryAgain: "No, intentar de nuevo",
        yesContinue: "Sí, continuar",
      },
      plans: {
        free: {
          title: "Gratis",
          features: [
            "Límite transaccional $500",
            "Hasta 20 transacciones mensuales",
            "Geolocalización del negocio",
            "Soporte al cliente",
          ],
        },
        premium: {
          title: "Premium",
          features: [
            "Límite transaccional $10,000",
            "Transacciones mensuales ilimitadas",
            "Geolocalización preferencial",
            "Opciones de tarjetas personalizadas",
            "Descuentos y cupones ilimitados",
            "Soporte al cliente especial",
          ],
        },
      },
    },
    configPanel: {
      title: "Configuración de descuentos",
      planVerification: "Verificación de planes",
      planSuffix: "Plan",
      hereWeGoScreenTitle: "Pantalla \"Aquí vamos\"",
      quantityDiscountsToShowLabel: "Cantidad de descuentos a mostrar",
      configurePromoScreenTitle: "Pantalla \"Configurar promo\"",
      showHourFieldLabel: "Mostrar campo \"Hora\"",
      customBrandingTitle: "Personalización de marca",
      logoFormatsHint: "PNG, JPG, SVG hasta 5MB",
      unsavedChanges: "Cambios sin guardar",
      fields: { title: "Título", price: "Precio" },
      theme: { title: "Tema", light: "Modo claro", dark: "Modo oscuro" },
      logo: {
        title: (mode) => `Logo (modo ${mode})`,
        light: "Claro",
        dark: "Oscuro",
        upload: "Subir logo",
        change: "Cambiar logo",
        remove: "Quitar",
        hint: "Arrastra, pega o selecciona una imagen (máx. 5MB)",
      },
      colors: {
        title: (mode) => `Paleta de colores (modo ${mode})`,
        label: "Color personalizado",
      },
      actions: { saveChanges: "Guardar cambios", saving: "Guardando..." },
      errors: {
        invalidFileType: "Formato no válido. Sube PNG, JPG, GIF, WEBP o SVG.",
        fileTooLarge: "El archivo es demasiado grande. Máximo 5MB.",
        imageTooLarge: "La imagen optimizada sigue siendo muy grande. Intenta con una más pequeña.",
        imageProcessError: "Error al procesar la imagen. Por favor, intenta de nuevo.",
      },
    },
  },
};

export function useDiscountsTranslations() {
  return useLanguageTranslations(DISCOUNTS_TRANSLATIONS);
}
