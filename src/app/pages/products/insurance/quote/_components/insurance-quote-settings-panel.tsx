"use client";

import { useInsuranceQuoteTranslations } from "./use-insurance-quote-translations";

export function InsuranceQuoteSettingsPanel() {
  const translations = useInsuranceQuoteTranslations();

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark dark:text-white">{translations.settings.title}</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">
          {translations.settings.description}
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            {translations.settings.defaultCurrency}
          </label>
          <select className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            <option>USD</option>
            <option>MXN</option>
            <option>BRL</option>
            <option>COP</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            {translations.settings.ageMultiplier}
          </label>
          <input
            type="number"
            defaultValue="1.3"
            step="0.1"
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            {translations.settings.premiumCoverageMultiplier}
          </label>
          <input
            type="number"
            defaultValue="1.5"
            step="0.1"
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}


