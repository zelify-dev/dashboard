"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { AuthConfig, ViewMode } from "./authentication-config";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";
import { useAuthTranslations } from "./use-auth-translations";

interface PreviewPanelProps {
  config: AuthConfig;
  updateConfig: (updates: Partial<AuthConfig>) => void;
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
  const { viewMode, serviceType, loginMethod, oauthProviders, registrationFields, branding } = config;
  const translations = useAuthTranslations();
  
  // Detectar si el preview está en modo dark (basado en la clase dark del contenedor)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Verificar si el documento tiene la clase dark
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Observar cambios en la clase dark
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const styleId = "auth-preview-animations";
    if (typeof document !== "undefined" && !document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes halftonePulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  const currentBranding = isDarkMode ? branding.dark : branding.light;

  const toggleViewMode = () => {
    updateConfig({ viewMode: viewMode === "mobile" ? "web" : "mobile" });
  };

  const renderLoginPreview = () => {
    if (loginMethod === "oauth") {
      return (
        <div className="space-y-3">
          {currentBranding.logo && (
            <div className="mb-2 flex justify-center">
              <img src={currentBranding.logo} alt="Logo" className="h-12 max-w-full object-contain" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {translations.preview.loginTitle}
          </h3>
          <div className="space-y-2">
            {oauthProviders.includes("google") && (
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                <GoogleIcon />
                {translations.preview.providerAction} Google
              </button>
            )}
            {oauthProviders.includes("facebook") && (
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                <FacebookIcon />
                {translations.preview.providerAction} Facebook
              </button>
            )}
            {oauthProviders.includes("apple") && (
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                <AppleIcon />
                {translations.preview.providerAction} Apple
              </button>
            )}
          </div>
          {loginMethod !== "oauth" && oauthProviders.length > 0 && (
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
              <span className="px-3 text-sm text-dark-6 dark:text-dark-6">
                {translations.preview.or}
              </span>
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {currentBranding.logo && (
          <div className="mb-4 flex justify-center">
            <img src={currentBranding.logo} alt="Logo" className="h-12 max-w-full object-contain" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {translations.preview.loginTitle}
        </h3>
        <div className="space-y-3">
          {loginMethod === "phone" && (
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: currentBranding.labelColor }}>
                {translations.preview.phoneLabel}
              </label>
              <input
                type="tel"
                placeholder={translations.preview.phonePlaceholder}
                className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
              />
            </div>
          )}
          {loginMethod === "username" && (
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: currentBranding.labelColor }}>
                {translations.preview.usernameLabel}
              </label>
              <input
                type="text"
                placeholder={translations.preview.usernamePlaceholder}
                className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
              />
            </div>
          )}
          {loginMethod === "email" && (
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: currentBranding.labelColor }}>
                {translations.preview.emailLabel}
              </label>
              <input
                type="email"
                placeholder={translations.preview.emailPlaceholder}
                className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: currentBranding.labelColor }}>
              {translations.preview.passwordLabel}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
            />
          </div>
          <button 
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
            style={{ 
              backgroundColor: currentBranding.buttonColor,
              color: currentBranding.buttonLabelColor
            }}
          >
            {translations.preview.signInButton}
          </button>
        </div>
        {oauthProviders.length > 0 && (
          <>
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
              <span className="px-3 text-sm text-dark-6 dark:text-dark-6">
                {translations.preview.or}
              </span>
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
            </div>
            <div className="space-y-2">
              {oauthProviders.includes("google") && (
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                  <GoogleIcon />
                  {translations.preview.providerAction} Google
                </button>
              )}
              {oauthProviders.includes("facebook") && (
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                  <FacebookIcon />
                  {translations.preview.providerAction} Facebook
                </button>
              )}
              {oauthProviders.includes("apple") && (
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                  <AppleIcon />
                  {translations.preview.providerAction} Apple
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderRegisterPreview = (isMobile: boolean = false) => {
    const enabledFields = registrationFields.filter((field) => field.enabled);

    // En modo móvil, estructura fija con scroll solo en campos
    if (isMobile) {
      return (
        <div className="flex h-full min-h-0 flex-col">
          {/* Logo fijo arriba */}
          {currentBranding.logo && (
            <div className="mb-2 flex flex-shrink-0 justify-center pt-2">
              <img src={currentBranding.logo} alt="Logo" className="h-12 max-w-full object-contain" />
            </div>
          )}
          {/* Título fijo */}
          <h3 className="mb-3 flex-shrink-0 text-lg font-semibold text-dark dark:text-white">
            {translations.preview.registerTitle}
          </h3>
          {/* Área scrollable solo con campos del formulario */}
          <div className="min-h-0 flex-1 overflow-y-auto space-y-3 pb-2" style={{ scrollbarWidth: 'thin' }}>
            {enabledFields.map((field) => {
              const fieldLabel = translations.registrationFields[field.id];
              return (
                <div key={field.id}>
                  <label className="mb-2 block text-sm font-medium" style={{ color: currentBranding.labelColor }}>
                    {fieldLabel}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.id === "birthDate" ? (
                    <input
                      type="date"
                      className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  ) : field.id === "email" ? (
                    <input
                      type="email"
                      placeholder={translations.preview.emailPlaceholder}
                      className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                    />
                  ) : field.id === "phone" ? (
                    <input
                      type="tel"
                      placeholder={translations.preview.phonePlaceholder}
                      className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`${translations.preview.enterPrefix} ${fieldLabel.toLowerCase()}`}
                      className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Botón fijo abajo */}
          <button 
            className="mt-3 w-full flex-shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
            style={{ 
              backgroundColor: currentBranding.buttonColor,
              color: currentBranding.buttonLabelColor
            }}
          >
            {translations.preview.registerButton}
          </button>
        </div>
      );
    }

    // En modo web, estructura normal
    return (
      <div className="space-y-4">
        {currentBranding.logo && (
          <div className="mb-2 flex justify-center">
            <img src={currentBranding.logo} alt="Logo" className="h-12 max-w-full object-contain" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {translations.preview.registerTitle}
        </h3>
        <div className="space-y-3">
          {enabledFields.map((field) => {
            const fieldLabel = translations.registrationFields[field.id];
            return (
              <div key={field.id}>
                <label className="mb-2 block text-sm font-medium" style={{ color: currentBranding.labelColor }}>
                  {fieldLabel}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.id === "birthDate" ? (
                  <input
                    type="date"
                    className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                ) : field.id === "email" ? (
                  <input
                    type="email"
                    placeholder={translations.preview.emailPlaceholder}
                    className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                  />
                ) : field.id === "phone" ? (
                  <input
                    type="tel"
                    placeholder={translations.preview.phonePlaceholder}
                    className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={`${translations.preview.enterPrefix} ${fieldLabel.toLowerCase()}`}
                    className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                  />
                )}
              </div>
            );
          })}
          <button 
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
            style={{ 
              backgroundColor: currentBranding.buttonColor,
              color: currentBranding.buttonLabelColor
            }}
          >
            {translations.preview.registerButton}
          </button>
        </div>
      </div>
    );
  };

  const previewContent = serviceType === "login" ? renderLoginPreview() : renderRegisterPreview(viewMode === "mobile");
  const isWebMode = viewMode === "web";
  const switchViewLabel = isWebMode ? translations.preview.switchToMobileView : translations.preview.switchToWebView;

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            {translations.preview.mobilePreviewTitle}
          </h2>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={toggleViewMode}
              className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
            >
              <span className="sr-only">
                {switchViewLabel}
              </span>

              <span aria-hidden className="relative flex gap-2.5">
                {/* Indicator */}
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
            {/* Base gradient background */}
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

            {/* Additional halftone layer */}
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
            {/* iPhone Frame */}
            <div className="relative mx-auto">
              {/* Outer frame with iPhone-like design */}
              <div className="relative overflow-hidden rounded-[3rem] border-[4px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
                {/* Screen - Fixed height container */}
                <div className="relative h-[680px] overflow-hidden rounded-[2.5rem] bg-white dark:bg-black m-0.5 flex flex-col">
                  {/* Status bar with Dynamic Island and icons aligned */}
                  <div className="relative flex items-center justify-between bg-white dark:bg-black px-6 pt-10 pb-2 flex-shrink-0">
                    {/* Left side - Time aligned with Dynamic Island */}
                    <div className="absolute left-6 top-4 flex items-center">
                      <span className="text-xs font-semibold text-black dark:text-white">9:41</span>
                    </div>

                    {/* Center - Dynamic Island */}
                    <div className="absolute left-1/2 top-3 -translate-x-1/2">
                      <div className="h-5 w-24 rounded-full bg-black dark:bg-white/20"></div>
                      {/* Speaker */}
                      <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 dark:bg-white/30"></div>
                    </div>

                    {/* Right side - Signal and Battery aligned with Dynamic Island */}
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

                  {/* Content area - Scrollable with fixed height */}
                  <div className={`flex-1 min-h-0 bg-white dark:bg-black px-5 ${serviceType === "register" ? "py-4" : "overflow-y-auto py-4 pb-8"}`} style={serviceType === "register" ? {} : { scrollbarWidth: 'thin' }}>
                    {previewContent}
                  </div>

                  {/* Home indicator - Fixed at bottom */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex-shrink-0">
                    <div className="h-1 w-32 rounded-full bg-black/30 dark:bg-white/30"></div>
                  </div>
                </div>

                {/* Side buttons */}
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
        <h2 className="text-xl font-bold text-dark dark:text-white">
          {translations.preview.webPreviewTitle}
        </h2>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <button
            onClick={toggleViewMode}
            className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
          >
            <span className="sr-only">
              {switchViewLabel}
            </span>

            <span aria-hidden className="relative flex gap-2.5">
              {/* Indicator */}
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
            {previewContent}
          </div>
        </div>
      </div>
    </div>
  );
}
