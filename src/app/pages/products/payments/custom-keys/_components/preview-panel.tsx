"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { CustomKeysConfig, ViewMode, CustomKeyType } from "./custom-keys-config";
import { useCustomKeysTranslations } from "./use-custom-keys-translations";

interface PreviewPanelProps {
  config: CustomKeysConfig;
  updateConfig: (updates: Partial<CustomKeysConfig>) => void;
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

function AnimatedHalftoneBackdrop({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(resize);
      observer.observe(parent);
      resizeObserverRef.current = observer;
    }

    let start = performance.now();
    const spacing = 26;
    const waveFrequency = 1.35;
    const waveSpeed = 0.35;

    const render = (time: number) => {
      const elapsed = (time - start) / 1000;
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const [r, g, b] = isDarkMode ? [255, 255, 255] : [94, 109, 136];

      for (let y = -spacing; y <= logicalHeight + spacing; y += spacing) {
        for (let x = -spacing; x <= logicalWidth + spacing; x += spacing) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalizedDistance = distance / maxDistance;
          const wavePhase = (normalizedDistance * waveFrequency - elapsed * waveSpeed) * Math.PI * 2;
          const pulse = (Math.cos(wavePhase) + 1) / 2;
          const edgeFade = Math.pow(1 - normalizedDistance, 1.4);
          const alpha = (0.06 + pulse * 0.45) * edgeFade;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.4 + pulse * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function EdgeFadeOverlay({ isDarkMode }: { isDarkMode: boolean }) {
  const fadeColor = isDarkMode ? "rgba(8,11,25,1)" : "rgba(250,252,255,1)";
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-3xl"
      style={{
        background: `radial-gradient(circle at center, rgba(0,0,0,0) 60%, ${fadeColor} 100%)`,
      }}
    ></div>
  );
}

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const translations = useCustomKeysTranslations();
  const { viewMode, currentCustomKey, currentKeyType, contacts, availableKeyTypes } = config;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState(currentCustomKey);
  const [editingKeyType, setEditingKeyType] = useState<CustomKeyType>(currentKeyType);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNewKeyPaymentModal, setShowNewKeyPaymentModal] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [contactPaymentAmount, setContactPaymentAmount] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isProcessingContactPayment, setIsProcessingContactPayment] = useState(false);

  // Validar que el tipo de clave actual esté disponible, si no, cambiar al primero disponible
  useEffect(() => {
    if (availableKeyTypes.length > 0) {
      if (!availableKeyTypes.includes(currentKeyType)) {
        updateConfig({ currentKeyType: availableKeyTypes[0] });
      }
    } else {
      // Si no hay tipos disponibles, mantener el actual pero no permitir edición
    }
  }, [availableKeyTypes, currentKeyType, updateConfig]);

  // Actualizar el tipo de edición cuando cambian los tipos disponibles
  useEffect(() => {
    if (showEditModal && availableKeyTypes.length > 0) {
      if (!availableKeyTypes.includes(editingKeyType)) {
        setEditingKeyType(availableKeyTypes[0]);
      }
    }
  }, [availableKeyTypes, showEditModal, editingKeyType]);


  // Filtrar contactos por tipos de claves disponibles
  const availableContacts = contacts.filter(contact => 
    availableKeyTypes.includes(contact.keyType)
  );

  useEffect(() => {
    const styleId = "custom-keys-preview-animations";
    if (typeof document !== "undefined" && !document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes halftonePulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `;
      document.head.appendChild(style);
    }

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleViewMode = () => {
    updateConfig({ viewMode: viewMode === "mobile" ? "web" : "mobile" });
  };

  const handleEditCustomKey = () => {
    // Si el tipo actual no está disponible, usar el primero disponible
    const initialType = availableKeyTypes.includes(currentKeyType) 
      ? currentKeyType 
      : (availableKeyTypes[0] || currentKeyType);
    setEditingKey(currentCustomKey);
    setEditingKeyType(initialType);
    setShowEditModal(true);
  };

  const handleSaveCustomKey = () => {
    updateConfig({ 
      currentCustomKey: editingKey,
      currentKeyType: editingKeyType
    });
    setShowEditModal(false);
  };

  const handleContactSelect = (contactId: string) => {
    // Si el contacto ya está seleccionado, deseleccionarlo
    if (selectedContact === contactId) {
      setSelectedContact(null);
    } else {
      setSelectedContact(contactId);
    }
  };

  const handlePayButton = () => {
    if (selectedContact) {
      setShowPaymentModal(true);
    }
  };

  const getKeyTypeLabel = (type: CustomKeyType): string => {
    return translations.preview.keyTypes[type] || type;
  };

  const getKeyTypeIcon = (type: CustomKeyType) => {
    switch (type) {
      case "cedula":
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case "telefono":
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "correo":
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const renderMobileContent = () => {
    const selectedContactData = selectedContact ? contacts.find(c => c.id === selectedContact) : null;

    return (
      <div className="relative flex h-full flex-col px-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">{translations.preview.header.title}</h1>
          <p className="text-sm text-dark-6 dark:text-dark-6">{translations.preview.header.subtitle}</p>
        </div>

        {/* Custom Key Section */}
        <div className="mb-6 rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium text-dark-6 dark:text-dark-6">{translations.preview.customKey.label}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {getKeyTypeIcon(currentKeyType)}
              </div>
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{currentCustomKey}</p>
                <p className="text-xs text-dark-6 dark:text-dark-6">{getKeyTypeLabel(currentKeyType)}</p>
              </div>
            </div>
            <button
              onClick={handleEditCustomKey}
              disabled={availableKeyTypes.length === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white text-dark-6 transition hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggested Contacts */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">{translations.preview.contacts.title}</h2>
          {availableContacts.length === 0 ? (
            <div className="rounded-lg border border-stroke bg-gray-50 p-4 text-center dark:border-dark-3 dark:bg-dark-3">
              <p className="text-sm text-dark-6 dark:text-dark-6">
                {translations.preview.contacts.empty}
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
              {availableContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}
                className={cn(
                  "group flex shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105",
                  selectedContact === contact.id && "scale-105"
                )}
              >
                <div className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all",
                  selectedContact === contact.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-stroke bg-gray-100 dark:border-dark-3 dark:bg-dark-3"
                )}>
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xl font-semibold text-dark dark:text-white">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-white dark:border-dark-2">
                    {getKeyTypeIcon(contact.keyType)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-dark dark:text-white">{contact.name}</p>
                  <p className="text-[10px] text-dark-6 dark:text-dark-6 truncate max-w-[60px]">{contact.customKey}</p>
                </div>
              </button>
              ))}
            </div>
          )}
        </div>

        {/* Payment Buttons */}
        <div className="mt-auto space-y-3">
          {selectedContact && (
            <button
              onClick={handlePayButton}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {translations.preview.buttons.payToContact} {selectedContactData?.name}
            </button>
          )}
          <button
            onClick={() => {
              setNewKeyValue("");
              setPaymentAmount("");
              setShowNewKeyPaymentModal(true);
            }}
            disabled={availableKeyTypes.length === 0}
            className="w-full rounded-lg border-2 border-primary bg-transparent px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translations.preview.buttons.payToCustomKey}
          </button>
        </div>

        {/* Edit Custom Key Modal */}
        {showEditModal && (
          <div 
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 p-4"
            onClick={() => setShowEditModal(false)}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          >
            <div 
              className="w-full max-w-md rounded-t-2xl bg-white p-6 dark:bg-dark-2"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'slideUp 0.3s ease-out' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark dark:text-white">{translations.preview.editModal.title} {getKeyTypeLabel(editingKeyType)}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    {translations.preview.editModal.keyTypeLabel}
                  </label>
                  {availableKeyTypes.length === 0 ? (
                    <div className="rounded-lg border border-stroke bg-gray-50 p-3 text-center dark:border-dark-3 dark:bg-dark-3">
                      <p className="text-xs text-dark-6 dark:text-dark-6">
                        {translations.preview.editModal.emptyTypes}
                      </p>
                    </div>
                  ) : (
                    <select
                      value={editingKeyType}
                      onChange={(e) => setEditingKeyType(e.target.value as CustomKeyType)}
                      className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                    >
                      {availableKeyTypes.map((keyType) => (
                        <option key={keyType} value={keyType}>
                          {getKeyTypeLabel(keyType)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    {translations.preview.editModal.valueLabel}
                  </label>
                  <input
                    type="text"
                    value={editingKey}
                    onChange={(e) => setEditingKey(e.target.value)}
                    placeholder={`${translations.preview.editModal.placeholder} ${getKeyTypeLabel(editingKeyType).toLowerCase()}`}
                    className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                  >
                    {translations.preview.editModal.cancel}
                  </button>
                  <button
                    onClick={handleSaveCustomKey}
                    disabled={availableKeyTypes.length === 0 || !editingKey.trim()}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {translations.preview.editModal.save}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedContact && selectedContactData && (
          <div 
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 p-4"
            onClick={() => setShowPaymentModal(false)}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          >
            <div 
              className="w-full max-w-md rounded-t-2xl bg-white p-6 dark:bg-dark-2"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'slideUp 0.3s ease-out' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark dark:text-white">{translations.preview.paymentModal.title}</h3>
                {!isProcessingContactPayment && (
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {!isProcessingContactPayment ? (
                <>
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-4 rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-lg font-semibold text-primary">
                          {selectedContactData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-dark dark:text-white">{selectedContactData.name}</p>
                        <p className="text-sm text-dark-6 dark:text-dark-6">{selectedContactData.customKey}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        {translations.preview.paymentModal.amountLabel}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-dark-6 dark:text-dark-6">
                          $
                        </span>
                        <input
                          type="number"
                          value={contactPaymentAmount}
                          onChange={(e) => setContactPaymentAmount(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full rounded-lg border border-stroke bg-white pl-8 pr-4 py-2.5 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setContactPaymentAmount("");
                      }}
                      className="flex-1 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                    >
                      {translations.preview.paymentModal.cancel}
                    </button>
                    <button
                      onClick={() => {
                        setIsProcessingContactPayment(true);
                        // Simular procesamiento del pago
                        setTimeout(() => {
                          setIsProcessingContactPayment(false);
                          setShowPaymentModal(false);
                          setContactPaymentAmount("");
                        }, 2000); // 2 segundos de animación
                      }}
                      disabled={!contactPaymentAmount || parseFloat(contactPaymentAmount) <= 0}
                      className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {translations.preview.paymentModal.confirm}
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-6 flex flex-col items-center justify-center py-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-8 w-8 animate-spin text-primary"
                      style={{ animation: 'spin 1s linear infinite' }}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-dark dark:text-white" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                    {translations.preview.paymentModal.processing}
                  </p>
                  <p className="mt-1 text-xs text-dark-6 dark:text-dark-6">
                    {translations.preview.paymentModal.processingSubtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Custom Key Payment Modal */}
        {showNewKeyPaymentModal && (
          <div 
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 p-4"
            onClick={() => setShowNewKeyPaymentModal(false)}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          >
            <div 
              className="w-full max-w-md rounded-t-2xl bg-white p-6 dark:bg-dark-2"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'slideUp 0.3s ease-out' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark dark:text-white">{translations.preview.newKeyPaymentModal.title}</h3>
                {!isProcessingPayment && (
                  <button
                    onClick={() => {
                      setShowNewKeyPaymentModal(false);
                      setNewKeyValue("");
                      setPaymentAmount("");
                    }}
                    className="text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {!isProcessingPayment ? (
                <>
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        {translations.preview.newKeyPaymentModal.customKeyLabel}
                      </label>
                      <input
                        type="text"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        placeholder={translations.preview.newKeyPaymentModal.customKeyPlaceholder}
                        className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                      />
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        {translations.preview.newKeyPaymentModal.amountLabel}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-dark-6 dark:text-dark-6">
                          $
                        </span>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full rounded-lg border border-stroke bg-white pl-8 pr-4 py-2.5 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowNewKeyPaymentModal(false);
                        setNewKeyValue("");
                        setPaymentAmount("");
                        setIsProcessingPayment(false);
                      }}
                      className="flex-1 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                    >
                      {translations.preview.newKeyPaymentModal.cancel}
                    </button>
                    <button
                      onClick={() => {
                        setIsProcessingPayment(true);
                        // Simular procesamiento del pago
                        setTimeout(() => {
                          setIsProcessingPayment(false);
                          setShowNewKeyPaymentModal(false);
                          setNewKeyValue("");
                          setPaymentAmount("");
                        }, 2000); // 2 segundos de animación
                      }}
                      disabled={!newKeyValue.trim() || !paymentAmount || parseFloat(paymentAmount) <= 0}
                      className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {translations.preview.newKeyPaymentModal.confirm}
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-6 flex flex-col items-center justify-center py-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-8 w-8 animate-spin text-primary"
                      style={{ animation: 'spin 1s linear infinite' }}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-dark dark:text-white" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                    {translations.preview.newKeyPaymentModal.processing}
                  </p>
                  <p className="mt-1 text-xs text-dark-6 dark:text-dark-6">
                    {translations.preview.newKeyPaymentModal.processingSubtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isWebMode = viewMode === "web";

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">{translations.preview.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleViewMode}
              className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
            >
              <span className="sr-only">
                {isWebMode ? translations.preview.switchToMobile : translations.preview.switchToWeb}
              </span>
              <span aria-hidden className="relative flex gap-2.5">
                <span className={cn(
                  "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                  isWebMode && "translate-x-[100px]"
                )} />
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <MobileIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{translations.preview.mobileLabel}</span>
                </span>
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <WebIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{translations.preview.webLabel}</span>
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
          <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: "850px" }}>
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)"
                  : "linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)",
              }}
            ></div>

            <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
            <EdgeFadeOverlay isDarkMode={isDarkMode} />

            <div
              className="absolute inset-0 rounded-3xl mix-blend-overlay"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1.2px, transparent 0)`
                  : `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.12) 1.2px, transparent 0)`,
                backgroundSize: "28px 28px",
                opacity: 0.5,
                animation: "halftonePulse 8s ease-in-out infinite",
              }}
            ></div>
          </div>

          <div className="relative mx-auto max-w-[340px] z-10">
            <div className="relative mx-auto">
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

                  <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto py-4 pb-8" style={{ scrollbarWidth: 'thin' }}>
                    {renderMobileContent()}
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
              {isWebMode ? translations.preview.switchToMobile : translations.preview.switchToWeb}
            </span>
            <span aria-hidden className="relative flex gap-2.5">
              <span className={cn(
                "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                isWebMode && "translate-x-[100px]"
              )} />
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <MobileIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{translations.preview.mobileLabel}</span>
              </span>
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <WebIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{translations.preview.webLabel}</span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-stroke bg-gray-50 p-8 dark:border-dark-3 dark:bg-dark-3">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-dark-2">
            {renderMobileContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

