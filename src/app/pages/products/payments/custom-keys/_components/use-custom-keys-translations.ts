"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";

type CustomKeysTranslations = {
  breadcrumb: string;
  preview: {
    title: string;
    mobileLabel: string;
    webLabel: string;
    switchToMobile: string;
    switchToWeb: string;
    header: {
      title: string;
      subtitle: string;
    };
    customKey: {
      label: string;
      edit: string;
    };
    keyTypes: {
      cedula: string;
      telefono: string;
      correo: string;
    };
    contacts: {
      title: string;
      empty: string;
      select: string;
    };
    buttons: {
      payToContact: string;
      payToCustomKey: string;
    };
    editModal: {
      title: string;
      keyTypeLabel: string;
      valueLabel: string;
      placeholder: string;
      cancel: string;
      save: string;
      emptyTypes: string;
    };
    paymentModal: {
      title: string;
      amountLabel: string;
      cancel: string;
      confirm: string;
      processing: string;
      processingSubtitle: string;
    };
    newKeyPaymentModal: {
      title: string;
      customKeyLabel: string;
      customKeyPlaceholder: string;
      amountLabel: string;
      cancel: string;
      confirm: string;
      processing: string;
      processingSubtitle: string;
    };
  };
  config: {
    title: string;
    description: string;
    customKeysTitle: string;
    availableTypesLabel: string;
    availableTypesDescription: string;
    brandingTitle: string;
    themeLabel: string;
    lightMode: string;
    darkMode: string;
    logoLabel: string;
    logoUploadHelp: string;
    uploadButton: string;
    removeLogo: string;
    colorLabel: string;
  };
};

const CUSTOM_KEYS_TRANSLATIONS: Record<Language, CustomKeysTranslations> = {
  en: {
    breadcrumb: "Custom Keys",
    preview: {
      title: "Mobile Preview",
      mobileLabel: "Mobile",
      webLabel: "Web",
      switchToMobile: "Switch to mobile view",
      switchToWeb: "Switch to web view",
      header: {
        title: "Payments",
        subtitle: "Make fast and secure payments",
      },
      customKey: {
        label: "Custom Key Configured",
        edit: "Edit",
      },
      keyTypes: {
        cedula: "ID Number",
        telefono: "Phone",
        correo: "Email",
      },
      contacts: {
        title: "Suggested Contacts",
        empty: "No contacts available. Enable at least one key type in settings.",
        select: "Select",
      },
      buttons: {
        payToContact: "Pay to",
        payToCustomKey: "Pay to Custom Key",
      },
      editModal: {
        title: "Edit",
        keyTypeLabel: "Key type",
        valueLabel: "Value",
        placeholder: "Enter your",
        cancel: "Cancel",
        save: "Save",
        emptyTypes: "No key types available. Enable at least one in settings.",
      },
      paymentModal: {
        title: "Confirm Payment",
        amountLabel: "Amount",
        cancel: "Cancel",
        confirm: "Confirm Payment",
        processing: "Processing payment...",
        processingSubtitle: "Please wait",
      },
      newKeyPaymentModal: {
        title: "Pay to Custom Key",
        customKeyLabel: "Custom Key",
        customKeyPlaceholder: "Enter the recipient's custom key",
        amountLabel: "Amount",
        cancel: "Cancel",
        confirm: "Confirm Payment",
        processing: "Processing payment...",
        processingSubtitle: "Please wait",
      },
    },
    config: {
      title: "Configuration",
      description: "Configure Custom Keys settings",
      customKeysTitle: "Custom Keys",
      availableTypesLabel: "Available key types",
      availableTypesDescription: "Select the key types that users can use. At least one type must be enabled.",
      brandingTitle: "Branding",
      themeLabel: "Theme",
      logoLabel: "Logo",
      logoUploadHelp: "Drop, paste or select an image",
      uploadButton: "Upload",
      removeLogo: "Remove",
      colorLabel: "Custom color",
      lightMode: "Light",
      darkMode: "Dark",
    },
  },
  es: {
    breadcrumb: "Custom Keys",
    preview: {
      title: "Vista previa móvil",
      mobileLabel: "Móvil",
      webLabel: "Web",
      switchToMobile: "Cambiar a la vista móvil",
      switchToWeb: "Cambiar a la vista web",
      header: {
        title: "Pagos",
        subtitle: "Realiza pagos rápidos y seguros",
      },
      customKey: {
        label: "Custom Key Configurada",
        edit: "Editar",
      },
      keyTypes: {
        cedula: "Cédula",
        telefono: "Teléfono",
        correo: "Correo",
      },
      contacts: {
        title: "Contactos Sugeridos",
        empty: "No hay contactos disponibles. Habilita al menos un tipo de clave en la configuración.",
        select: "Seleccionar",
      },
      buttons: {
        payToContact: "Pagar a",
        payToCustomKey: "Pagar a Custom Key",
      },
      editModal: {
        title: "Editar",
        keyTypeLabel: "Tipo de clave",
        valueLabel: "Valor",
        placeholder: "Ingresa tu",
        cancel: "Cancelar",
        save: "Guardar",
        emptyTypes: "No hay tipos de claves disponibles. Habilita al menos uno en la configuración.",
      },
      paymentModal: {
        title: "Confirmar Pago",
        amountLabel: "Monto",
        cancel: "Cancelar",
        confirm: "Confirmar Pago",
        processing: "Procesando pago...",
        processingSubtitle: "Por favor espera",
      },
      newKeyPaymentModal: {
        title: "Pagar a Custom Key",
        customKeyLabel: "Custom Key",
        customKeyPlaceholder: "Ingresa la custom key del destinatario",
        amountLabel: "Monto",
        cancel: "Cancelar",
        confirm: "Confirmar Pago",
        processing: "Procesando pago...",
        processingSubtitle: "Por favor espera",
      },
    },
    config: {
      title: "Configuración",
      description: "Configura los ajustes de Custom Keys",
      customKeysTitle: "Custom Keys",
      availableTypesLabel: "Tipos de claves disponibles",
      availableTypesDescription: "Selecciona los tipos de claves que los usuarios pueden usar. Debe haber al menos un tipo habilitado.",
      brandingTitle: "Branding",      themeLabel: "Tema",      logoLabel: "Logo",
      logoUploadHelp: "Suelta, pega o selecciona una imagen",
      uploadButton: "Subir",
      removeLogo: "Quitar",
      colorLabel: "Color personalizado",
      lightMode: "Claro",
      darkMode: "Oscuro",
    },
  },
};

export function useCustomKeysTranslations() {
  return useLanguageTranslations(CUSTOM_KEYS_TRANSLATIONS);
}

