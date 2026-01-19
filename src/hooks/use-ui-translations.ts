"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "./use-language-translations";

export type UiTranslations = {
  header: {
    title: string;
    searchPlaceholder: string;
    toggleSidebar: string;
    breadcrumbRoot: string;
  };
  languageToggle: {
    switchToSpanish: string;
    switchToEnglish: string;
  };
  sidebar: {
    closeMenu: string;
    mainMenu: string;
    products: string;
    menuItems: {
      dashboard: string;
      calendar: string;
      organization: string;
      zelifyKeys: string;
      allProducts: string;
      logs: string;
      webhooks: string;
      auth: string;
      aml: string;
      identity: string;
      connect: string;
      cards: string;
      transfers: string;
      tx: string;
      ai: string;
      payments: string;
      notifications: string;
      discountsCoupons: string;
      insurance: string;
      subItems: {
        ecommerce: string;
        profile: string;
        teams: string;
        authentication: string;
        geolocalization: string;
        deviceInformation: string;
        validationGlobalList: string;
        workflow: string;
        bankAccountLinking: string;
        issuing: string;
        design: string;
        transactions: string;
        diligence: string;
        basicService: string;
        transfers: string;
        internationalTransfers: string;
        alaiza: string;
        behaviorAnalysis: string;
        financialEducation: string;
        customKeys: string;
        qr: string;
        templates: string;
        domains: string;
        coupons: string;
        createCoupon: string;
        analyticsUsage: string;
        insuranceAssistance: string;
        quoteInsurance: string;
        discounts: string;
      };
    };
  };
  notification: {
    viewNotifications: string;
    notifications: string;
    new: string;
    seeAllNotifications: string;
    items: {
      piterJoined: string;
      congratulateHim: string;
      newMessage: string;
      devidSentMessage: string;
      newPaymentReceived: string;
      checkEarnings: string;
      jollyCompletedTasks: string;
      assignNewTask: string;
      romanJoined: string;
    };
  };
  userInfo: {
    myAccount: string;
    userInformation: string;
    viewProfile: string;
    accountSettings: string;
    logOut: string;
  };
  themeToggle: {
    switchToLight: string;
    switchToDark: string;
  };
<<<<<<< HEAD
  profilePage: {
    title: string;
    description: string;
    form: {
      businessName: string;
      businessNamePlaceholder: string;
      website: string;
      websitePlaceholder: string;
      address: string;
      addressPlaceholder: string;
      saveButton: string;
    };
=======
  tourModal: {
    selectProductsTitle: string;
    selectProductsDescription: string;
    selectAll: string;
    deselectAll: string;
    cancel: string;
    continue: string;
    welcomeTitle: string;
    welcomeDescription: string;
    selectedProducts: string;
    back: string;
    startTour: string;
  };
  tourOverlay: {
    previous: string;
    next: string;
    finish: string;
    pause: string;
    resume: string;
    step: string;
    of: string;
>>>>>>> e978d4d72b5f503b57e74dba7b9ecb82ea224a5e
  };
};

const UI_TRANSLATIONS: Record<Language, UiTranslations> = {
  en: {
    header: {
      title: "Dashboard",
      searchPlaceholder: "Search",
      toggleSidebar: "Toggle Sidebar",
      breadcrumbRoot: "Dashboard",
    },
    languageToggle: {
      switchToSpanish: "Switch language to Spanish",
      switchToEnglish: "Switch language to English",
    },
    sidebar: {
      closeMenu: "Close Menu",
      mainMenu: "MAIN MENU",
      products: "PRODUCTS",
      menuItems: {
        dashboard: "Dashboard",
        calendar: "Calendar",
        organization: "Organization",
        zelifyKeys: "Zelify Keys",
        allProducts: "All products",
        logs: "Logs",
        webhooks: "Webhooks",
        auth: "Auth",
        aml: "AML",
        identity: "Identity",
        connect: "Connect",
        cards: "Cards",
        transfers: "Transfers",
        tx: "Tx",
        ai: "AI",
        payments: "Payments and Transfers",
        notifications: "Notifications",
        discountsCoupons: "Discounts & Coupons",
        insurance: "Insurance",
        subItems: {
          ecommerce: "Panel",
          profile: "Company Profile",
          teams: "Teams",
          authentication: "Authentication",
          geolocalization: "Geolocalization",
          deviceInformation: "Device information",
          validationGlobalList: "Validación de listas globales",
          workflow: "Workflow",
          bankAccountLinking: "Bank account linking",
          issuing: "Issuing",
          design: "Design",
          transactions: "Transactions",
          diligence: "Diligence",
          basicService: "Basic Service",
          transfers: "Transfers",
          internationalTransfers: "International transfers",
          alaiza: "Alaiza",
          behaviorAnalysis: "Behavior Analysis",
          financialEducation: "Financial Education",
          customKeys: "Custom Keys",
          qr: "QR",
          templates: "Templates",
          domains: "Domains",
          coupons: "Coupons",
          createCoupon: "Create Coupon",
          analyticsUsage: "Analytics & Usage",
          insuranceAssistance: "Insurance Assistance",
          quoteInsurance: "Quote Insurance",
          discounts: "Discounts",
        },
      },
    },
    notification: {
      viewNotifications: "View Notifications",
      notifications: "Notifications",
      new: "new",
      seeAllNotifications: "See all notifications",
      items: {
        piterJoined: "Piter Joined the Team!",
        congratulateHim: "Congratulate him",
        newMessage: "New message",
        devidSentMessage: "Devid sent a new message",
        newPaymentReceived: "New Payment received",
        checkEarnings: "Check your earnings",
        jollyCompletedTasks: "Jolly completed tasks",
        assignNewTask: "Assign new task",
        romanJoined: "Roman Joined the Team!",
      },
    },
    userInfo: {
      myAccount: "My Account",
      userInformation: "User information",
      viewProfile: "View profile",
      accountSettings: "Account Settings",
      logOut: "Log out",
    },
    themeToggle: {
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
    },
<<<<<<< HEAD
    profilePage: {
      title: "General Information",
      description: "Complete your business general information",
      form: {
        businessName: "Business Name",
        businessNamePlaceholder: "Enter your business name",
        website: "Website",
        websitePlaceholder: "https://example.com",
        address: "Headquarters address",
        addressPlaceholder: "Enter the full address of the headquarters",
        saveButton: "Save general information",
      },
=======
    tourModal: {
      selectProductsTitle: "Select Products",
      selectProductsDescription: "Choose the products you want to include in the tour. You can select one or several products.",
      selectAll: "Select all",
      deselectAll: "Deselect all",
      cancel: "Cancel",
      continue: "Continue",
      welcomeTitle: "Welcome to the Tour",
      welcomeDescription: "A tour of the selected products will be shown below to help you learn about the main features of the application.",
      selectedProducts: "Selected products:",
      back: "Back",
      startTour: "Start Tour",
    },
    tourOverlay: {
      previous: "Previous",
      next: "Next",
      finish: "Finish",
      pause: "Pause tour",
      resume: "Resume tour",
      step: "Step",
      of: "of",
>>>>>>> e978d4d72b5f503b57e74dba7b9ecb82ea224a5e
    },
  },
  es: {
    header: {
      title: "Panel",
      searchPlaceholder: "Buscar",
      toggleSidebar: "Alternar barra lateral",
      breadcrumbRoot: "Panel",
    },
    languageToggle: {
      switchToSpanish: "Cambiar idioma a español",
      switchToEnglish: "Cambiar idioma a inglés",
    },
    sidebar: {
      closeMenu: "Cerrar menú",
      mainMenu: "MENÚ PRINCIPAL",
      products: "PRODUCTOS",
      menuItems: {
        dashboard: "Panel",
        calendar: "Calendario",
        organization: "Organización",
        zelifyKeys: "Zelify Keys",
        allProducts: "Todos los productos",
        logs: "Registros",
        webhooks: "Webhooks",
        auth: "Autenticación",
        aml: "AML",
        identity: "Identidad",
        connect: "Conectar",
        cards: "Tarjetas",
        transfers: "Transferencias",
        tx: "Tx",
        ai: "IA",
        payments: "Pagos y transferencias",
        notifications: "Notificaciones",
        discountsCoupons: "Descuentos y Cupones",
        insurance: "Seguros",
        subItems: {
          ecommerce: "Panel",
          profile: "Perfil de la empresa",
          teams: "Equipos",
          authentication: "Autenticación",
          geolocalization: "Geolocalización",
          deviceInformation: "Información del dispositivo",
          validationGlobalList: "Validación de listas globales",
          workflow: "Flujo de trabajo",
          bankAccountLinking: "Vinculación de cuenta bancaria",
          issuing: "Emisión",
          design: "Diseño",
          transactions: "Transacciones",
          diligence: "Diligencia",
          basicService: "Servicios Básicos",
          transfers: "Transferencias",
          internationalTransfers: "Transferencias internacionales",
          alaiza: "Alaiza",
          behaviorAnalysis: "Análisis de Comportamiento",
          financialEducation: "Educación Financiera",
          customKeys: "Claves Personalizadas",
          qr: "QR",
          templates: "Plantillas",
          domains: "Domains",
          coupons: "Cupones",
          createCoupon: "Crear Cupón",
          analyticsUsage: "Análisis y Uso",
          insuranceAssistance: "Asistencia de Seguros",
          quoteInsurance: "Cotización de Seguros",
          discounts: "Descuentos",
        },
      },
    },
    notification: {
      viewNotifications: "Ver notificaciones",
      notifications: "Notificaciones",
      new: "nuevas",
      seeAllNotifications: "Ver todas las notificaciones",
      items: {
        piterJoined: "¡Piter se unió al equipo!",
        congratulateHim: "Felicítalo",
        newMessage: "Nuevo mensaje",
        devidSentMessage: "Devid envió un nuevo mensaje",
        newPaymentReceived: "Nuevo pago recibido",
        checkEarnings: "Revisa tus ganancias",
        jollyCompletedTasks: "Jolly completó tareas",
        assignNewTask: "Asignar nueva tarea",
        romanJoined: "¡Roman se unió al equipo!",
      },
    },
    userInfo: {
      myAccount: "Mi Cuenta",
      userInformation: "Información del usuario",
      viewProfile: "Ver perfil",
      accountSettings: "Configuración de cuenta",
      logOut: "Cerrar sesión",
    },
    themeToggle: {
      switchToLight: "Cambiar a modo claro",
      switchToDark: "Cambiar a modo oscuro",
    },
<<<<<<< HEAD
    profilePage: {
      title: "Información general",
      description: "Complete la información general de su negocio",
      form: {
        businessName: "Nombre del negocio",
        businessNamePlaceholder: "Ingrese el nombre de su empresa",
        website: "Sitio web",
        websitePlaceholder: "https://ejemplo.com",
        address: "Dirección de la sede principal",
        addressPlaceholder: "Ingrese la dirección completa de la sede principal",
        saveButton: "Guardar información general",
      },
=======
    tourModal: {
      selectProductsTitle: "Selecciona los productos",
      selectProductsDescription: "Elige los productos que deseas incluir en el tour. Puedes seleccionar uno o varios productos.",
      selectAll: "Seleccionar todos",
      deselectAll: "Deseleccionar todos",
      cancel: "Cancelar",
      continue: "Continuar",
      welcomeTitle: "Bienvenido al Tour",
      welcomeDescription: "A continuación se mostrará un tour de los productos seleccionados que te ayudará a conocer las funcionalidades principales de la aplicación.",
      selectedProducts: "Productos seleccionados:",
      back: "Volver",
      startTour: "Comenzar Tour",
    },
    tourOverlay: {
      previous: "Anterior",
      next: "Siguiente",
      finish: "Finalizar",
      pause: "Pausar tour",
      resume: "Reanudar tour",
      step: "Paso",
      of: "de",
>>>>>>> e978d4d72b5f503b57e74dba7b9ecb82ea224a5e
    },
  },
};

export function useUiTranslations() {
  return useLanguageTranslations(UI_TRANSLATIONS);
}
