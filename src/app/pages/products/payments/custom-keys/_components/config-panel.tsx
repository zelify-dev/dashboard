"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CustomKeysConfig, CustomKeyType } from "./custom-keys-config";
import { useCustomKeysTranslations } from "./use-custom-keys-translations";

interface ConfigPanelProps {
  config: CustomKeysConfig;
  updateConfig: (updates: Partial<CustomKeysConfig>) => void;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        enabled ? "bg-primary" : "bg-gray-300 dark:bg-dark-3"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
  const translations = useCustomKeysTranslations();
  const [openSection, setOpenSection] = useState<"customKeys" | null>("customKeys");

  const getKeyTypeLabel = (type: CustomKeyType): string => {
    return translations.preview.keyTypes[type] || type;
  };

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">{translations.config.title}</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">{translations.config.description}</p>
      </div>

      <div className="space-y-0">
        {/* Custom Keys Configuration */}
        <div className="rounded-lg border-t border-stroke dark:border-dark-3">
          <button
            onClick={() => setOpenSection(openSection === "customKeys" ? null : "customKeys")}
            className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            <h3 className="text-lg font-semibold text-dark dark:text-white">{translations.config.customKeysTitle}</h3>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                openSection === "customKeys" && "rotate-180"
              )}
            />
          </button>
          {openSection === "customKeys" && (
            <div className="border-t border-stroke px-6 py-4 space-y-6 dark:border-dark-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  {translations.config.availableTypesLabel}
                </label>
                <div className="space-y-2">
                  {(["cedula", "telefono", "correo"] as CustomKeyType[]).map((keyType) => (
                    <label key={keyType} className="flex items-center justify-between rounded-lg border border-stroke p-3 dark:border-dark-3">
                      <span className="text-sm text-dark dark:text-white">{getKeyTypeLabel(keyType)}</span>
                      <input
                        type="checkbox"
                        checked={config.availableKeyTypes.includes(keyType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newTypes = [...config.availableKeyTypes, keyType];
                            updateConfig({ availableKeyTypes: newTypes });
                          } else {
                            const newTypes = config.availableKeyTypes.filter(t => t !== keyType);
                            // Si se deshabilita el tipo actual, cambiar al primero disponible
                            if (newTypes.length > 0 && config.currentKeyType === keyType) {
                              updateConfig({ 
                                availableKeyTypes: newTypes,
                                currentKeyType: newTypes[0]
                              });
                            } else {
                              updateConfig({ availableKeyTypes: newTypes });
                            }
                          }
                        }}
                        disabled={config.availableKeyTypes.length === 1 && config.availableKeyTypes.includes(keyType)}
                        className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3"
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">
                  {translations.config.availableTypesDescription}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

