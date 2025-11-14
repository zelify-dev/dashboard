"use client";

import { useState } from "react";
import { InsuranceQuotePreviewPanel } from "./insurance-quote-preview-panel";
import { InsuranceQuoteSettingsPanel } from "./insurance-quote-settings-panel";

export function InsuranceQuoteConfig() {
  const [viewMode, setViewMode] = useState<"mobile" | "web">("mobile");

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <InsuranceQuotePreviewPanel viewMode={viewMode} onViewModeChange={setViewMode} />
      <InsuranceQuoteSettingsPanel />
    </div>
  );
}


