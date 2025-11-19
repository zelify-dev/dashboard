"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const LANGUAGES = [
  {
    name: "en",
    label: "En",
  },
  {
    name: "es",
    label: "Es",
  },
];

export function LanguageToggleSwitch() {
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "es" : "en")}
      className="group rounded-full bg-gray-3 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Cambiar idioma a {language === "en" ? "Español" : "English"}
      </span>

      <span aria-hidden className="relative flex gap-2.5">
        {/* Indicator */}
        <span
          className={cn(
            "absolute size-[38px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
            language === "es" && "translate-x-[48px]"
          )}
        />

        {LANGUAGES.map(({ name, label }) => (
          <span
            key={name}
            className={cn(
              "relative grid size-[38px] place-items-center rounded-full text-sm font-medium",
              name === "es" && "dark:text-white"
            )}
          >
            {label}
          </span>
        ))}
      </span>
    </button>
  );
}

