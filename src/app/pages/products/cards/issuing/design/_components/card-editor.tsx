"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardPreview3D } from "./card-preview-3d";
import { CardCustomizationPanel } from "./card-customization-panel";
import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../../_components/cards-translations";

export type CardColorType = "solid" | "gradient";
export type CardFinishType = "standard" | "embossed" | "metallic";

export type CardDesignConfig = {
  cardholderName: string;
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

export function CardEditor({ onClose, onSave, defaultUserName = "Alejandro Llanganate" }: CardEditorProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].issuing.editor;
  const [config, setConfig] = useState<CardDesignConfig>({
    cardholderName: defaultUserName,
    colorType: "gradient",
    solidColor: "#3B82F6",
    gradientColors: ["#3B82F6", "#1E40AF", "#1E3A8A"],
    finishType: "standard",
    cardNetwork: "visa",
  });

  const [isRotated, setIsRotated] = useState(false);
  const [designName, setDesignName] = useState("");

  const handleConfigChange = (updates: Partial<CardDesignConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.back}
        </button>
        
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="w-full border-0 border-b-2 border-stroke bg-transparent px-2 py-3 text-base font-medium text-dark placeholder:text-dark-6 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:placeholder:text-dark-6 dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Preview Section */}
        <div className="order-2 lg:order-1" data-tour-id="tour-cards-preview">
          <div className="sticky top-6 flex min-h-[600px] items-center justify-center rounded-lg border border-stroke bg-white p-8 dark:border-dark-3 dark:bg-dark-2">
            <CardPreview3D config={config} isRotated={isRotated} onRotate={() => setIsRotated(!isRotated)} />
          </div>
        </div>

        {/* Customization Panel */}
        <div className="order-1 lg:order-2" data-tour-id="tour-cards-design-editor">
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <CardCustomizationPanel
              config={config}
              onConfigChange={handleConfigChange}
              onSave={handleSave}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

