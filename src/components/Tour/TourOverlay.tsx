"use client";

import { useEffect, useRef, useState } from "react";
import { useTour } from "@/contexts/tour-context";
import { useRouter } from "next/navigation";

export function TourOverlay() {
  const router = useRouter();
  const {
    isTourActive,
    currentStep,
    steps,
    nextStep,
    previousStep,
    endTour,
  } = useTour();
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
  const currentStepDataRef = useRef<{ target: string; position?: string; url?: string } | null>(null);

  useEffect(() => {
    if (!isTourActive || steps.length === 0) {
      setHighlightPosition(null);
      setTooltipPosition(null);
      currentStepDataRef.current = null;
      return;
    }

    const currentStepData = steps[currentStep];
    if (!currentStepData) return;
    
    // Actualizar la referencia
    currentStepDataRef.current = currentStepData;

    // Si el paso tiene una URL, navegar a ella
    if (currentStepData.url) {
      router.push(currentStepData.url);
    }

    // Verificar si el target es el sidebar completo o el dispositivo
    const isSidebar = currentStepData.target === "tour-sidebar" || currentStepData.target === "tour-products-section";
    const isDevice = currentStepData.target === "tour-auth-device";

    // Esperar un poco si hay navegación para que el DOM se actualice
    const findElement = () => {
      return document.querySelector(
        `[data-tour-id="${currentStepData.target}"]`
      );
    };

    let targetElement = findElement();
    
    // Si no se encuentra y hay una URL, esperar un poco más
    if (!targetElement && currentStepData.url) {
      setTimeout(() => {
        targetElement = findElement();
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const scrollY = window.scrollY;
          const scrollX = window.scrollX;
          setHighlightPosition({
            top: rect.top + scrollY,
            left: rect.left + scrollX,
            width: rect.width,
            height: rect.height,
          });
          // Calcular posición del tooltip
          const position = currentStepData.position || "bottom";
          let tooltipTop = 0;
          let tooltipLeft = 0;
          if (position === "right") {
            tooltipTop = rect.top + scrollY + rect.height / 2;
            tooltipLeft = rect.right + scrollX + 20;
          }
          setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
        }
      }, 800);
      return;
    }

    if (!targetElement) {
      // Si no se encuentra el elemento, avanzar al siguiente paso
      if (currentStep < steps.length - 1) {
        setTimeout(() => nextStep(), 100);
      } else {
        endTour();
      }
      return;
    }

    let rect = targetElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Si es el producto de Autenticación, incluir el dropdown expandido
    if (currentStepData.target === "tour-product-auth") {
      // Buscar el contenedor div que incluye el botón y el dropdown
      const container = targetElement.querySelector("div");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        // Usar el rectángulo del contenedor que incluye todo (botón + dropdown)
        rect = containerRect;
      }
    }

    // Si es la sección de personalización de marca, incluir el contenido expandido
    if (currentStepData.target === "tour-branding-section") {
      // El elemento ya incluye todo el contenedor con el contenido expandido
      // No necesitamos hacer nada adicional ya que el div completo se selecciona
    }

    setHighlightPosition({
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      width: rect.width,
      height: rect.height,
    });

    // Calcular posición del tooltip
    const position = currentStepData.position || "bottom";
    let tooltipTop = 0;
    let tooltipLeft = 0;

    if (position === "bottom") {
      tooltipTop = rect.bottom + scrollY + 10;
      tooltipLeft = rect.left + scrollX + rect.width / 2;
    } else if (position === "top") {
      tooltipTop = rect.top + scrollY - 10;
      tooltipLeft = rect.left + scrollX + rect.width / 2;
    } else if (position === "right") {
      // Para el sidebar, centrar verticalmente y posicionar a la derecha
      tooltipTop = rect.top + scrollY + rect.height / 2;
      tooltipLeft = rect.right + scrollX + 20;
    } else if (position === "left") {
      // Para branding, centrar verticalmente y posicionar a la izquierda, alejado del elemento
      tooltipTop = rect.top + scrollY + rect.height / 2;
      tooltipLeft = rect.left + scrollX - 20; // Posición inicial a la izquierda
    } else {
      tooltipTop = rect.top + scrollY + rect.height / 2;
      tooltipLeft = rect.left + scrollX - 10;
    }

    // Establecer posición inicial inmediatamente
    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

    // Ajustar posición del tooltip después de renderizar
    setTimeout(() => {
      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Ajustar si se sale de la pantalla
        if (position === "left") {
          // Para posición left, asegurar que no se salga por la izquierda
          if (tooltipLeft < 20) {
            tooltipLeft = 20;
          }
          // Si se sale por la derecha, ajustar
          if (tooltipLeft + tooltipRect.width > viewportWidth) {
            tooltipLeft = viewportWidth - tooltipRect.width - 20;
          }
        } else if (position !== "right" || !isSidebar) {
          if (tooltipLeft + tooltipRect.width > viewportWidth) {
            tooltipLeft = viewportWidth - tooltipRect.width - 20;
          }
          if (tooltipLeft < 20) {
            tooltipLeft = 20;
          }
        }
        
        // Ajustar verticalmente
        if (tooltipTop + tooltipRect.height / 2 > viewportHeight + scrollY) {
          tooltipTop = viewportHeight + scrollY - tooltipRect.height - 20;
        }
        if (tooltipTop - tooltipRect.height / 2 < scrollY + 20) {
          tooltipTop = scrollY + 20 + tooltipRect.height / 2;
        }

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
      }
    }, 0);

    // Función para actualizar la posición basada en el scroll
    const updatePosition = () => {
      const stepData = currentStepDataRef.current;
      if (!stepData) return;

      const element = document.querySelector(
        `[data-tour-id="${stepData.target}"]`
      );
      if (!element) return;

      let elementRect = element.getBoundingClientRect();

      // Si es el producto de Autenticación, incluir el dropdown expandido
      if (stepData.target === "tour-product-auth") {
        const container = element.querySelector("div");
        if (container) {
          elementRect = container.getBoundingClientRect();
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
        // Para branding, centrar verticalmente y posicionar a la izquierda, alejado del elemento
        tooltipTop = elementRect.top + scrollY + elementRect.height / 2;
        // Calcular posición a la izquierda del elemento, considerando el ancho del tooltip
        tooltipLeft = elementRect.left + scrollX - 350; // Más a la izquierda, asumiendo tooltip de ~320px de ancho
      } else {
        tooltipTop = elementRect.top + scrollY + elementRect.height / 2;
        tooltipLeft = elementRect.left + scrollX - 10;
      }

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
    };

    // Scroll al elemento si es necesario
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    // Agregar listener de scroll para actualizar posición
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isTourActive, currentStep, steps, nextStep, endTour]);

  if (!isTourActive || steps.length === 0 || !highlightPosition) {
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  // Verificar si el target es el sidebar completo, el preview o la sección de branding
  const isSidebar = currentStepData.target === "tour-sidebar" || currentStepData.target === "tour-products-section";
  const isPreview = currentStepData.target === "tour-auth-preview" || currentStepData.target === "tour-auth-device";
  const isBranding = currentStepData.target === "tour-branding-section" || currentStepData.target === "tour-branding-content";

  return (
    <>
      {/* Overlay oscuro - excluir el sidebar, preview o branding si está seleccionado */}
      {(isSidebar || isPreview || isBranding) && highlightPosition ? (
        <>
          {/* Overlay arriba del sidebar */}
          {highlightPosition.top > 0 && (
            <div
              className="fixed z-[100] bg-black/60"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: `${highlightPosition.top}px`,
              }}
            />
          )}
          {/* Overlay a la izquierda del sidebar */}
          {highlightPosition.left > 0 && (
            <div
              className="fixed z-[100] bg-black/60"
              style={{
                top: `${highlightPosition.top}px`,
                left: 0,
                width: `${highlightPosition.left}px`,
                height: `${highlightPosition.height}px`,
              }}
            />
          )}
          {/* Overlay a la derecha del sidebar */}
          <div
            className="fixed z-[100] bg-black/60"
            style={{
              top: `${highlightPosition.top}px`,
              left: `${highlightPosition.left + highlightPosition.width}px`,
              right: 0,
              height: `${highlightPosition.height}px`,
            }}
          />
          {/* Overlay debajo del sidebar */}
          <div
            className="fixed z-[100] bg-black/60"
            style={{
              top: `${highlightPosition.top + highlightPosition.height}px`,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 z-[100] bg-black/60 transition-opacity" />
      )}

      {/* Highlight del elemento - solo mostrar borde si no es el sidebar completo */}
      {!isSidebar && (
        <div
          className="fixed z-[101] rounded-lg border-2 border-primary"
          style={{
            top: `${highlightPosition.top}px`,
            left: `${highlightPosition.left}px`,
            width: `${highlightPosition.width}px`,
            height: `${highlightPosition.height}px`,
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 0 4px rgba(87, 80, 241, 0.8), 0 0 20px rgba(87, 80, 241, 0.4)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Borde alrededor del sidebar, preview o branding cuando está seleccionado */}
      {(isSidebar || isPreview || isBranding) && highlightPosition && (
        <div
          className="fixed z-[103] border-4 border-primary rounded-lg"
          style={{
            top: `${highlightPosition.top}px`,
            left: `${highlightPosition.left}px`,
            width: `${highlightPosition.width}px`,
            height: `${highlightPosition.height}px`,
            pointerEvents: "none",
            boxShadow: "0 0 20px rgba(87, 80, 241, 0.5)",
          }}
        />
      )}

      {/* Tooltip - siempre mostrar cuando el tour está activo */}
      {isTourActive && currentStepData && highlightPosition && (
        <div
          ref={tooltipRef}
          className="fixed z-[105] w-80 rounded-lg bg-white p-4 shadow-xl dark:bg-dark-2"
          style={{
            top: tooltipPosition ? `${tooltipPosition.top}px` : `${highlightPosition.top + highlightPosition.height / 2}px`,
            left: tooltipPosition 
              ? `${tooltipPosition.left}px` 
              : currentStepData.position === "right"
              ? `${highlightPosition.left + highlightPosition.width + 20}px`
              : currentStepData.position === "left"
              ? `${highlightPosition.left - 350}px`
              : `${highlightPosition.left + highlightPosition.width / 2}px`,
            transform:
              currentStepData.position === "right" || currentStepData.position === "left"
                ? currentStepData.position === "left"
                  ? "translateX(0) translateY(-50%)"
                  : "translateY(-50%)"
                : "translateX(-50%)",
          }}
        >
          <h3 className="mb-2 text-lg font-bold text-dark dark:text-white">
            {currentStepData.title}
          </h3>
          <p className="mb-4 text-sm text-dark-6 dark:text-dark-6">
            {currentStepData.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-dark-4 dark:text-dark-6">
              {currentStep + 1} de {steps.length}
            </div>
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

