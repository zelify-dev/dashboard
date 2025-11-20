"use client";

import { CardDesignConfig, CardColorType, CardFinishType } from "./card-editor";
import { cn } from "@/lib/utils";

type CardCustomizationPanelProps = {
  config: CardDesignConfig;
  onConfigChange: (updates: Partial<CardDesignConfig>) => void;
  onSave: () => void;
  onCancel: () => void;
};

import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../../_components/cards-translations";

export function CardCustomizationPanel({
  config,
  onConfigChange,
  onSave,
  onCancel,
}: CardCustomizationPanelProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].issuing.editor;
  const handleColorTypeChange = (type: CardColorType) => {
    onConfigChange({ colorType: type });
  };

  const handleSolidColorChange = (color: string) => {
    onConfigChange({ solidColor: color });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    const newColors = [...config.gradientColors];
    newColors[index] = color;
    onConfigChange({ gradientColors: newColors });
  };

  const handleFinishTypeChange = (type: CardFinishType) => {
    onConfigChange({ finishType: type });
  };

  const handleCardNetworkChange = (network: "visa" | "mastercard") => {
    onConfigChange({ cardNetwork: network });
  };

  return (
    <div className="space-y-6">
      {/* Cardholder Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">{t.cardholderNameLabel}</label>
        <input
          type="text"
          value={config.cardholderName}
          onChange={(e) => onConfigChange({ cardholderName: e.target.value.toUpperCase() })}
          className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-sm text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          placeholder={t.cardholderNameLabel}
        />
      </div>

      {/* Card Network */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">{t.cardNetworkLabel}</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleCardNetworkChange("visa")}
            className={cn(
              "flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition",
              config.cardNetwork === "visa"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            Visa
          </button>
          <button
            onClick={() => handleCardNetworkChange("mastercard")}
            className={cn(
              "flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition",
              config.cardNetwork === "mastercard"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            Mastercard
          </button>
        </div>
      </div>

      {/* Color Type */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">{t.colorTypeLabel}</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleColorTypeChange("solid")}
            className={cn(
              "flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition",
              config.colorType === "solid"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            {t.solidLabel}
          </button>
          <button
            onClick={() => handleColorTypeChange("gradient")}
            className={cn(
              "flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition",
              config.colorType === "gradient"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            {t.gradientLabel}
          </button>
        </div>
      </div>

      {/* Solid Color Picker */}
      {config.colorType === "solid" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">{t.solidLabel}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.solidColor}
              onChange={(e) => handleSolidColorChange(e.target.value)}
              className="h-12 w-20 cursor-pointer rounded-lg border border-stroke dark:border-dark-3"
            />
            <input
              type="text"
              value={config.solidColor}
              onChange={(e) => handleSolidColorChange(e.target.value)}
              className="flex-1 rounded-lg border border-stroke bg-white px-4 py-2 text-sm text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              placeholder="#3B82F6"
            />
          </div>
        </div>
      )}

      {/* Gradient Colors */}
      {config.colorType === "gradient" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">{t.gradientColorsLabel}</label>
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.gradientColors[index] || "#3B82F6"}
                  onChange={(e) => handleGradientColorChange(index, e.target.value)}
                  className="h-12 w-20 cursor-pointer rounded-lg border border-stroke dark:border-dark-3"
                />
                <input
                  type="text"
                  value={config.gradientColors[index] || ""}
                  onChange={(e) => handleGradientColorChange(index, e.target.value)}
                  className="flex-1 rounded-lg border border-stroke bg-white px-4 py-2 text-sm text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  placeholder={`Color ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finish Type */}
      <div>
          <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">{t.finishLabel}</label>
        <div className="space-y-2">
          <button
            onClick={() => handleFinishTypeChange("standard")}
            className={cn(
              "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition",
              config.finishType === "standard"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            {t.finishStandard}
          </button>
          <button
            onClick={() => handleFinishTypeChange("embossed")}
            className={cn(
              "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition",
              config.finishType === "embossed"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            {t.finishEmbossed}
          </button>
          <button
            onClick={() => handleFinishTypeChange("metallic")}
            className={cn(
              "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition",
              config.finishType === "metallic"
                ? "border-primary bg-primary/10 text-primary"
                : "border-stroke bg-white text-dark hover:border-primary/50 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            )}
            >
            {t.finishMetallic}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4"
        >
          {t.cancelButton}
        </button>
        <button
          onClick={onSave}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          {t.saveButton}
        </button>
      </div>
    </div>
  );
}



