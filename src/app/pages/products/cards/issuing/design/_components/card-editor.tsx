"use client";

import { useState } from "react";
import { CardPreview2D } from "./card-preview-2d";
import { CardCustomizationPanel } from "./card-customization-panel";
import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../../_components/cards-translations";

export type CardColorType = "solid" | "gradient";
export type CardFinishType = "standard" | "embossed" | "metallic";

export type CardDesignConfig = {
  cardholderName: string;
  nickname: string;
  cardType: "credit" | "debit";
  cardForm: "virtual" | "physical";
  expirationDate: string;
  spendingLimit: string;
  limitInterval: "daily" | "weekly" | "monthly";
  colorType: CardColorType;
  solidColor: string;
  gradientColors: string[];
  finishType: CardFinishType;
  cardNetwork: "visa" | "mastercard";
};

type CardEditorProps = {
  onClose: () => void;
  onSave: (config: CardDesignConfig) => void;
  defaultUserName?: string;
};

export function CardEditor({ onClose, onSave, defaultUserName = "Carlos Mendoza" }: CardEditorProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].issuing.editor;
  const [config, setConfig] = useState<CardDesignConfig>({
    cardholderName: defaultUserName,
    nickname: "Personal Card",
    cardType: "credit",
    cardForm: "virtual",
    expirationDate: "2032-01-21",
    spendingLimit: "1000",
    limitInterval: "weekly",
    colorType: "gradient",
    solidColor: "#3B82F6",
    gradientColors: ["#3B82F6", "#1E40AF", "#1E3A8A"],
    finishType: "standard",
    cardNetwork: "visa",
  });


  const handleConfigChange = (updates: Partial<CardDesignConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="mt-6">
      <div className="rounded-3xl border border-stroke bg-white p-7 shadow-sm dark:border-dark-3 dark:bg-dark-2 md:p-10">
        <div className="mb-10 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold text-dark dark:text-white">
            {t.title}
          </h2>
          <button
            onClick={onClose}
            aria-label={t.cancelButton}
            className="rounded-full border border-gray-3 bg-white p-2 text-gray-6 transition hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[440px_minmax(0,1fr)]">
          <div className="order-1" data-tour-id="tour-cards-design-editor">
            <div className="rounded-2xl border border-gray-3 bg-white p-7 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <CardCustomizationPanel
                config={config}
                onConfigChange={handleConfigChange}
                onSave={handleSave}
                onCancel={onClose}
              />
            </div>
          </div>

          <div className="order-2 xl:order-2" data-tour-id="tour-cards-create-design">
            <div className="h-full w-full rounded-2xl bg-[#F3F4F6] p-8 dark:bg-dark-3">
              <div className="xl:sticky xl:top-24">
                <CardPreview2D config={config} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
