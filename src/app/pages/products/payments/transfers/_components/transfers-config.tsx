"use client";

import { useState } from "react";
import { ServiceRegion } from "../../servicios-basicos/_components/basic-services-config";
import { TransfersPreviewPanel } from "./transfers-preview-panel";
import { TransfersRegionPanel } from "./transfers-region-panel";
import { TransfersCustomizationPanel } from "./transfers-customization-panel";

export function TransfersConfig({ region: initialRegion = "mexico" }: { region?: ServiceRegion }) {
  const [selectedRegion, setSelectedRegion] = useState<ServiceRegion>(initialRegion);

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div data-tour-id="tour-transfers-preview">
        <TransfersPreviewPanel region={selectedRegion} />
      </div>
      <div className="space-y-6">
        <div data-tour-id="tour-transfers-region-panel">
          <TransfersRegionPanel selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
        </div>
        <TransfersCustomizationPanel />
      </div>
    </div>
  );
}
