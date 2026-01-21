"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useTransfersTranslations } from "./use-transfers-translations";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import type { TransfersBranding } from "./transfers-config";
import { ServiceRegion } from "../../servicios-basicos/_components/basic-services-config";

type AccountTypeId = "operational" | "individual";

const ACCOUNT_TYPES: Array<{
  id: AccountTypeId;
  name: string;
  description: string;
}> = [
  {
    id: "operational",
    name: "Cuenta operativa",
    description: "Pagos del día a día con monitoreo automatizado.",
  },
  {
    id: "individual",
    name: "Cuenta individual",
    description: "Usuarios con acceso limitado y controles básicos.",
  },
];

const DEFAULT_LIMITS: Record<
  AccountTypeId,
  { daily: number; perTransaction: number }
> = {
  operational: { daily: 220000, perTransaction: 55000 },
  individual: { daily: 50000, perTransaction: 8000 },
};

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

interface TransfersCustomizationPanelProps {
  branding: TransfersBranding;
  onBrandingChange: Dispatch<SetStateAction<TransfersBranding>>;
  selectedRegion?: ServiceRegion;
  onRegionChange?: (region: ServiceRegion) => void;
}

export function TransfersCustomizationPanel({
  branding,
  onBrandingChange,
  selectedRegion = "mexico",
  onRegionChange,
}: TransfersCustomizationPanelProps) {
  const translations = useTransfersTranslations();
  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountTypeId>("operational");
  const [limits, setLimits] = useState(DEFAULT_LIMITS);
  const [enforceDualApproval, setEnforceDualApproval] = useState(true);
  const [autoBlockSuspicious, setAutoBlockSuspicious] = useState(true);
  type OpenSection = "limits" | "branding";
  const [openSection, setOpenSection] = useState<OpenSection>("limits");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const colorPickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const selectedAccount = useMemo(
    () =>
      ACCOUNT_TYPES.find((account) => account.id === selectedAccountType) ??
      ACCOUNT_TYPES[0],
    [selectedAccountType],
  );

  // Image optimization handler
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (
        file.type === "image/svg+xml" ||
        file.name.toLowerCase().endsWith(".svg")
      ) {
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
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo crear el contexto del canvas"));
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

          const quality = 0.85;
          const mimeType = file.type || "image/png";

          try {
            const optimizedBase64 = canvas.toDataURL(mimeType, quality);
            resolve(optimizedBase64);
          } catch (error) {
            const fallbackBase64 = canvas.toDataURL("image/png", quality);
            resolve(fallbackBase64);
          }
        };
        img.onerror = () => reject(new Error("Error al cargar la imagen"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      console.warn("No file provided");
      return;
    }

    const validImageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/svg",
    ];

    const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    const isValidType =
      validImageTypes.includes(file.type.toLowerCase()) ||
      file.type.startsWith("image/") ||
      validExtensions.includes(fileExtension);

    if (!isValidType) {
      console.error(
        "Invalid file type. Accepted formats: PNG, JPG, GIF, WEBP, SVG",
      );
      alert(
        "Formato de archivo no válido. Por favor, sube una imagen PNG, JPG, GIF, WEBP o SVG.",
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("File too large. Maximum size: 5MB");
      alert(
        "El archivo es demasiado grande. El tamaño máximo permitido es 5MB.",
      );
      return;
    }

    try {
      const optimizedBase64 = await optimizeImage(file);

      const base64Size = optimizedBase64.length;
      const maxBase64Size = 2 * 1024 * 1024;
      if (base64Size > maxBase64Size) {
        alert(
          "La imagen optimizada sigue siendo muy grande. Por favor, intenta con una imagen más pequeña.",
        );
        return;
      }

      onBrandingChange((prev) => ({
        ...prev,
        [currentTheme]: {
          ...prev[currentTheme],
          logo: optimizedBase64,
        },
      }));
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error al procesar la imagen. Por favor, intenta de nuevo.");
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
      const item = items[i];
      if (item.type.startsWith("image/") || item.type === "image/svg+xml") {
        const file = item.getAsFile();
        if (file) {
          handleFileUpload(file);
        }
      }
    }
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openColorPicker) {
        const pickerElement = colorPickerRefs.current[openColorPicker];
        const target = event.target as HTMLElement;

        const isColorButton =
          target.closest('button[type="button"]') &&
          target
            .closest('button[type="button"]')
            ?.getAttribute("style")
            ?.includes("backgroundColor");

        if (
          pickerElement &&
          !pickerElement.contains(target) &&
          !isColorButton
        ) {
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

  const handleLimitChange = (
    field: "daily" | "perTransaction",
    value: number,
  ) => {
    setLimits((prev) => ({
      ...prev,
      [selectedAccountType]: {
        ...prev[selectedAccountType],
        [field]: Number.isNaN(value) ? 0 : value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Branding Configuration */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setOpenSection("branding")}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Personalización de marca
          </h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              openSection === "branding" && "rotate-180",
            )}
          />
        </button>
        {openSection === "branding" && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
            <div className="space-y-6">
              {/* Theme Selector */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Tema
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentTheme("light")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                      currentTheme === "light"
                        ? "border-primary bg-primary text-white"
                        : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white",
                    )}
                  >
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTheme("dark")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                      currentTheme === "dark"
                        ? "border-primary bg-primary text-white"
                        : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white",
                    )}
                  >
                    Oscuro
                  </button>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Logo para modo {currentTheme === "light" ? "claro" : "oscuro"}
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
                      : "border-stroke dark:border-dark-3",
                  )}
                >
                  {branding[currentTheme].logo ? (
                    <div className="relative">
                      <img
                        src={branding[currentTheme].logo!}
                        alt="Logo"
                        className="h-16 w-16 rounded-lg object-contain border border-stroke dark:border-dark-3"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onBrandingChange((prev) => ({
                            ...prev,
                            [currentTheme]: {
                              ...prev[currentTheme],
                              logo: null,
                            },
                          }))
                        }
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-3">
                      <svg
                        className="h-8 w-8 text-dark-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-dark dark:text-white">
                      Arrastra o pega tu logo aquí
                    </p>
                    <p className="mb-3 text-xs text-dark-6 dark:text-dark-6">
                      PNG, JPG, SVG, GIF, WEBP (máx. 5MB)
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                      Seleccionar archivo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Color Theme */}
              <div>
                <h4 className="mb-4 text-sm font-medium text-dark dark:text-white">
                  Paleta de colores para modo{" "}
                  {currentTheme === "light" ? "claro" : "oscuro"}
                </h4>
                <div className="relative">
                  <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                    Color primario
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenColorPicker(
                          openColorPicker === "customColor"
                            ? null
                            : "customColor",
                        )
                      }
                      className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                      style={{
                        backgroundColor:
                          branding[currentTheme].customColor ?? "#3C50E0",
                      }}
                    />
                    <input
                      type="text"
                      value={branding[currentTheme].customColor ?? "#3C50E0"}
                      onChange={(e) =>
                        onBrandingChange((prev) => ({
                          ...prev,
                          [currentTheme]: {
                            ...prev[currentTheme],
                            customColor: e.target.value,
                          },
                        }))
                      }
                      className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>
                  {openColorPicker === "customColor" && (
                    <div
                      ref={(el) => {
                        colorPickerRefs.current["customColor"] = el;
                      }}
                      className="absolute z-10 mt-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2"
                    >
                      <HexColorPicker
                        color={branding[currentTheme].customColor ?? "#3C50E0"}
                        onChange={(color) =>
                          onBrandingChange((prev) => ({
                            ...prev,
                            [currentTheme]: {
                              ...prev[currentTheme],
                              customColor: color,
                            },
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Limits Configuration */}
      <div
        className="rounded-lg bg-white shadow-sm dark:bg-dark-2"
        data-tour-id="tour-transfers-config"
      >
        <button
          onClick={() => setOpenSection("limits")}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Límites y Seguridad
          </h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              openSection === "limits" && "rotate-180",
            )}
          />
        </button>
        {openSection === "limits" && (
          <div className="border-t border-stroke px-6 py-4 space-y-4 dark:border-dark-3">
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_TYPES.map((account) => {
                const isActive = account.id === selectedAccountType;
                const accountLabel =
                  translations.customization.accountTypes[account.id];
                return (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccountType(account.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-stroke text-dark hover:border-primary/50 dark:border-dark-3 dark:text-white"
                    }`}
                  >
                    {accountLabel.name}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-dark-5 dark:text-dark-6">
              {
                translations.customization.accountTypes[selectedAccountType]
                  .description
              }
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-dark-5 dark:text-white/50">
                  {translations.customization.dailyLimitLabel}
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-stroke bg-white px-3 py-2 dark:border-dark-3 dark:bg-dark-1">
                  <span className="text-xs text-dark-6 dark:text-white/60">
                    MXN
                  </span>
                  <input
                    type="number"
                    className="w-full bg-transparent text-base font-semibold text-dark focus:outline-none dark:text-white"
                    value={limits[selectedAccountType].daily}
                    onChange={(event) =>
                      handleLimitChange("daily", Number(event.target.value))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-dark-5 dark:text-white/50">
                  {translations.customization.perTransactionLabel}
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-stroke bg-white px-3 py-2 dark:border-dark-3 dark:bg-dark-1">
                  <span className="text-xs text-dark-6 dark:text-white/60">
                    MXN
                  </span>
                  <input
                    type="number"
                    className="w-full bg-transparent text-base font-semibold text-dark focus:outline-none dark:text-white"
                    value={limits[selectedAccountType].perTransaction}
                    onChange={(event) =>
                      handleLimitChange(
                        "perTransaction",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-dashed border-stroke p-4 dark:border-dark-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">
                    {translations.customization.dualApproval.title}
                  </p>
                  <p className="text-xs text-dark-6 dark:text-white/60">
                    {translations.customization.dualApproval.desc}
                  </p>
                </div>
                <button
                  onClick={() => setEnforceDualApproval((prev) => !prev)}
                  className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                    enforceDualApproval
                      ? "bg-primary/90 text-white"
                      : "border border-stroke text-dark dark:border-dark-3 dark:text-white"
                  }`}
                >
                  {enforceDualApproval
                    ? translations.customization.dualApproval.active
                    : translations.customization.dualApproval.inactive}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">
                    {translations.customization.autoBlock.title}
                  </p>
                  <p className="text-xs text-dark-6 dark:text-white/60">
                    {translations.customization.autoBlock.desc}
                  </p>
                </div>
                <button
                  onClick={() => setAutoBlockSuspicious((prev) => !prev)}
                  className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                    autoBlockSuspicious
                      ? "bg-primary/90 text-white"
                      : "border border-stroke text-dark dark:border-dark-3 dark:text-white"
                  }`}
                >
                  {autoBlockSuspicious
                    ? translations.customization.autoBlock.active
                    : translations.customization.autoBlock.inactive}
                </button>
              </div>
            </div>

            <button className="w-full rounded-2xl bg-dark py-3 text-sm font-semibold text-white transition hover:bg-dark/80 dark:bg-white dark:text-dark">
              {translations.customization.saveButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
