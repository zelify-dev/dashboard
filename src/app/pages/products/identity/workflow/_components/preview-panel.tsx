"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { WorkflowConfig, ViewMode, Country, DocumentType, LivenessType, ScreenStep } from "./workflow-config";

interface PreviewPanelProps {
  config: WorkflowConfig;
  updateConfig: (updates: Partial<WorkflowConfig>) => void;
}

function MobileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function WebIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

// Nombres de países
const countryNames: Record<Country, string> = {
  ecuador: "Ecuador",
  mexico: "México",
  colombia: "Colombia",
};

// Nombres de documentos por país
const documentNames: Record<Country, Record<DocumentType, string>> = {
  ecuador: {
    drivers_license: "Licencia de Conducir",
    id_card: "Cédula de Identidad",
    passport: "Pasaporte",
  },
  mexico: {
    drivers_license: "Licencia de Conducir",
    id_card: "INE / Credencial para Votar",
    passport: "Pasaporte",
  },
  colombia: {
    drivers_license: "Licencia de Conducir",
    id_card: "Cédula de Ciudadanía",
    passport: "Pasaporte",
  },
};

// Nombres de prueba de vida
const livenessNames: Record<LivenessType, string> = {
  photo: "Fotografía",
  video: "Video",
  selfie_photo: "Selfie (Foto)",
  selfie_video: "Selfie (Video)",
};

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const { viewMode, country, currentScreen, enabledScreens, documentTypes, livenessTypes, selectedDocumentType, selectedLivenessType, result, branding } = config;
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [captureStep, setCaptureStep] = useState<"front" | "back">("front");
  
  useEffect(() => {
    // Add global styles for animations
    const styleId = 'workflow-glow-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.6);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.4);
          }
        }
        
        @keyframes halftonePulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes halftoneFade {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Reset capture step when entering document capture screen
  useEffect(() => {
    if (currentScreen === "document_capture") {
      setCaptureStep("front");
    }
  }, [currentScreen]);
  
  const currentBranding = isDarkMode ? branding.dark : branding.light;

  const toggleViewMode = () => {
    updateConfig({ viewMode: viewMode === "mobile" ? "web" : "mobile" });
  };

  const navigateToScreen = (screen: ScreenStep) => {
    if (enabledScreens[screen]) {
      updateConfig({ currentScreen: screen });
    }
  };

  const getNextScreen = (): ScreenStep | null => {
    const screens: ScreenStep[] = ["welcome", "document_selection", "document_capture", "liveness_check", "result"];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex < screens.length - 1) {
      const nextScreen = screens[currentIndex + 1];
      if (enabledScreens[nextScreen]) {
        return nextScreen;
      }
    }
    return null;
  };

  const getPreviousScreen = (): ScreenStep | null => {
    const screens: ScreenStep[] = ["welcome", "document_selection", "document_capture", "liveness_check", "result"];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex > 0) {
      const prevScreen = screens[currentIndex - 1];
      if (enabledScreens[prevScreen]) {
        return prevScreen;
      }
    }
    return null;
  };

  const handleNext = () => {
    const next = getNextScreen();
    if (next) {
      navigateToScreen(next);
    }
  };

  const handlePrevious = () => {
    const prev = getPreviousScreen();
    if (prev) {
      navigateToScreen(prev);
    }
  };

  // Pantalla 1: Welcome
  const renderWelcomeScreen = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">Validación de Identidad</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Verificaremos tu identidad de forma segura y rápida
          </p>
        </div>

        <div className="mb-6 w-full space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Proceso rápido y seguro</p>
              <p className="text-xs text-dark-6 dark:text-dark-6">Completado en menos de 2 minutos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Datos protegidos</p>
              <p className="text-xs text-dark-6 dark:text-dark-6">Cifrado de extremo a extremo</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Verificación instantánea</p>
              <p className="text-xs text-dark-6 dark:text-dark-6">Resultados en tiempo real</p>
            </div>
          </div>
        </div>

        <div className="mb-6 w-full">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
              defaultChecked
            />
            <span className="text-xs text-dark-6 dark:text-dark-6">
              Acepto la <span className="font-medium text-primary">política de privacidad</span> y los <span className="font-medium text-primary">términos de servicio</span>
            </span>
          </label>
        </div>

        <button
          onClick={() => navigateToScreen("document_selection")}
          className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
          style={{
            backgroundColor: currentBranding.buttonColor,
            color: currentBranding.buttonLabelColor,
          }}
        >
          Comenzar Verificación
        </button>
      </div>
    );
  };

  // Pantalla 2: Document Selection
  const renderDocumentSelectionScreen = () => {
    const availableDocs = Object.entries(documentTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type as DocumentType);

    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigateToScreen("welcome")}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">Selecciona tu documento</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Elige el tipo de documento que deseas usar para la verificación
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {availableDocs.map((docType) => (
            <button
              key={docType}
              onClick={() => {
                updateConfig({ selectedDocumentType: docType });
                navigateToScreen("document_capture");
              }}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-all",
                selectedDocumentType === docType
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-dark-2"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                  selectedDocumentType === docType
                    ? "bg-primary/10"
                    : "bg-gray-2 dark:bg-dark-3"
                )}>
                  {docType === "drivers_license" && (
                    <svg className={cn("h-6 w-6", selectedDocumentType === docType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {docType === "id_card" && (
                    <svg className={cn("h-6 w-6", selectedDocumentType === docType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  )}
                  {docType === "passport" && (
                    <svg className={cn("h-6 w-6", selectedDocumentType === docType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">
                    {documentNames[country][docType]}
                  </p>
                  <p className="text-xs text-dark-6 dark:text-dark-6">
                    {docType === "drivers_license" && "Licencia de conducir válida"}
                    {docType === "id_card" && "Documento de identidad oficial"}
                    {docType === "passport" && "Pasaporte vigente"}
                  </p>
                </div>
                {selectedDocumentType === docType && (
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Pantalla 3: Document Capture
  const renderDocumentCaptureScreen = () => {
    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigateToScreen("document_selection")}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">
            Captura de {selectedDocumentType ? documentNames[country][selectedDocumentType] : "Documento"}
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {captureStep === "front" ? "Toma una foto del frente de tu documento" : "Toma una foto del reverso de tu documento"}
          </p>
        </div>

        <div className="mb-6 flex-1">
          <div className="relative mx-auto aspect-[16/10] max-w-sm overflow-hidden rounded-xl border-2 border-dashed border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-3">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="mb-2 text-center text-sm font-medium text-dark dark:text-white">
                {captureStep === "front" ? "Frente del documento" : "Reverso del documento"}
              </p>
              <p className="text-center text-xs text-dark-6 dark:text-dark-6">
                Asegúrate de que el documento esté bien iluminado y completamente visible
              </p>
            </div>
            {/* Simulación de documento */}
            <div className="absolute inset-4 rounded-lg bg-white shadow-lg dark:bg-dark-2">
              <div className="flex h-full flex-col p-4">
                <div className="mb-2 h-2 w-16 rounded bg-gray-300 dark:bg-dark-3"></div>
                <div className="mb-4 h-2 w-24 rounded bg-gray-300 dark:bg-dark-3"></div>
                <div className="mb-2 h-1 w-full rounded bg-gray-200 dark:bg-dark-3"></div>
                <div className="mb-2 h-1 w-3/4 rounded bg-gray-200 dark:bg-dark-3"></div>
                <div className="mb-2 h-1 w-5/6 rounded bg-gray-200 dark:bg-dark-3"></div>
                <div className="mt-auto flex gap-2">
                  <div className="h-16 w-16 rounded bg-gray-200 dark:bg-dark-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-full rounded bg-gray-200 dark:bg-dark-3"></div>
                    <div className="h-2 w-2/3 rounded bg-gray-200 dark:bg-dark-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {captureStep === "front" ? (
            <button
              onClick={() => setCaptureStep("back")}
              className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
              style={{
                backgroundColor: currentBranding.buttonColor,
                color: currentBranding.buttonLabelColor,
              }}
            >
              Continuar con el Reverso
            </button>
          ) : (
            <button
              onClick={() => navigateToScreen("liveness_check")}
              className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
              style={{
                backgroundColor: currentBranding.buttonColor,
                color: currentBranding.buttonLabelColor,
              }}
            >
              Continuar con Verificación
            </button>
          )}
        </div>
      </div>
    );
  };

  // Pantalla 4: Liveness Check
  const renderLivenessCheckScreen = () => {
    const availableLiveness = Object.entries(livenessTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type as LivenessType);

    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigateToScreen("document_capture")}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">Prueba de Vida</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Selecciona el método de verificación que prefieras
          </p>
        </div>

        <div className="mb-6 flex-1 space-y-3 overflow-y-auto">
          {availableLiveness.map((livenessType) => (
            <button
              key={livenessType}
              onClick={() => {
                updateConfig({ selectedLivenessType: livenessType });
                // Simular captura
                setTimeout(() => {
                  updateConfig({ result: Math.random() > 0.3 ? "approved" : "rejected" });
                  navigateToScreen("result");
                }, 1500);
              }}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-all",
                selectedLivenessType === livenessType
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-dark-2"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                  selectedLivenessType === livenessType
                    ? "bg-primary/10"
                    : "bg-gray-2 dark:bg-dark-3"
                )}>
                  {(livenessType === "photo" || livenessType === "selfie_photo") && (
                    <svg className={cn("h-6 w-6", selectedLivenessType === livenessType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {(livenessType === "video" || livenessType === "selfie_video") && (
                    <svg className={cn("h-6 w-6", selectedLivenessType === livenessType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">
                    {livenessNames[livenessType]}
                  </p>
                  <p className="text-xs text-dark-6 dark:text-dark-6">
                    {livenessType.includes("selfie") ? "Toma un selfie" : "Captura una imagen"}
                  </p>
                </div>
                {selectedLivenessType === livenessType && (
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Pantalla 5: Result
  const renderResultScreen = () => {
    const isApproved = result === "approved";

    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
        <div className="mb-6">
          <div className={cn(
            "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
            isApproved ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
          )}>
            {isApproved ? (
              <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h2 className={cn(
            "mb-2 text-2xl font-bold",
            isApproved ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {isApproved ? "Verificación Aprobada" : "Verificación Rechazada"}
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {isApproved
              ? "Tu identidad ha sido verificada exitosamente"
              : "No pudimos verificar tu identidad. Por favor, intenta nuevamente."}
          </p>
        </div>

        <div className="mb-6 w-full space-y-2 rounded-lg border border-stroke bg-gray-50 p-4 text-left dark:border-dark-3 dark:bg-dark-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-6 dark:text-dark-6">País:</span>
            <span className="text-sm font-medium text-dark dark:text-white">{countryNames[country]}</span>
          </div>
          {selectedDocumentType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-6 dark:text-dark-6">Documento:</span>
              <span className="text-sm font-medium text-dark dark:text-white">{documentNames[country][selectedDocumentType]}</span>
            </div>
          )}
          {selectedLivenessType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-6 dark:text-dark-6">Método:</span>
              <span className="text-sm font-medium text-dark dark:text-white">{livenessNames[selectedLivenessType]}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            updateConfig({ currentScreen: "welcome", result: null, selectedDocumentType: undefined, selectedLivenessType: undefined });
          }}
          className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
          style={{
            backgroundColor: currentBranding.buttonColor,
            color: currentBranding.buttonLabelColor,
          }}
        >
          {isApproved ? "Finalizar" : "Intentar Nuevamente"}
        </button>
      </div>
    );
  };

  // Renderizar pantalla actual
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return renderWelcomeScreen();
      case "document_selection":
        return renderDocumentSelectionScreen();
      case "document_capture":
        return renderDocumentCaptureScreen();
      case "liveness_check":
        return renderLivenessCheckScreen();
      case "result":
        return renderResultScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  const previewContent = renderCurrentScreen();
  const isWebMode = viewMode === "web";

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">Mobile Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleViewMode}
              className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
            >
              <span className="sr-only">
                Switch to {isWebMode ? "mobile" : "web"} view
              </span>
              <span aria-hidden className="relative flex gap-2.5">
                <span className={cn(
                  "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                  isWebMode && "translate-x-[100px]"
                )} />
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <MobileIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Mobile</span>
                </span>
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <WebIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Web</span>
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
          {/* Interactive animated background with halftone dots and glow */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: '850px' }}>
            {/* Base gradient background - more visible */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)',
              }}
            ></div>
            
            {/* Halftone dots pattern - discretized - with fade in/out animation */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`
                  : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)`,
                backgroundSize: '18px 18px',
                imageRendering: 'pixelated',
                animation: 'halftoneFade 3s ease-in-out infinite',
              }}
            ></div>
            
            {/* Second halftone layer with different timing for depth */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 0.8px, transparent 0)`
                  : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 0.8px, transparent 0)`,
                backgroundSize: '22px 22px',
                imageRendering: 'pixelated',
                animation: 'halftoneFade 4s ease-in-out infinite',
                animationDelay: '1.5s',
              }}
            ></div>
            
            {/* Animated glow dots - appearing and disappearing like rendering - more visible */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* Glow dot 1 - Blue */}
              <div 
                className="absolute left-[15%] top-[25%] h-32 w-32 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)',
                  filter: 'blur(40px)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                  animationDelay: '0s',
                }}
              ></div>
              
              {/* Glow dot 2 - Purple */}
              <div 
                className="absolute right-[20%] top-[35%] h-40 w-40 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(168, 85, 247, 0.5)' : 'rgba(168, 85, 247, 0.4)',
                  filter: 'blur(50px)',
                  animation: 'glowPulse 5s ease-in-out infinite',
                  animationDelay: '1s',
                }}
              ></div>
              
              {/* Glow dot 3 - Cyan */}
              <div 
                className="absolute left-[25%] bottom-[30%] h-36 w-36 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(34, 211, 238, 0.5)' : 'rgba(34, 211, 238, 0.4)',
                  filter: 'blur(45px)',
                  animation: 'glowPulse 4.5s ease-in-out infinite',
                  animationDelay: '2s',
                }}
              ></div>
              
              {/* Glow dot 4 - Pink */}
              <div 
                className="absolute right-[15%] bottom-[25%] h-28 w-28 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(236, 72, 153, 0.5)' : 'rgba(236, 72, 153, 0.4)',
                  filter: 'blur(35px)',
                  animation: 'glowPulse 3.5s ease-in-out infinite',
                  animationDelay: '0.5s',
                }}
              ></div>
              
              {/* Glow dot 5 - Indigo (center) */}
              <div 
                className="absolute left-[50%] top-[50%] h-48 w-48 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                  filter: 'blur(60px)',
                  animation: 'glowPulse 6s ease-in-out infinite',
                  animationDelay: '1.5s',
                }}
              ></div>
              
              {/* Glow dot 6 - Sky */}
              <div 
                className="absolute left-[10%] top-[60%] h-28 w-28 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(14, 165, 233, 0.5)' : 'rgba(14, 165, 233, 0.4)',
                  filter: 'blur(30px)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                  animationDelay: '2.5s',
                }}
              ></div>
              
              {/* Glow dot 7 - Violet */}
              <div 
                className="absolute right-[30%] bottom-[40%] h-32 w-32 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
                  filter: 'blur(40px)',
                  animation: 'glowPulse 5.5s ease-in-out infinite',
                  animationDelay: '3s',
                }}
              ></div>
              
              {/* Glow dot 8 - Emerald */}
              <div 
                className="absolute left-[40%] top-[15%] h-24 w-24 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.3)',
                  filter: 'blur(35px)',
                  animation: 'glowPulse 3.8s ease-in-out infinite',
                  animationDelay: '1.2s',
                }}
              ></div>
              
              {/* Glow dot 9 - Orange */}
              <div 
                className="absolute right-[25%] top-[55%] h-28 w-28 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.3)',
                  filter: 'blur(38px)',
                  animation: 'glowPulse 4.2s ease-in-out infinite',
                  animationDelay: '2.2s',
                }}
              ></div>
            </div>
            
            {/* Additional animated halftone layer for depth - more visible */}
            <div 
              className="absolute inset-0 rounded-3xl mix-blend-overlay"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1.2px, transparent 0)`
                  : `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.12) 1.2px, transparent 0)`,
                backgroundSize: '28px 28px',
                opacity: 0.5,
                animation: 'halftonePulse 8s ease-in-out infinite',
              }}
            ></div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrevious}
            disabled={!getPreviousScreen()}
            className={cn(
              "absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
              !getPreviousScreen() && "pointer-events-none"
            )}
          >
            <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={!getNextScreen()}
            className={cn(
              "absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
              !getNextScreen() && "pointer-events-none"
            )}
          >
            <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative mx-auto max-w-[340px] z-10">
            <div className="relative overflow-hidden rounded-[3rem] border-[4px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="relative h-[680px] overflow-hidden rounded-[2.5rem] bg-white dark:bg-black m-0.5 flex flex-col">
                <div className="relative flex items-center justify-between bg-white dark:bg-black px-6 pt-10 pb-2 flex-shrink-0">
                  <div className="absolute left-6 top-4 flex items-center">
                    <span className="text-xs font-semibold text-black dark:text-white">9:41</span>
                  </div>
                  <div className="absolute left-1/2 top-3 -translate-x-1/2">
                    <div className="h-5 w-24 rounded-full bg-black dark:bg-white/20"></div>
                    <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 dark:bg-white/30"></div>
                  </div>
                  <div className="absolute right-6 top-4 flex items-center gap-1.5">
                    <svg className="h-3 w-5" fill="none" viewBox="0 0 20 12">
                      <path
                        d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z"
                        fill="currentColor"
                        className="text-black dark:text-white"
                      />
                    </svg>
                    <div className="h-2.5 w-6 rounded-sm border border-black dark:border-white">
                      <div className="h-full w-4/5 rounded-sm bg-black dark:bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {previewContent}
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex-shrink-0">
                  <div className="h-1 w-32 rounded-full bg-black/30 dark:bg-white/30"></div>
                </div>
              </div>
              <div className="absolute -left-1 top-24 h-12 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
              <div className="absolute -left-1 top-40 h-8 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
              <div className="absolute -right-1 top-32 h-10 w-1 rounded-r bg-gray-800 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-dark dark:text-white">Web Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleViewMode}
            className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
          >
            <span className="sr-only">
              Switch to {isWebMode ? "mobile" : "web"} view
            </span>
            <span aria-hidden className="relative flex gap-2.5">
              <span className={cn(
                "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                isWebMode && "translate-x-[100px]"
              )} />
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <MobileIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Mobile</span>
              </span>
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <WebIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Web</span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="relative rounded-lg border border-stroke overflow-hidden p-8 dark:border-dark-3">
        {/* Background with halftone gradient and glow dots */}
        <div className="absolute inset-0 -z-10">
          {/* Chalkboard base */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
          
          {/* Halftone pattern overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          ></div>
          
          {/* Glow dots */}
          <div className="absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute right-[15%] top-[40%] h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
            <div className="absolute left-[20%] bottom-[30%] h-36 w-36 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute right-[10%] bottom-[20%] h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl"></div>
          </div>
          
          {/* Additional texture */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          disabled={!getPreviousScreen()}
          className={cn(
            "absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
            !getPreviousScreen() && "pointer-events-none"
          )}
        >
          <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={!getNextScreen()}
          className={cn(
            "absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
            !getNextScreen() && "pointer-events-none"
          )}
        >
          <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="relative mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-dark-2 min-h-[600px]">
            {previewContent}
          </div>
        </div>
      </div>
    </div>
  );
}
