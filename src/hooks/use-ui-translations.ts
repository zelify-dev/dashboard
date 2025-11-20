"use client";

import type { Language } from "@/contexts/language-context";
import { useLanguageTranslations } from "./use-language-translations";

type UiTranslations = {
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
  },
};

export function useUiTranslations() {
  return useLanguageTranslations(UI_TRANSLATIONS);
}
