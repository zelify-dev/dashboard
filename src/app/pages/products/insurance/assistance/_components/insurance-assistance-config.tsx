"use client";

import { useState } from "react";
import { InsuranceAssistancePreviewPanel } from "./insurance-assistance-preview-panel";
import { InsuranceAssistanceSettingsPanel } from "./insurance-assistance-settings-panel";

export function InsuranceAssistanceConfig() {
  const [viewMode, setViewMode] = useState<"mobile" | "web">("mobile");

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <InsuranceAssistancePreviewPanel viewMode={viewMode} onViewModeChange={setViewMode} />
      <InsuranceAssistanceSettingsPanel />
    </div>
  );
}


