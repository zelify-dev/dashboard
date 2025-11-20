"use client";

import { useInsuranceAssistanceTranslations } from "./use-insurance-assistance-translations";

export function InsuranceAssistanceSettingsPanel() {
  const translations = useInsuranceAssistanceTranslations();

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
            {translations.settings.supportHours}
          </label>
          <select className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            <option>{translations.settings.supportHoursOptions.always}</option>
            <option>{translations.settings.supportHoursOptions.business}</option>
            <option>{translations.settings.supportHoursOptions.custom}</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            {translations.settings.responseTime}
          </label>
          <input
            type="text"
            defaultValue={translations.preview.details.responseTimeValue}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2">
            <input type="checkbox" className="rounded border-stroke text-primary focus:ring-primary" defaultChecked />
            <span className="text-sm font-medium text-dark dark:text-white">{translations.settings.enableLiveChat}</span>
          </label>
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2">
            <input type="checkbox" className="rounded border-stroke text-primary focus:ring-primary" defaultChecked />
            <span className="text-sm font-medium text-dark dark:text-white">{translations.settings.enablePhoneSupport}</span>
          </label>
        </div>
      </div>
    </div>
  );
}


