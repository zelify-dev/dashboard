"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { BasicServicesPreviewPanel, PROVIDERS_BY_REGION, ServiceProvider } from "./basic-services-preview-panel";
import { RegionConfigPanel } from "./region-config-panel";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

export type ServiceRegion = "ecuador" | "mexico" | "brasil" | "colombia" | "estados_unidos";

interface BasicServicesConfig {
  logo?: string | null;
  customColorTheme: string;
}

interface BasicServicesConfigProps {
  region?: ServiceRegion;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

export function BasicServicesConfig({ region: initialRegion = "mexico" }: BasicServicesConfigProps) {
  const [selectedRegion, setSelectedRegion] = useState<ServiceRegion>(initialRegion);
  const [visibleProvidersByRegion, setVisibleProvidersByRegion] = useState<Record<ServiceRegion, string[]>>(() => {
    const map = {} as Record<ServiceRegion, string[]>;
    (Object.keys(PROVIDERS_BY_REGION) as ServiceRegion[]).forEach((region) => {
      const data = PROVIDERS_BY_REGION[region];
      map[region] = data === "coming_soon" ? [] : data.map((provider) => provider.id);
    });
    return map;
  });
  const [config, setConfig] = useState<BasicServicesConfig>({
    logo: null,
    customColorTheme: "#004492",
  });
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  type OpenSection = "config" | "personalization";
  const [openSection, setOpenSection] = useState<OpenSection>("config");

  // Cerrar color picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const isColorButton = target.closest('button[data-color-picker-trigger="true"]');
        if (!isColorButton) {
          setOpenColorPicker(false);
        }
      }
    };

    if (openColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openColorPicker]);

  // Optimización de imágenes
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No contexts'));
            return;
          }

          const maxDimension = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          try {
            resolve(canvas.toDataURL(file.type || 'image/png', 0.85));
          } catch (error) {
            resolve(canvas.toDataURL('image/png', 0.85));
          }
        };
        img.onerror = () => reject(new Error('Error loading image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/svg'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.toLowerCase().endsWith('.svg')) {
      alert("Tipo de archivo inválido. Por favor usa PNG, JPG, WEBP o SVG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Archivo muy grande. Máximo 5MB.");
      return;
    }

    try {
      const optimized = await optimizeImage(file);
      setConfig((prev) => ({ ...prev, logo: optimized }));
    } catch (error) {
      console.error("Error processing image", error);
      alert("Error al procesar la imagen");
    }
  };

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
        config={config}
        visibleProviderIds={visibleProviders}
      />
      
      {/* Configuration Panel */}
      <div className="space-y-6" data-tour-id="tour-payments-basic-services">
        {/* Configuración Section */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
          <button
            onClick={() => setOpenSection("config")}
            className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Configuración
            </h3>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                openSection === "config" && "rotate-180"
              )}
            />
          </button>

          {openSection === "config" && (
            <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
              <RegionConfigPanel
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
                availableProviders={availableProviders}
                selectedProviders={visibleProviders}
                onProviderToggle={handleProviderToggle}
              />
            </div>
          )}
        </div>

        {/* Personalización Section */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
          <button
            onClick={() => setOpenSection("personalization")}
            className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Personalización
            </h3>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                openSection === "personalization" && "rotate-180"
              )}
            />
          </button>

          {openSection === "personalization" && (
            <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-3">
              <label className="block text-sm font-medium text-dark dark:text-white">
                Logo
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-stroke hover:border-primary/50 hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-3"
                )}
              >
                {config.logo ? (
                  <div className="group relative w-full flex justify-center">
                    <img
                      src={config.logo}
                      alt="Logo Preview"
                      className="max-h-16 object-contain"
                    />
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, logo: null }))}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 1L1 11M1 1l10 10" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-dark-6 dark:text-dark-6">
                      Arrastra tu logo aquí o{" "}
                      <label className="cursor-pointer text-primary hover:underline">
                        selecciona un archivo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        />
                      </label>
                    </p>
                    <p className="mt-1 text-xs text-dark-6 opacity-60 dark:text-dark-6">
                      PNG, JPG, SVG (Max. 5MB)
                    </p>
                  </div>
                )}
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-3">
              <label className="block text-sm font-medium text-dark dark:text-white">
                Color del Tema
              </label>
              <div className="relative">
                <button
                  type="button"
                  data-color-picker-trigger="true"
                  onClick={() => setOpenColorPicker(!openColorPicker)}
                  className="flex w-full items-center gap-3 rounded-lg border border-stroke bg-white p-2 text-left transition hover:border-primary dark:border-dark-3 dark:bg-dark-2"
                >
                  <div
                    className="h-6 w-6 rounded border border-stroke shadow-sm dark:border-dark-3"
                    style={{ backgroundColor: config.customColorTheme }}
                  />
                  <span className="text-sm text-dark dark:text-white">
                    {config.customColorTheme.toUpperCase()}
                  </span>
                </button>

                {openColorPicker && (
                  <div
                    ref={colorPickerRef}
                    className="absolute left-0 top-full z-50 mt-2 rounded-lg border border-stroke bg-white p-3 shadow-xl dark:border-dark-3 dark:bg-dark-2"
                  >
                    <HexColorPicker
                      color={config.customColorTheme}
                      onChange={(color) => setConfig((prev) => ({ ...prev, customColorTheme: color }))}
                    />
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {[
                        "#004492", // Brand Blue
                        "#0FADCF", // Cyan
                        "#10B981", // Emerald
                        "#F0950C", // Orange
                        "#E11D48", // Rose
                        "#8B5CF6", // Violet
                        "#FF5722", // Deep Orange
                        "#212121", // Dark Gray
                        "#607D8B", // Blue Gray
                        "#000000", // Black
                      ].map((presetColor) => (
                        <button
                          key={presetColor}
                          className="h-6 w-6 rounded border border-stroke dark:border-dark-3"
                          style={{ backgroundColor: presetColor }}
                          onClick={() => setConfig((prev) => ({ ...prev, customColorTheme: presetColor }))}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
