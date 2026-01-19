"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FinancialEducationConfig } from "../financial-education-config";
import { BottomActionButton } from "../ui/bottom-action-button";
import zelifyLogoDark from "@/assets/logos/zelifyLogo_dark.svg";
import zelifyLogoLight from "@/assets/logos/zelifyLogo_ligth.svg";
import { useLanguageTranslations } from "@/hooks/use-language-translations";
import { type Language } from "@/contexts/language-context";

interface GraphScreenProps {
  config: FinancialEducationConfig;
  updateConfig: (updates: Partial<FinancialEducationConfig>) => void;
}

type GraphTranslations = {
  back: string;
  today: string;
  filters: {
    all: string;
    increasing: string;
    spending: string;
    savings: string;
  };
  discoverMore: string;
};

const translations: Record<Language, GraphTranslations> = {
  en: {
    back: "back",
    today: "Today",
    filters: {
      all: "All",
      increasing: "Increasing",
      spending: "Spending",
      savings: "Savings",
    },
    discoverMore: "Discover More",
  },
  es: {
    back: "atrás",
    today: "Hoy",
    filters: {
      all: "Todo",
      increasing: "Aumentando",
      spending: "Gastos",
      savings: "Ahorros",
    },
    discoverMore: "Descubrir Más",
  },
};

export function GraphScreen({ config, updateConfig }: GraphScreenProps) {
  const t = useLanguageTranslations(translations);
  const timeframes = ["24H", "1W", "1M", "3M", "6M", "1Y", "All"];
  const [selectedTimeframe, setSelectedTimeframe] = useState("1W");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-black">
      <div className="flex-shrink-0 px-6 pt-4">
        <button
          onClick={() => updateConfig({ currentScreen: "summary" })}
          className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400"
        >
          &lt; {t.back}
        </button>
        <div className="mb-4 flex justify-center">
          <div className="relative h-6 w-24">
            <Image
              src={zelifyLogoLight}
              fill
              className="dark:hidden"
              alt="Zelify logo"
              role="presentation"
              quality={100}
            />
            <Image
              src={zelifyLogoDark}
              fill
              className="hidden dark:block"
              alt="Zelify logo"
              role="presentation"
              quality={100}
            />
          </div>
        </div>
        <div className="mb-4 flex items-center justify-center gap-2">
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white">
            {t.today} 01-09-26
          </button>
        </div>
        <div className="mb-4 flex justify-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500"></div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500"></div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-500"></div>
        </div>
        <div className="mb-4 flex gap-2">
          {[
            { key: "all", label: t.filters.all },
            { key: "increasing", label: t.filters.increasing },
            { key: "spending", label: t.filters.spending },
            { key: "savings", label: t.filters.savings },
          ].map((filter) => (
            <button
              key={filter.key}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filter.key === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {/* Graph Area */}
        <div className="h-64 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="flex h-full items-end justify-between gap-1 p-4">
            {[65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 70, 60].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t"
                style={{
                  height: `${height}%`,
                  backgroundColor: index % 3 === 0 ? "#10B981" : index % 3 === 1 ? "#004492" : "#F59E0B",
                }}
              />
            ))}
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="mt-4 flex justify-center gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                selectedTimeframe === timeframe
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-black">
        <BottomActionButton label={t.discoverMore} onClick={() => {}} />
      </div>
    </div>
  );
}
