"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "@/hooks/use-language-translations";
import type { RegistrationFieldId } from "./authentication-config";

type AuthTranslations = {
  breadcrumb: string;
  preview: {
    loginTitle: string;
    providerAction: string;
    or: string;
    phoneLabel: string;
    phonePlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    signInButton: string;
    registerTitle: string;
    registerButton: string;
    enterPrefix: string;
    mobilePreviewTitle: string;
    webPreviewTitle: string;
    mobileLabel: string;
    webLabel: string;
    switchToMobileView: string;
    switchToWebView: string;
  };
  config: {
    serviceTypeTitle: string;
    switchToLogin: string;
    switchToRegister: string;
    login: string;
    register: string;
    loginMethodTitle: string;
    registrationFieldsTitle: string;
    loginMethods: {
      phone: string;
      username: string;
      email: string;
      oauth: string;
    };
    oauthProvidersTitle: string;
    registerFieldsDescription: string;
    required: string;
    customBrandingTitle: string;
    themeLabel: string;
    lightMode: string;
    darkMode: string;
    modeName: {
      light: string;
      dark: string;
    };
    logoLabel: string;
    changeLogo: string;
    uploadLogo: string;
    logoHint: string;
    colorPalette: string;
    buttonBackground: string;
    buttonLabel: string;
    labelColor: string;
  };
  registrationFields: Record<RegistrationFieldId, string>;
};

const AUTH_TRANSLATIONS: Record<Language, AuthTranslations> = {
  en: {
    breadcrumb: "Authentication",
    preview: {
      loginTitle: "Sign In",
      providerAction: "Continue with",
      or: "or",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+1 234 567 8900",
      usernameLabel: "Username",
      usernamePlaceholder: "username",
      emailLabel: "Email",
      emailPlaceholder: "email@example.com",
      passwordLabel: "Password",
      signInButton: "Sign In",
      registerTitle: "Create Account",
      registerButton: "Create Account",
      enterPrefix: "Enter",
      mobilePreviewTitle: "Mobile Preview",
      webPreviewTitle: "Web Preview",
      mobileLabel: "Mobile",
      webLabel: "Web",
      switchToMobileView: "Switch to mobile view",
      switchToWebView: "Switch to web view",
    },
    config: {
      serviceTypeTitle: "Service Type",
      switchToLogin: "Switch to login service",
      switchToRegister: "Switch to register service",
      login: "Login",
      register: "Register",
      loginMethodTitle: "Login Method",
      registrationFieldsTitle: "Registration Fields",
      loginMethods: {
        phone: "Phone Number",
        username: "Username",
        email: "Email & Password",
        oauth: "OAuth (Social Login)",
      },
      oauthProvidersTitle: "OAuth Providers",
      registerFieldsDescription: "Customize the fields that appear in the registration form",
      required: "Required",
      customBrandingTitle: "Custom Branding",
      themeLabel: "Theme",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      modeName: {
        light: "Light",
        dark: "Dark",
      },
      logoLabel: "Logo ({mode} Mode)",
      changeLogo: "Change Logo",
      uploadLogo: "Upload Logo",
      logoHint: "Drag and drop an image (PNG, SVG) here, or paste from the clipboard",
      colorPalette: "Color Palette ({mode} Mode)",
      buttonBackground: "Button Background Color",
      buttonLabel: "Button Label Color",
      labelColor: "Label Color",
    },
    registrationFields: {
      fullName: "Full Name",
      phone: "Mobile Phone",
      address: "Address",
      email: "Email",
      idNumber: "ID Number",
      birthDate: "Date of Birth",
    },
  },
  es: {
    breadcrumb: "Autenticación",
    preview: {
      loginTitle: "Iniciar sesión",
      providerAction: "Continuar con",
      or: "o",
      phoneLabel: "Número de teléfono",
      phonePlaceholder: "+1 234 567 8900",
      usernameLabel: "Nombre de usuario",
      usernamePlaceholder: "usuario",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "correo@ejemplo.com",
      passwordLabel: "Contraseña",
      signInButton: "Iniciar sesión",
      registerTitle: "Crear cuenta",
      registerButton: "Crear cuenta",
      enterPrefix: "Ingresa",
      mobilePreviewTitle: "Vista previa móvil",
      webPreviewTitle: "Vista previa web",
      mobileLabel: "Móvil",
      webLabel: "Web",
      switchToMobileView: "Cambiar a la vista móvil",
      switchToWebView: "Cambiar a la vista web",
    },
    config: {
      serviceTypeTitle: "Tipo de servicio",
      switchToLogin: "Cambiar al servicio de ingreso",
      switchToRegister: "Cambiar al servicio de registro",
      login: "Ingreso",
      register: "Registro",
      loginMethodTitle: "Método de ingreso",
      registrationFieldsTitle: "Campos de registro",
      loginMethods: {
        phone: "Número de teléfono",
        username: "Nombre de usuario",
        email: "Correo y contraseña",
        oauth: "OAuth (Inicio de sesión social)",
      },
      oauthProvidersTitle: "Proveedores OAuth",
      registerFieldsDescription: "Personaliza los campos que aparecen en el formulario de registro",
      required: "Obligatorio",
      customBrandingTitle: "Personalización de marca",
      themeLabel: "Tema",
      lightMode: "Modo claro",
      darkMode: "Modo oscuro",
      modeName: {
        light: "claro",
        dark: "oscuro",
      },
      logoLabel: "Logo (Modo {mode})",
      changeLogo: "Cambiar logo",
      uploadLogo: "Subir logo",
      logoHint: "Arrastra y suelta una imagen (PNG, SVG) aquí, o pega desde el portapapeles",
      colorPalette: "Paleta de colores (Modo {mode})",
      buttonBackground: "Color de fondo del botón",
      buttonLabel: "Color del texto del botón",
      labelColor: "Color de las etiquetas",
    },
    registrationFields: {
      fullName: "Nombre completo",
      phone: "Teléfono móvil",
      address: "Dirección",
      email: "Correo electrónico",
      idNumber: "Número de identificación",
      birthDate: "Fecha de nacimiento",
    },
  },
};

export function useAuthTranslations() {
  return useLanguageTranslations(AUTH_TRANSLATIONS);
}
