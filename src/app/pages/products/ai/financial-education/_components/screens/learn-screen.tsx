"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FinancialEducationConfig } from "../financial-education-config";
import { MetricRing } from "../ui/metric-ring";
import { Card } from "../ui/card";
import zelifyLogoDark from "@/assets/logos/zelifyLogo_dark.svg";
import zelifyLogoLight from "@/assets/logos/zelifyLogo_ligth.svg";
import { useLanguageTranslations } from "@/hooks/use-language-translations";
import { type Language } from "@/contexts/language-context";

interface LearnScreenProps {
  config: FinancialEducationConfig;
  updateConfig: (updates: Partial<FinancialEducationConfig>) => void;
}

type LearnTranslations = {
  back: string;
  increasing: string;
  spending: string;
  savings: string;
  weeklySummary: string;
  tipsForYou: string;
};

const translations: Record<Language, LearnTranslations> = {
  en: {
    back: "back",
    increasing: "increasing",
    spending: "spending",
    savings: "savings",
    weeklySummary: "Your weekly summary",
    tipsForYou: "Our tips for you",
  },
  es: {
    back: "atrás",
    increasing: "aumentando",
    spending: "gastos",
    savings: "ahorros",
    weeklySummary: "Tu resumen semanal",
    tipsForYou: "Nuestros consejos para ti",
  },
};

export function LearnScreen({ config, updateConfig }: LearnScreenProps) {
  const t = useLanguageTranslations(translations);
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
        <div className="mb-6 flex justify-center">
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
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
        {/* Performance Metrics */}
        <div className="flex justify-around">
          <MetricRing
            percent={config.increasingPercent}
            label={t.increasing}
            color="#10B981"
          />
          <MetricRing
            percent={config.spendingPercent}
            label={t.spending}
            color="#004492"
          />
          <MetricRing
            percent={config.savingsPercent}
            label={t.savings}
            color="#F59E0B"
          />
        </div>

        {/* Weekly Summary */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{t.weeklySummary}</h3>
          <Card>
            <p className="text-sm text-gray-700 dark:text-gray-300">{config.weeklySummary}</p>
          </Card>
        </div>

        {/* Tips Section */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{t.tipsForYou}</h3>
          <div className="grid grid-cols-2 gap-3">
            {config.tips.map((tip) => (
              <Card
                key={tip.id}
                className="cursor-pointer overflow-hidden p-0"
                onClick={() => {
                  updateConfig({ currentScreen: "learn-content", selectedTip: tip.id });
                }}
              >
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{tip.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
