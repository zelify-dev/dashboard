"use client";

import { useTour } from "@/contexts/tour-context";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function TourOverlay() {
  const { isTourActive, currentStep, steps, nextStep, previousStep, endTour } = useTour();
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const resultsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isTourActive || steps.length === 0) {
      setHighlightPosition(null);
      setTooltipPosition(null);
      return;
    }

    const currentStepData = steps[currentStep];
    if (!currentStepData) {
      setHighlightPosition(null);
      setTooltipPosition(null);
      return;
    }

    // Navegar si hay URL
    if (currentStepData.url) {
      router.push(currentStepData.url);
    }

    const findElement = (): HTMLElement | null => {
      // Para branding, intentar primero encontrar el elemento objetivo
      let element = document.querySelector(`[data-tour-id="${currentStepData.target}"]`) as HTMLElement;

      // Si no se encuentra y es branding-content, intentar con branding-section
      if (!element && currentStepData.target === "tour-branding-content") {
        element = document.querySelector(`[data-tour-id="tour-branding-section"]`) as HTMLElement;
      }

      // Para geolocalization-results, intentar encontrar el contenedor padre completo
      if (currentStepData.target === "tour-geolocalization-results" && element) {
        // Buscar el contenedor padre que tiene el fondo blanco y contiene tanto el formulario como los resultados
        const parentContainer = element.closest('.rounded-lg.bg-white.dark\\:bg-dark-2, .rounded-lg.bg-white');
        if (parentContainer) {
          return parentContainer as HTMLElement;
        }
      }

      // Para device-information-modal, el modal puede no estar en el DOM inicialmente
      // Intentar encontrarlo varias veces si no está disponible
      if (currentStepData.target === "tour-device-information-modal" && !element) {
        // El modal se renderiza condicionalmente, así que puede no estar disponible inmediatamente
        // Se manejará con el delay y los reintentos en el timeout
      }

      return element;
    };

    // Usar ref para mantener una referencia estable
    const currentStepDataRef = { current: currentStepData };

    const updatePosition = () => {
      const stepData = currentStepDataRef.current;
      if (!stepData) return;

      const element = findElement();
      if (!element) return;

      // Hacer scroll al elemento si es necesario (especialmente para resultados)
      if (stepData.target === "tour-geolocalization-results") {
        // Establecer posición inicial inmediatamente para que se vea algo
        const initialRect = element.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const padding = 16;

        setHighlightPosition({
          top: initialRect.top + scrollY - padding,
          left: initialRect.left + scrollX - padding,
          width: initialRect.width + (padding * 2),
          height: initialRect.height + (padding * 2),
        });

        // Posicionar tooltip usando coordenadas de viewport (sin scroll) para que no se mueva
        const position = stepData.position || "left";
        let tooltipLeft = initialRect.left - 360; // Sin scrollX, coordenadas de viewport
        const tooltipWidth = 320;
        if (tooltipLeft < 10) {
          tooltipLeft = initialRect.right + 20;
        }
        if (tooltipLeft + tooltipWidth > window.innerWidth - 10) {
          tooltipLeft = window.innerWidth - tooltipWidth - 10;
        }
        // Usar coordenadas de viewport para el tooltip
        setTooltipPosition({
          top: initialRect.top + (initialRect.height / 2), // Sin scrollY
          left: tooltipLeft,
        });

        // Luego hacer scroll y refinar la posición
        element.scrollIntoView({ behavior: "smooth", block: "start" });

        // Refinar posición después del scroll - actualizar constantemente
        // Limpiar intervalo anterior si existe
        if (resultsIntervalRef.current) {
          clearInterval(resultsIntervalRef.current);
        }

        resultsIntervalRef.current = setInterval(() => {
          const updatedElement = findElement();
          if (!updatedElement) {
            if (resultsIntervalRef.current) {
              clearInterval(resultsIntervalRef.current);
              resultsIntervalRef.current = null;
            }
            return;
          }

          const newRect = updatedElement.getBoundingClientRect();
          const newScrollY = window.scrollY;
          const newScrollX = window.scrollX;

          // Actualizar highlight con coordenadas absolutas
          setHighlightPosition({
            top: newRect.top + newScrollY - padding,
            left: newRect.left + newScrollX - padding,
            width: newRect.width + (padding * 2),
            height: newRect.height + (padding * 2),
          });

          // Actualizar tooltip con coordenadas de viewport (sin scroll)
          let refinedTooltipLeft = newRect.left - 360;
          if (refinedTooltipLeft < 10) {
            refinedTooltipLeft = newRect.right + 20;
          }
          if (refinedTooltipLeft + tooltipWidth > window.innerWidth - 10) {
            refinedTooltipLeft = window.innerWidth - tooltipWidth - 10;
          }

          setTooltipPosition({
            top: newRect.top + (newRect.height / 2), // Sin scrollY
            left: refinedTooltipLeft,
          });
        }, 50); // Actualizar cada 50ms para seguir el scroll

        return; // Salir temprano, la actualización inicial ya se hizo
      }

      let elementRect = element.getBoundingClientRect();

      // Ajustar para auth-product (incluir todo el dropdown)
      if (stepData.target === "tour-product-auth") {
        const parentLi = element.closest("li");
        if (parentLi) {
          const expandedUl = parentLi.querySelector("ul");
          if (expandedUl) {
            const parentRect = parentLi.getBoundingClientRect();
            const expandedRect = expandedUl.getBoundingClientRect();
            elementRect = {
              top: Math.min(parentRect.top, expandedRect.top),
              left: parentRect.left,
              right: Math.max(parentRect.right, expandedRect.right),
              bottom: Math.max(parentRect.bottom, expandedRect.bottom),
              width: Math.max(parentRect.width, expandedRect.width),
              height: expandedRect.bottom - Math.min(parentRect.top, expandedRect.top),
            } as DOMRect;
          }
        }
      }

      // Ajustar para branding-content
      if (stepData.target === "tour-branding-content") {
        const section = element.closest('[data-tour-id="tour-branding-section"]');
        if (section) {
          elementRect = section.getBoundingClientRect();
        }
      }

      // Agregar padding para otros elementos que lo necesiten
      let padding = 0;

      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setHighlightPosition({
        top: elementRect.top + scrollY - padding,
        left: elementRect.left + scrollX - padding,
        width: elementRect.width + (padding * 2),
        height: elementRect.height + (padding * 2),
      });

      // Recalcular posición del tooltip
      const position = stepData.position || "bottom";
      let tooltipTop = 0;
      let tooltipLeft = 0;

      if (position === "bottom") {
        tooltipTop = elementRect.bottom + scrollY + 10;
        tooltipLeft = elementRect.left + scrollX + elementRect.width / 2;
      } else if (position === "top") {
        tooltipTop = elementRect.top + scrollY - 10;
        tooltipLeft = elementRect.left + scrollX + elementRect.width / 2;
      } else if (position === "right") {
        tooltipTop = elementRect.top + scrollY + elementRect.height / 2;
        tooltipLeft = elementRect.right + scrollX + 20;
      } else if (position === "left") {
        tooltipTop = elementRect.top + scrollY + elementRect.height / 2;
        tooltipLeft = elementRect.left + scrollX - 350;
        // Asegurar que el tooltip no se salga de la pantalla
        if (tooltipLeft < 10) {
          tooltipLeft = elementRect.right + scrollX + 20;
        }
      } else {
        tooltipTop = elementRect.top + scrollY + elementRect.height / 2;
        tooltipLeft = elementRect.left + scrollX - 10;
      }

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
    };

    // Actualizar referencia
    currentStepDataRef.current = currentStepData;

    // Esperar un poco para que el DOM se actualice después de la navegación
    // Para branding, esperar más tiempo para que la sección se abra
    // Para geolocalization-results, esperar menos tiempo ya que establecemos posición inicial inmediatamente
    // Para device-information-modal, esperar más tiempo para que el modal se abra después del clic
    const delay = currentStepData.target === "tour-branding-content" || currentStepData.target === "tour-branding-section"
      ? 300
      : currentStepData.target === "tour-geolocalization-results"
        ? 200
        : currentStepData.target === "tour-device-information-modal"
          ? 1200
          : 100;
    const timeoutId = setTimeout(() => {
      updatePosition();
      // Si es branding y no se encontró el elemento, intentar de nuevo después de un delay adicional
      if ((currentStepData.target === "tour-branding-content" || currentStepData.target === "tour-branding-section") && !document.querySelector(`[data-tour-id="${currentStepData.target}"]`)) {
        setTimeout(() => {
          updatePosition();
        }, 200);
      }
      // Si es geolocalization-results y no se encontró el elemento, intentar de nuevo después de un delay adicional
      if (currentStepData.target === "tour-geolocalization-results") {
        const checkElement = () => {
          const element = document.querySelector(`[data-tour-id="tour-geolocalization-results"]`);
          if (!element) {
            setTimeout(checkElement, 200);
          } else {
            updatePosition();
          }
        };
        if (!document.querySelector(`[data-tour-id="tour-geolocalization-results"]`)) {
          checkElement();
        }
      }
      // Si es device-information-modal y no se encontró el elemento, intentar de nuevo después de un delay adicional
      if (currentStepData.target === "tour-device-information-modal") {
        let attempts = 0;
        const maxAttempts = 15; // 15 intentos = 4.5 segundos
        const checkModal = () => {
          const element = document.querySelector(`[data-tour-id="tour-device-information-modal"]`);
          if (!element && attempts < maxAttempts) {
            attempts++;
            setTimeout(checkModal, 300);
          } else if (element) {
            updatePosition();
          }
        };
        if (!document.querySelector(`[data-tour-id="tour-device-information-modal"]`)) {
          checkModal();
        }
      }
    }, delay);

    // Agregar listeners para scroll y resize
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      // Limpiar intervalo de resultados si existe
      if (resultsIntervalRef.current) {
        clearInterval(resultsIntervalRef.current);
        resultsIntervalRef.current = null;
      }
    };
  }, [isTourActive, currentStep, steps, nextStep, endTour, router]);

  if (!isTourActive || steps.length === 0 || !highlightPosition) {
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  // El sidebar solo se resalta cuando es el target específico del paso actual
  // Después del paso 3, no se resalta en pasos intermedios hasta que vuelva a ser el target
  const isSidebar = currentStepData.target === "tour-sidebar" ||
    currentStepData.target === "tour-products-section" ||
    currentStepData.target === "tour-product-auth" ||
    currentStepData.target === "tour-auth-authentication" ||
    currentStepData.target === "tour-geolocalization" ||
    currentStepData.target === "tour-device-information";

  const isPreview = currentStepData.target === "tour-auth-preview";
  const isBranding = currentStepData.target === "tour-branding-content" ||
    currentStepData.target === "tour-branding-section";
  const isGeolocalizationDevice = currentStepData.target === "tour-geolocalization-device";
  const isGeolocalizationSearch = currentStepData.target === "tour-geolocalization-search";
  const isGeolocalizationResults = currentStepData.target === "tour-geolocalization-results";
  const isDeviceInformation = currentStepData.target === "tour-device-information";
  const isDeviceInformationTable = currentStepData.target === "tour-device-information-table";
  const isDeviceInformationFirstRow = currentStepData.target === "tour-device-information-first-row";
  const isDeviceInformationModal = currentStepData.target === "tour-device-information-modal";

  // Nuevos módulos - todos necesitan visibilidad completa
  const isAML = currentStepData.target === "tour-product-aml" ||
    currentStepData.target === "tour-aml-validation-global-list" ||
    currentStepData.target === "tour-aml-validation-form" ||
    currentStepData.target === "tour-aml-validations-list";
  const isIdentity = currentStepData.target === "tour-product-identity" ||
    currentStepData.target === "tour-identity-workflow" ||
    currentStepData.target === "tour-identity-workflow-config" ||
    currentStepData.target === "tour-identity-workflow-preview";
  const isConnect = currentStepData.target === "tour-product-connect" ||
    currentStepData.target === "tour-connect-bank-account-linking" ||
    currentStepData.target === "tour-connect-config" ||
    currentStepData.target === "tour-connect-preview";
  const isCards = currentStepData.target === "tour-product-cards" ||
    currentStepData.target === "tour-cards-issuing-design" ||
    currentStepData.target === "tour-cards-design-editor" ||
    currentStepData.target === "tour-cards-preview" ||
    currentStepData.target === "tour-cards-transactions";
  const isTransfers = currentStepData.target === "tour-product-transfers" ||
    currentStepData.target === "tour-transfers-config" ||
    currentStepData.target === "tour-transfers-region-panel" ||
    currentStepData.target === "tour-transfers-preview";
  const isTx = currentStepData.target === "tour-product-tx" ||
    currentStepData.target === "tour-tx-international-transfers" ||
    currentStepData.target === "tour-tx-config" ||
    currentStepData.target === "tour-tx-preview";
  const isAI = currentStepData.target === "tour-product-ai" ||
    currentStepData.target === "tour-ai-alaiza" ||
    currentStepData.target === "tour-ai-alaiza-config" ||
    currentStepData.target === "tour-ai-alaiza-preview";
  const isPayments = currentStepData.target === "tour-product-payments" ||
    currentStepData.target === "tour-payments-custom-keys" ||
    currentStepData.target === "tour-payments-qr" ||
    currentStepData.target === "tour-payments-preview";
  const isDiscounts = currentStepData.target === "tour-product-discounts" ||
    currentStepData.target === "tour-discounts-coupons" ||
    currentStepData.target === "tour-discounts-create" ||
    currentStepData.target === "tour-discounts-analytics";

  // Determinar si el elemento necesita mostrarse completamente sin opacidad
  const needsFullVisibility = isSidebar || isPreview || isBranding || isGeolocalizationDevice || isGeolocalizationSearch || isGeolocalizationResults || isDeviceInformation || isDeviceInformationTable || isDeviceInformationFirstRow || isDeviceInformationModal || isAML || isIdentity || isConnect || isCards || isTransfers || isTx || isAI || isPayments || isDiscounts;

  const position = currentStepData.position || "bottom";
  const tooltipTransform =
    position === "left"
      ? "translateX(0) translateY(-50%)"
      : position === "right"
        ? "translateX(0) translateY(-50%)"
        : position === "top"
          ? "translateX(-50%) translateY(-100%)"
          : "translateX(-50%) translateY(0)";

  return (
    <>
      {/* Overlay con huecos para elementos que necesitan visibilidad completa */}
      {needsFullVisibility ? (
        <>
          {/* Overlay superior */}
          <div
            className="fixed z-[100] bg-black/50"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: `${highlightPosition.top}px`,
            }}
          />
          {/* Overlay inferior */}
          <div
            className="fixed z-[100] bg-black/50"
            style={{
              top: `${highlightPosition.top + highlightPosition.height}px`,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          {/* Overlay izquierdo */}
          <div
            className="fixed z-[100] bg-black/50"
            style={{
              top: `${highlightPosition.top}px`,
              left: 0,
              width: `${highlightPosition.left}px`,
              height: `${highlightPosition.height}px`,
            }}
          />
          {/* Overlay derecho */}
          <div
            className="fixed z-[100] bg-black/50"
            style={{
              top: `${highlightPosition.top}px`,
              left: `${highlightPosition.left + highlightPosition.width}px`,
              right: 0,
              height: `${highlightPosition.height}px`,
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 z-[100] bg-black/50" />
      )}

      {/* Highlight border */}
      {needsFullVisibility ? (
        <div
          className="pointer-events-none fixed z-[103] rounded-lg border-4 border-primary"
          style={{
            top: `${highlightPosition.top}px`,
            left: `${highlightPosition.left}px`,
            width: `${highlightPosition.width}px`,
            height: `${highlightPosition.height}px`,
          }}
        />
      ) : (
        <div
          className="pointer-events-none fixed z-[103] rounded-lg border-4 border-primary"
          style={{
            top: `${highlightPosition.top}px`,
            left: `${highlightPosition.left}px`,
            width: `${highlightPosition.width}px`,
            height: `${highlightPosition.height}px`,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}

      {/* Tooltip */}
      {tooltipPosition && (
        <div
          ref={tooltipRef}
          className="fixed z-[105] w-80 rounded-lg bg-white p-4 shadow-xl dark:bg-dark-2"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: currentStepData.target === "tour-geolocalization-results"
              ? "translateY(-50%)"
              : tooltipTransform,
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              {currentStepData.title}
            </h3>
            <button
              onClick={endTour}
              className="text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            >
              <svg
                className="h-5 w-5"
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
          <p className="mb-4 text-sm text-dark-6 dark:text-dark-6">
            {currentStepData.content}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-6 dark:text-dark-6">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={previousStep}
                  className="rounded-lg border border-stroke px-3 py-1.5 text-sm font-medium text-dark transition-colors hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-3"
                >
                  Anterior
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={endTour}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

