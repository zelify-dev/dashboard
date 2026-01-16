"use client";

import { useState } from "react";
import { ServiceRegion } from "../../servicios-basicos/_components/basic-services-config";
import { TransfersPreviewPanel } from "./transfers-preview-panel";
import { TransfersRegionPanel } from "./transfers-region-panel";
import { TransfersCustomizationPanel } from "./transfers-customization-panel";

export interface TransfersBranding {
  light: { logo?: string | null; customColor?: string };
  dark: { logo?: string | null; customColor?: string };
}

export function TransfersConfig({ region: initialRegion = "mexico" }: { region?: ServiceRegion }) {
  const [selectedRegion, setSelectedRegion] = useState<ServiceRegion>(initialRegion);
  const [branding, setBranding] = useState<TransfersBranding>({
    light: { logo: null, customColor: "#004492" },
    dark: { logo: null, customColor: "#004492" },
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div data-tour-id="tour-transfers-preview">
        <TransfersPreviewPanel region={selectedRegion} branding={branding} />
      </div>
      <div className="space-y-6">
        <TransfersCustomizationPanel branding={branding} onBrandingChange={setBranding} />
        <div data-tour-id="tour-transfers-region-panel">
          <TransfersRegionPanel selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
        </div>
      </div>
    </div>
  );
}
