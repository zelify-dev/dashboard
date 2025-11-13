"use client";

import { useState } from "react";
import { BankAccountPreviewPanel } from "./bank-account-preview-panel";
import { CountryConfigPanel } from "./country-config-panel";

export type BankAccountCountry = "ecuador" | "mexico" | "brasil" | "colombia" | "estados_unidos";

interface BankAccountConfigProps {
  country?: BankAccountCountry;
}

export function BankAccountConfig({ country: initialCountry = "mexico" }: BankAccountConfigProps) {
  const [selectedCountry, setSelectedCountry] = useState<BankAccountCountry>(initialCountry);
  const [viewMode, setViewMode] = useState<"mobile" | "web">("mobile");
  const [isBankSelected, setIsBankSelected] = useState(false);

  const handleCountryChange = (country: BankAccountCountry) => {
    setSelectedCountry(country);
    setIsBankSelected(false);
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BankAccountPreviewPanel 
        country={selectedCountry} 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBankSelected={setIsBankSelected}
      />
      {!isBankSelected && (
        <CountryConfigPanel 
          selectedCountry={selectedCountry} 
          onCountryChange={handleCountryChange}
        />
      )}
    </div>
  );
}

