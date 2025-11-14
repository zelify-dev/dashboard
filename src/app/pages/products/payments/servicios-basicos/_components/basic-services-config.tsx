"use client";

import { useMemo, useState } from "react";
import { BasicServicesPreviewPanel, ServiceProvider, PROVIDERS_BY_REGION } from "./basic-services-preview-panel";
import { RegionConfigPanel } from "./region-config-panel";

export type ServiceRegion = "ecuador" | "mexico" | "brasil" | "colombia" | "estados_unidos";

interface BasicServicesConfigProps {
  region?: ServiceRegion;
}

export function BasicServicesConfig({ region: initialRegion = "mexico" }: BasicServicesConfigProps) {
  const [selectedRegion, setSelectedRegion] = useState<ServiceRegion>(initialRegion);
  const [viewMode, setViewMode] = useState<"mobile" | "web">("mobile");
  const [visibleProvidersByRegion, setVisibleProvidersByRegion] = useState<Record<ServiceRegion, string[]>>(() => {
    const map = {} as Record<ServiceRegion, string[]>;
    (Object.keys(PROVIDERS_BY_REGION) as ServiceRegion[]).forEach((region) => {
      const data = PROVIDERS_BY_REGION[region];
      map[region] = data === "coming_soon" ? [] : data.map((provider) => provider.id);
    });
    return map;
  });

  const handleRegionChange = (region: ServiceRegion) => {
    setSelectedRegion(region);
  };

  const handleProviderToggle = (providerId: string) => {
    setVisibleProvidersByRegion((prev) => {
      const current = prev[selectedRegion] ?? [];
      const exists = current.includes(providerId);
      const updated = exists ? current.filter((id) => id !== providerId) : [...current, providerId];
      return { ...prev, [selectedRegion]: updated };
    });
  };

  const availableProviders = useMemo<ServiceProvider[]>(() => {
    const data = PROVIDERS_BY_REGION[selectedRegion];
    return data === "coming_soon" ? [] : data;
  }, [selectedRegion]);

  const visibleProviders = visibleProvidersByRegion[selectedRegion] ?? [];

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BasicServicesPreviewPanel 
        region={selectedRegion} 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        visibleProviderIds={visibleProviders}
      />
      <RegionConfigPanel 
        selectedRegion={selectedRegion} 
        onRegionChange={handleRegionChange}
        availableProviders={availableProviders}
        selectedProviders={visibleProviders}
        onProviderToggle={handleProviderToggle}
      />
    </div>
  );
}
