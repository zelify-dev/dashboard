"use client";

import { QRConfig } from "./qr-config";

interface ConfigPanelProps {
  config: QRConfig;
  updateConfig: (updates: Partial<QRConfig>) => void;
}

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">Configuration</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">Configure QR settings</p>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-lg border border-stroke bg-gray-50 p-8 text-center dark:border-dark-3 dark:bg-dark-3">
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Las opciones de configuración estarán disponibles próximamente
          </p>
        </div>
      </div>
    </div>
  );
}

