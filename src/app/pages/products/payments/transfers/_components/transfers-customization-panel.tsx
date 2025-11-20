"use client";

import { useMemo, useState } from "react";
import { useTransfersTranslations } from "./use-transfers-translations";

type AccountTypeId = "operational" | "individual";

const ACCOUNT_TYPES: Array<{
  id: AccountTypeId;
  name: string;
  description: string;
}> = [
  { id: "operational", name: "Cuenta operativa", description: "Pagos del día a día con monitoreo automatizado." },
  { id: "individual", name: "Cuenta individual", description: "Usuarios con acceso limitado y controles básicos." },
];

const DEFAULT_LIMITS: Record<AccountTypeId, { daily: number; perTransaction: number }> = {
  operational: { daily: 220000, perTransaction: 55000 },
  individual: { daily: 50000, perTransaction: 8000 },
};

export function TransfersCustomizationPanel() {
  const translations = useTransfersTranslations();
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeId>("operational");
  const [limits, setLimits] = useState(DEFAULT_LIMITS);
  const [enforceDualApproval, setEnforceDualApproval] = useState(true);
  const [autoBlockSuspicious, setAutoBlockSuspicious] = useState(true);

  const selectedAccount = useMemo(
    () => ACCOUNT_TYPES.find((account) => account.id === selectedAccountType) ?? ACCOUNT_TYPES[0],
    [selectedAccountType]
  );

  const handleLimitChange = (field: "daily" | "perTransaction", value: number) => {
    setLimits((prev) => ({
      ...prev,
      [selectedAccountType]: {
        ...prev[selectedAccountType],
        [field]: Number.isNaN(value) ? 0 : value,
      },
    }));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">{translations.customization.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{translations.customization.description}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{translations.customization.txGuardLabel}</span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {ACCOUNT_TYPES.map((account) => {
            const isActive = account.id === selectedAccountType;
            const accountLabel = translations.customization.accountTypes[account.id];
            return (
              <button
                key={account.id}
                onClick={() => setSelectedAccountType(account.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "border-primary bg-primary/10 text-primary" : "border-stroke text-dark hover:border-primary/50 dark:border-dark-3 dark:text-white"
                }`}
              >
                {accountLabel.name}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-dark-5 dark:text-dark-6">{translations.customization.accountTypes[selectedAccountType].description}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-dark-5 dark:text-white/50">{translations.customization.dailyLimitLabel}</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-stroke bg-white px-3 py-2 dark:border-dark-3 dark:bg-dark-1">
              <span className="text-xs text-dark-6 dark:text-white/60">MXN</span>
              <input
                type="number"
                className="w-full bg-transparent text-base font-semibold text-dark focus:outline-none dark:text-white"
                value={limits[selectedAccountType].daily}
                onChange={(event) => handleLimitChange("daily", Number(event.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-dark-5 dark:text-white/50">{translations.customization.perTransactionLabel}</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-stroke bg-white px-3 py-2 dark:border-dark-3 dark:bg-dark-1">
              <span className="text-xs text-dark-6 dark:text-white/60">MXN</span>
              <input
                type="number"
                className="w-full bg-transparent text-base font-semibold text-dark focus:outline-none dark:text-white"
                value={limits[selectedAccountType].perTransaction}
                onChange={(event) => handleLimitChange("perTransaction", Number(event.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-dashed border-stroke p-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-dark dark:text-white">{translations.customization.dualApproval.title}</p>
              <p className="text-xs text-dark-6 dark:text-white/60">{translations.customization.dualApproval.desc}</p>
            </div>
            <button
              onClick={() => setEnforceDualApproval((prev) => !prev)}
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                enforceDualApproval ? "bg-primary/90 text-white" : "border border-stroke text-dark dark:border-dark-3 dark:text-white"
              }`}
            >
              {enforceDualApproval ? translations.customization.dualApproval.active : translations.customization.dualApproval.inactive}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-dark dark:text-white">{translations.customization.autoBlock.title}</p>
              <p className="text-xs text-dark-6 dark:text-white/60">{translations.customization.autoBlock.desc}</p>
            </div>
            <button
              onClick={() => setAutoBlockSuspicious((prev) => !prev)}
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                autoBlockSuspicious ? "bg-primary/90 text-white" : "border border-stroke text-dark dark:border-dark-3 dark:text-white"
              }`}
            >
              {autoBlockSuspicious ? translations.customization.autoBlock.active : translations.customization.autoBlock.inactive}
            </button>
          </div>
        </div>

        <button className="w-full rounded-2xl bg-dark text-sm font-semibold text-white transition hover:bg-dark/80 dark:bg-white dark:text-dark">
          {translations.customization.saveButton}
        </button>
      </div>
    </div>
  );
}
