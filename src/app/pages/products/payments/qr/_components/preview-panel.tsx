"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { QRConfig, ViewMode } from "./qr-config";

interface PreviewPanelProps {
  config: QRConfig;
  updateConfig: (updates: Partial<QRConfig>) => void;
}

type QRMode = "show" | "scan";

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

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

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
          const wavePhase =
            (normalizedDistance * waveFrequency - elapsed * waveSpeed) *
            Math.PI *
            2;
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

// QR Code Display using image
function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <img
          src="/images/imgqr.png"
          alt="QR Code"
          className="h-[200px] w-[200px] object-contain"
        />
      </div>
    </div>
  );
}

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const { viewMode } = config;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [qrMode, setQrMode] = useState<QRMode>("show");

  useEffect(() => {
    const styleId = "qr-preview-animations";
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
        @keyframes scanLine {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
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

  const renderMobileContent = () => {
    return (
      <div className="relative flex h-full flex-col px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">Pagos QR</h1>
          <p className="text-sm text-dark-6 dark:text-dark-6">Recibe o realiza pagos con QR</p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex gap-2 rounded-xl border border-stroke bg-gray-50 p-1 dark:border-dark-3 dark:bg-dark-3">
          <button
            onClick={() => setQrMode("show")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
              qrMode === "show"
                ? "bg-primary text-white"
                : "text-dark-6 dark:text-dark-6"
            )}
          >
            Mostrar QR
          </button>
          <button
            onClick={() => setQrMode("scan")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
              qrMode === "scan"
                ? "bg-primary text-white"
                : "text-dark-6 dark:text-dark-6"
            )}
          >
            Escanear QR
          </button>
        </div>

        {/* Content based on mode */}
        {qrMode === "show" ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-6">
            <div className="text-center">
              <p className="mb-2 text-sm font-medium text-dark dark:text-white">
                Tu código QR para recibir pagos
              </p>
              <p className="text-xs text-dark-6 dark:text-dark-6">
                Comparte este código para que te paguen
              </p>
            </div>
            
            <QRCodeDisplay value="payment:user123" />
            
            <div className="w-full space-y-3">
              <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Compartir QR
              </button>
              <button className="w-full rounded-lg border border-stroke px-4 py-3 text-sm font-semibold text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3">
                Guardar imagen
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            {/* Camera View Simulation */}
            <div className="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              {/* Camera overlay with QR code being scanned */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* QR Code being scanned (slightly smaller than frame) */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90">
                    <QRCodeDisplay value="scanning:qr123" />
                  </div>
                  
                  {/* Scanning frame */}
                  <div className="relative h-64 w-64 rounded-xl border-2 border-white">
                    {/* Corner indicators */}
                    <div className="absolute -top-1 -left-1 h-8 w-8 border-l-4 border-t-4 border-primary"></div>
                    <div className="absolute -top-1 -right-1 h-8 w-8 border-r-4 border-t-4 border-primary"></div>
                    <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-primary"></div>
                    
                    {/* Scanning line with glow effect */}
                    <div
                      className="absolute left-0 right-0 h-1 bg-primary opacity-90 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                      style={{
                        top: "0%",
                        animation: "scanLine 2s linear infinite",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-transparent"></div>
                    </div>
                    
                    {/* Scanning overlay effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/20 pointer-events-none"
                      style={{
                        animation: "scanLine 2s linear infinite",
                      }}
                    ></div>
                  </div>
                  
                  {/* Scanning indicator dots */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Overlay instructions */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
                <p className="text-center text-sm font-medium text-white">
                  Escaneando código QR...
                </p>
                <p className="mt-1 text-center text-xs text-white/70">
                  Mantén el código dentro del marco
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent self-start">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">Mobile Preview</h2>
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

                  <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
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

  return null;
}

