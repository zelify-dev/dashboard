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
      
      return element;
    };

    // Usar ref para mantener una referencia estable
    const currentStepDataRef = { current: currentStepData };

    const updatePosition = () => {
      const stepData = currentStepDataRef.current;
      if (!stepData) return;

      const element = findElement();
      if (!element) return;

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

      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setHighlightPosition({
        top: elementRect.top + scrollY,
        left: elementRect.left + scrollX,
        width: elementRect.width,
        height: elementRect.height,
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
    const delay = currentStepData.target === "tour-branding-content" || currentStepData.target === "tour-branding-section" ? 300 : 100;
    const timeoutId = setTimeout(() => {
      updatePosition();
      // Si es branding y no se encontró el elemento, intentar de nuevo después de un delay adicional
      if ((currentStepData.target === "tour-branding-content" || currentStepData.target === "tour-branding-section") && !document.querySelector(`[data-tour-id="${currentStepData.target}"]`)) {
        setTimeout(() => {
          updatePosition();
        }, 200);
      }
    }, delay);

    // Agregar listeners para scroll y resize
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isTourActive, currentStep, steps, nextStep, endTour, router]);

  if (!isTourActive || steps.length === 0 || !highlightPosition) {
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  const isSidebar = currentStepData.target === "tour-sidebar" || 
                    currentStepData.target === "tour-products-section" ||
                    currentStepData.target === "tour-product-auth" ||
                    currentStepData.target === "tour-auth-authentication" ||
                    currentStepData.target === "tour-geolocalization";
  const isPreview = currentStepData.target === "tour-auth-preview";
  const isBranding = currentStepData.target === "tour-branding-content" || 
                     currentStepData.target === "tour-branding-section";

  // Determinar si el elemento necesita mostrarse completamente sin opacidad
  const needsFullVisibility = isSidebar || isPreview || isBranding;

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
            transform: tooltipTransform,
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

