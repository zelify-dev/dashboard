"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { WorkflowConfig, Country, DocumentType, LivenessType, ScreenStep } from "./workflow-config";

interface ConfigPanelProps {
  config: WorkflowConfig;
  updateConfig: (updates: Partial<WorkflowConfig>) => void;
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

function EcuadorFlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      fill="none"
      {...props}
    >
      <rect width="20" height="4.67" y="0" fill="#FFD700" />
      <rect width="20" height="4.67" y="4.67" fill="#0033A0" />
      <rect width="20" height="4.67" y="9.33" fill="#EF3340" />
    </svg>
  );
}

function MexicoFlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      fill="none"
      {...props}
    >
      <rect width="6.67" height="14" x="0" fill="#006847" />
      <rect width="6.67" height="14" x="6.67" fill="#FFFFFF" />
      <rect width="6.67" height="14" x="13.33" fill="#CE1126" />
    </svg>
  );
}

function ColombiaFlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      fill="none"
      {...props}
    >
      <rect width="20" height="7" y="0" fill="#FCD116" />
      <rect width="20" height="3.5" y="7" fill="#003893" />
      <rect width="20" height="3.5" y="10.5" fill="#CE1126" />
    </svg>
  );
}

const countryNames: Record<Country, string> = {
  ecuador: "Ecuador",
  mexico: "México",
  colombia: "Colombia",
};

const countryFlagIcons: Record<Country, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  ecuador: EcuadorFlagIcon,
  mexico: MexicoFlagIcon,
  colombia: ColombiaFlagIcon,
};

const screenNames: Record<ScreenStep, string> = {
  welcome: "Pantalla de Bienvenida",
  document_selection: "Selección de Documento",
  document_capture: "Captura de Documento",
  liveness_check: "Prueba de Vida",
  result: "Resultado",
};

const documentTypeNames: Record<DocumentType, string> = {
  drivers_license: "Licencia de Conducir",
  id_card: "Cédula/INE",
  passport: "Pasaporte",
};

const livenessTypeNames: Record<LivenessType, string> = {
  photo: "Fotografía",
  video: "Video",
  selfie_photo: "Selfie (Foto)",
  selfie_video: "Selfie (Video)",
};

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
  const { country, currentScreen, enabledScreens, documentTypes, livenessTypes, branding } = config;
  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [isScreensOpen, setIsScreensOpen] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isLivenessOpen, setIsLivenessOpen] = useState(false);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const colorPickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const currentBranding = branding[currentTheme];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openColorPicker) {
        const pickerElement = colorPickerRefs.current[openColorPicker];
        const target = event.target as HTMLElement;
        const isColorButton = target.closest('button[type="button"]') &&
          target.closest('button[type="button"]')?.getAttribute('style')?.includes('backgroundColor');

        if (pickerElement && !pickerElement.contains(target) && !isColorButton) {
          setOpenColorPicker(null);
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

  const handleFileUpload = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateConfig({
          branding: {
            ...branding,
            [currentTheme]: {
              ...branding[currentTheme],
              logo: event.target?.result as string
            }
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileUpload(file);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Country Selection */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setIsCountryOpen(!isCountryOpen)}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">País</h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              isCountryOpen && "rotate-180"
            )}
          />
        </button>
        {isCountryOpen && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex items-center gap-3">
              {(Object.keys(countryNames) as Country[]).map((countryOption) => (
                <label
                  key={countryOption}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 transition ${
                    country === countryOption
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : "border-stroke hover:border-primary/50 dark:border-dark-3"
                  }`}
                >
                  {(() => {
                    const FlagIcon = countryFlagIcons[countryOption];
                    return <FlagIcon className="h-4 w-5 flex-shrink-0" />;
                  })()}
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {countryNames[countryOption]}
                  </span>
                  <div className="relative flex h-4 w-4 items-center justify-center">
                    <input
                      type="radio"
                      name="country"
                      value={countryOption}
                      checked={country === countryOption}
                      onChange={() => updateConfig({ country: countryOption })}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                    />
                    <div className="absolute hidden h-2 w-2 rounded-full bg-primary peer-checked:block"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Screen Navigation */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setIsScreensOpen(!isScreensOpen)}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">Navegación de Pantallas</h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              isScreensOpen && "rotate-180"
            )}
          />
        </button>
        {isScreensOpen && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
            <div className="space-y-3">
              <p className="text-sm text-dark-6 dark:text-dark-6 mb-4">
                Selecciona la pantalla actual y habilita/deshabilita pantallas
              </p>
              {(Object.keys(screenNames) as ScreenStep[]).map((screen) => (
                <div 
                  key={screen} 
                  className={cn(
                    "rounded-lg border p-3 transition cursor-pointer",
                    currentScreen === screen
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : enabledScreens[screen]
                      ? "border-stroke hover:border-primary/50 dark:border-dark-3"
                      : "border-stroke opacity-50 hover:opacity-75 dark:border-dark-3"
                  )}
                  onClick={() => {
                    if (currentScreen !== screen) {
                      updateConfig({ currentScreen: screen });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="relative flex h-5 w-5 items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newEnabledState = !enabledScreens[screen];
                          updateConfig({
                            enabledScreens: {
                              ...enabledScreens,
                              [screen]: newEnabledState,
                            },
                            // Si se habilita una pantalla, automáticamente cambiar a ella
                            ...(newEnabledState ? { currentScreen: screen } : {}),
                          });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={enabledScreens[screen]}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newEnabledState = !enabledScreens[screen];
                            updateConfig({
                              enabledScreens: {
                                ...enabledScreens,
                                [screen]: newEnabledState,
                              },
                              // Si se habilita una pantalla, automáticamente cambiar a ella
                              ...(newEnabledState ? { currentScreen: screen } : {}),
                            });
                          }}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                        />
                        <svg
                          className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {screenNames[screen]}
                      </span>
                    </div>
                    {currentScreen === screen && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span className="text-xs font-medium text-primary">Actual</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document Types */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">Tipos de Documento</h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              isDocumentsOpen && "rotate-180"
            )}
          />
        </button>
        {isDocumentsOpen && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
            <div className="space-y-2">
              {(Object.keys(documentTypes) as DocumentType[]).map((docType) => (
                <label
                  key={docType}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                    documentTypes[docType]
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-stroke dark:border-dark-3"
                  }`}
                >
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={documentTypes[docType]}
                      onChange={() =>
                        updateConfig({
                          documentTypes: {
                            ...documentTypes,
                            [docType]: !documentTypes[docType],
                          },
                        })
                      }
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                    />
                    <svg
                      className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {documentTypeNames[docType]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Liveness Types */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setIsLivenessOpen(!isLivenessOpen)}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">Tipos de Prueba de Vida</h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              isLivenessOpen && "rotate-180"
            )}
          />
        </button>
        {isLivenessOpen && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
            <div className="space-y-2">
              {(Object.keys(livenessTypes) as LivenessType[]).map((livenessType) => (
                <label
                  key={livenessType}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                    livenessTypes[livenessType]
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-stroke dark:border-dark-3"
                  }`}
                >
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={livenessTypes[livenessType]}
                      onChange={() =>
                        updateConfig({
                          livenessTypes: {
                            ...livenessTypes,
                            [livenessType]: !livenessTypes[livenessType],
                          },
                        })
                      }
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                    />
                    <svg
                      className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {livenessTypeNames[livenessType]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Branding Section */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setIsBrandingOpen(!isBrandingOpen)}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">Custom Branding</h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              isBrandingOpen && "rotate-180"
            )}
          />
        </button>

        {isBrandingOpen && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
            <div className="space-y-6">
              {/* Theme Selector */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Theme
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentTheme("light")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                      currentTheme === "light"
                        ? "border-primary bg-primary text-white"
                        : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    )}
                  >
                    Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTheme("dark")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                      currentTheme === "dark"
                        ? "border-primary bg-primary text-white"
                        : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    )}
                  >
                    Dark Mode
                  </button>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Logo ({currentTheme === "light" ? "Light" : "Dark"} Mode)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border-2 border-dashed p-4 transition",
                    isDragging
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-stroke dark:border-dark-3"
                  )}
                >
                  {currentBranding.logo ? (
                    <div className="relative">
                      <img
                        src={currentBranding.logo}
                        alt="Logo"
                        className="h-16 w-16 rounded-lg object-contain border border-stroke dark:border-dark-3"
                      />
                      <button
                        onClick={() =>
                          updateConfig({
                            branding: {
                              ...branding,
                              [currentTheme]: {
                                ...branding[currentTheme],
                                logo: undefined,
                              },
                            },
                          })
                        }
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-3">
                      <svg className="h-8 w-8 text-dark-6 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {currentBranding.logo ? "Cambiar Logo" : "Subir Logo"}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.svg,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                      />
                    </label>
                    <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">
                      Arrastra y suelta una imagen (PNG, SVG) aquí, o pega desde el portapapeles
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <h4 className="mb-4 text-sm font-medium text-dark dark:text-white">
                  Color Palette ({currentTheme === "light" ? "Light" : "Dark"} Mode)
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {/* Button Background Color */}
                  <div className="relative">
                    <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                      Button Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenColorPicker(openColorPicker === "button" ? null : "button")}
                        className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                        style={{ backgroundColor: currentBranding.buttonColor }}
                      />
                      <input
                        type="text"
                        value={currentBranding.buttonColor}
                        onChange={(e) =>
                          updateConfig({
                            branding: {
                              ...branding,
                              [currentTheme]: {
                                ...branding[currentTheme],
                                buttonColor: e.target.value,
                              },
                            },
                          })
                        }
                        className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                    {openColorPicker === "button" && (
                      <div
                        ref={(el) => (colorPickerRefs.current["button"] = el)}
                        className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2"
                      >
                        <HexColorPicker
                          color={currentBranding.buttonColor}
                          onChange={(color) =>
                            updateConfig({
                              branding: {
                                ...branding,
                                [currentTheme]: {
                                  ...branding[currentTheme],
                                  buttonColor: color,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Button Label Color */}
                  <div className="relative">
                    <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                      Button Label Color
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenColorPicker(openColorPicker === "buttonLabel" ? null : "buttonLabel")}
                        className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                        style={{ backgroundColor: currentBranding.buttonLabelColor }}
                      />
                      <input
                        type="text"
                        value={currentBranding.buttonLabelColor}
                        onChange={(e) =>
                          updateConfig({
                            branding: {
                              ...branding,
                              [currentTheme]: {
                                ...branding[currentTheme],
                                buttonLabelColor: e.target.value,
                              },
                            },
                          })
                        }
                        className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                    {openColorPicker === "buttonLabel" && (
                      <div
                        ref={(el) => (colorPickerRefs.current["buttonLabel"] = el)}
                        className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2"
                      >
                        <HexColorPicker
                          color={currentBranding.buttonLabelColor}
                          onChange={(color) =>
                            updateConfig({
                              branding: {
                                ...branding,
                                [currentTheme]: {
                                  ...branding[currentTheme],
                                  buttonLabelColor: color,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Label Color */}
                  <div className="relative">
                    <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                      Label Color
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenColorPicker(openColorPicker === "label" ? null : "label")}
                        className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                        style={{ backgroundColor: currentBranding.labelColor }}
                      />
                      <input
                        type="text"
                        value={currentBranding.labelColor}
                        onChange={(e) =>
                          updateConfig({
                            branding: {
                              ...branding,
                              [currentTheme]: {
                                ...branding[currentTheme],
                                labelColor: e.target.value,
                              },
                            },
                          })
                        }
                        className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                    {openColorPicker === "label" && (
                      <div
                        ref={(el) => (colorPickerRefs.current["label"] = el)}
                        className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2"
                      >
                        <HexColorPicker
                          color={currentBranding.labelColor}
                          onChange={(color) =>
                            updateConfig({
                              branding: {
                                ...branding,
                                [currentTheme]: {
                                  ...branding[currentTheme],
                                  labelColor: color,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
