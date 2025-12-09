"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { AuthConfig, ViewMode } from "./authentication-config";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";
import { useAuthTranslations } from "./use-auth-translations";
import { OTPInput } from "./otp-input";
import { CountrySelector, type Country } from "./country-selector";
import { ProgressIndicator } from "./progress-indicator";
import { SuccessAnimation } from "./success-animation";

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
  const { viewMode, serviceType, loginMethod, oauthProviders, registrationFields, customRegistrationFields, branding } = config;
  const translations = useAuthTranslations();
  
  // Detectar si el preview está en modo dark (basado en la clase dark del contenedor)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Estados para el flujo de registro
  const [registerStep, setRegisterStep] = useState(1);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    emailOTP: string;
    phoneCountry: string;
    phoneNumber: string;
    phoneOTP: string;
    username: string;
    password: string;
    showPassword: boolean;
    idNumber: string;
    birthDate: string;
    address: string;
    [key: string]: any; // Para campos personalizados
  }>({
    fullName: "",
    email: "",
    emailOTP: "",
    phoneCountry: "US",
    phoneNumber: "",
    phoneOTP: "",
    username: "",
    password: "",
    showPassword: false,
    idNumber: "",
    birthDate: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
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

  // Funciones de validación
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[0-9]{10,15}$/.test(phone.replace(/\s/g, ""));
  };

  const validateFullName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Handlers para el flujo de registro
  const handleStep1Continue = () => {
    const errors: Record<string, string> = {};
    if (!validateFullName(formData.fullName)) {
      errors.fullName = "El nombre debe tener al menos 2 caracteres";
    }
    if (!validateEmail(formData.email)) {
      errors.email = "Correo electrónico inválido";
    }
    
    if (Object.keys(errors).length === 0) {
      setRegisterStep(2);
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
    }
  };

  const handleStep2Verify = () => {
    if (formData.emailOTP.length === 6) {
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setRegisterStep(3);
      }, 2000);
    }
  };

  const handleStep3Continue = () => {
    const errors: Record<string, string> = {};
    if (!validatePhone(formData.phoneNumber)) {
      errors.phoneNumber = "Número de teléfono inválido";
    }
    
    if (Object.keys(errors).length === 0) {
      setRegisterStep(4);
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
    }
  };

  const handleStep4Verify = () => {
    if (formData.phoneOTP.length === 6) {
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setRegisterStep(5);
      }, 2000);
    }
  };

  const handleStep5CreateAccount = () => {
    const errors: Record<string, string> = {};
    const enabledFields = registrationFields.filter((f) => f.enabled);
    
    // Campos obligatorios siempre
    if (!formData.password || !validatePassword(formData.password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    
    // Validar campos habilitados (excluyendo fullName, email, phone que ya están validados)
    enabledFields.forEach((field) => {
      if (field.id === "fullName" || field.id === "email" || field.id === "phone") return;
      
      if (field.required) {
        const value = formData[field.id as keyof typeof formData] as string;
        if (!value || value.trim() === "") {
          errors[field.id] = "Este campo es obligatorio";
        }
      }
    });
    
    if (Object.keys(errors).length === 0) {
      // Aquí se completaría el registro
      console.log("Registro completado", formData);
    } else {
      setValidationErrors(errors);
    }
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
    const totalSteps = 5;
    const progressText = translations.preview.progressStep
      .replace("{current}", registerStep.toString())
      .replace("{total}", totalSteps.toString());

    const renderStepContent = () => {
      switch (registerStep) {
        case 1:
          return (
            <div className="space-y-3">
              <div>
                <h3 className="mb-1 text-base font-semibold text-dark dark:text-white">
                  {translations.preview.step1Title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-dark-6 dark:text-dark-6">
                  {translations.preview.step1Subtitle}
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                  {translations.registrationFields.fullName}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (validationErrors.fullName) {
                      setValidationErrors({ ...validationErrors, fullName: "" });
                    }
                  }}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                    validationErrors.fullName
                      ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                      : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                  )}
                  placeholder={translations.registrationFields.fullName}
                />
                {validationErrors.fullName && (
                  <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.fullName}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                  {translations.preview.emailLabel}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: "" });
                    }
                  }}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                    validationErrors.email
                      ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                      : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                  )}
                  placeholder={translations.preview.emailPlaceholder}
                />
                {validationErrors.email && (
                  <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.email}</p>
                )}
              </div>
              <button
                onClick={handleStep1Continue}
                disabled={!formData.fullName || !formData.email}
                className="w-full rounded-lg px-4 py-2 text-xs font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: currentBranding.buttonColor,
                  color: currentBranding.buttonLabelColor,
                }}
              >
                {translations.preview.continueButton}
              </button>
              <p className="text-center text-[10px] text-dark-6 dark:text-dark-6">
                {translations.preview.alreadyHaveAccount}{" "}
                <button className="font-medium text-primary">{translations.preview.signInLink}</button>
              </p>
            </div>
          );

        case 2:
          return (
            <div className="space-y-3">
              <div>
                <h3 className="mb-1 text-base font-semibold text-dark dark:text-white">
                  {translations.preview.step2Title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-dark-6 dark:text-dark-6">
                  {translations.preview.step2Subtitle} <span className="font-medium break-all">{formData.email}</span>
                </p>
              </div>
              <OTPInput
                value={formData.emailOTP}
                onChange={(value) => setFormData({ ...formData, emailOTP: value })}
                onComplete={handleStep2Verify}
                placeholder={translations.preview.otpPlaceholder}
                className="mb-2"
              />
              <button
                onClick={handleStep2Verify}
                disabled={formData.emailOTP.length !== 6}
                className="w-full rounded-lg px-4 py-2 text-xs font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: currentBranding.buttonColor,
                  color: currentBranding.buttonLabelColor,
                }}
              >
                {translations.preview.verifyButton}
              </button>
              <p className="text-center text-[10px] text-dark-6 dark:text-dark-6">
                {translations.preview.didntReceiveCode}{" "}
                <button className="font-medium text-primary">{translations.preview.resendCode}</button>
              </p>
            </div>
          );

        case 3:
          return (
            <div className="space-y-3">
              <div>
                <h3 className="mb-1 text-base font-semibold text-dark dark:text-white">
                  {translations.preview.step3Title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-dark-6 dark:text-dark-6">
                  {translations.preview.step3Subtitle}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-28">
                  <CountrySelector
                    value={formData.phoneCountry}
                    onChange={(country) => setFormData({ ...formData, phoneCountry: country.code })}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, phoneNumber: e.target.value });
                      if (validationErrors.phoneNumber) {
                        setValidationErrors({ ...validationErrors, phoneNumber: "" });
                      }
                    }}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                      validationErrors.phoneNumber
                        ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                        : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                    )}
                    placeholder={translations.preview.phoneNumberPlaceholder}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.phoneNumber}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleStep3Continue}
                disabled={!formData.phoneNumber}
                className="w-full rounded-lg px-4 py-2 text-xs font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: currentBranding.buttonColor,
                  color: currentBranding.buttonLabelColor,
                }}
              >
                {translations.preview.continueButton}
              </button>
            </div>
          );

        case 4:
          return (
            <div className="space-y-3">
              <div>
                <h3 className="mb-1 text-base font-semibold text-dark dark:text-white">
                  {translations.preview.step4Title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-dark-6 dark:text-dark-6">
                  {translations.preview.step4Subtitle} <span className="font-medium">{formData.phoneNumber}</span>
                </p>
              </div>
              <OTPInput
                value={formData.phoneOTP}
                onChange={(value) => setFormData({ ...formData, phoneOTP: value })}
                onComplete={handleStep4Verify}
                placeholder={translations.preview.otpPlaceholder}
                className="mb-2"
              />
              <button
                onClick={handleStep4Verify}
                disabled={formData.phoneOTP.length !== 6}
                className="w-full rounded-lg px-4 py-2 text-xs font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: currentBranding.buttonColor,
                  color: currentBranding.buttonLabelColor,
                }}
              >
                {translations.preview.verifyButton}
              </button>
              <p className="text-center text-[10px] text-dark-6 dark:text-dark-6">
                {translations.preview.didntReceiveCode}{" "}
                <button className="font-medium text-primary">{translations.preview.resendCode}</button>
              </p>
            </div>
          );

        case 5:
          return (
            <div className="space-y-3">
              <div>
                <h3 className="mb-1 text-base font-semibold text-dark dark:text-white">
                  {translations.preview.step5Title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-dark-6 dark:text-dark-6">
                  {translations.preview.step5Subtitle}
                </p>
              </div>
              <div className="space-y-2.5">
                {/* 1. Nombre completo (siempre visible, no configurable, se llena con lo de la pantalla 1) */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                    {translations.registrationFields.fullName}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    readOnly
                    className="w-full rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none opacity-60 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>

                {/* 2. Contraseña (siempre visible y obligatorio) */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                    {translations.preview.passwordLabel}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={formData.showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (validationErrors.password) {
                          setValidationErrors({ ...validationErrors, password: "" });
                        }
                      }}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 pr-10 text-xs text-dark outline-none transition dark:text-white",
                        validationErrors.password
                          ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                          : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                      )}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-dark-6 hover:text-dark dark:text-dark-6"
                    >
                      {formData.showPassword ? translations.preview.hidePassword : translations.preview.showPassword}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.password}</p>
                  )}
                </div>

                {/* 3. Campos adicionales configurable (username, idNumber, birthDate, address) */}
                {enabledFields.find((f) => f.id === "username") && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                      {translations.registrationFields.username}
                      {enabledFields.find((f) => f.id === "username")?.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                        if (validationErrors.username) {
                          setValidationErrors({ ...validationErrors, username: "" });
                        }
                      }}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                        validationErrors.username
                          ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                          : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                      )}
                      placeholder={translations.preview.usernamePlaceholder}
                    />
                    {validationErrors.username && (
                      <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.username}</p>
                    )}
                  </div>
                )}

                {enabledFields.find((f) => f.id === "idNumber") && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                      {translations.registrationFields.idNumber}
                      {enabledFields.find((f) => f.id === "idNumber")?.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, idNumber: e.target.value });
                        if (validationErrors.idNumber) {
                          setValidationErrors({ ...validationErrors, idNumber: "" });
                        }
                      }}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                        validationErrors.idNumber
                          ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                          : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                      )}
                      placeholder={translations.registrationFields.idNumber}
                    />
                    {validationErrors.idNumber && (
                      <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.idNumber}</p>
                    )}
                  </div>
                )}

                {enabledFields.find((f) => f.id === "birthDate") && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                      {translations.registrationFields.birthDate}
                      {enabledFields.find((f) => f.id === "birthDate")?.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => {
                        setFormData({ ...formData, birthDate: e.target.value });
                        if (validationErrors.birthDate) {
                          setValidationErrors({ ...validationErrors, birthDate: "" });
                        }
                      }}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                        validationErrors.birthDate
                          ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                          : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                      )}
                    />
                    {validationErrors.birthDate && (
                      <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.birthDate}</p>
                    )}
                  </div>
                )}

                {enabledFields.find((f) => f.id === "address") && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                      {translations.registrationFields.address}
                      {enabledFields.find((f) => f.id === "address")?.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (validationErrors.address) {
                          setValidationErrors({ ...validationErrors, address: "" });
                        }
                      }}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                        validationErrors.address
                          ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                          : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                      )}
                      placeholder={translations.registrationFields.address}
                    />
                    {validationErrors.address && (
                      <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors.address}</p>
                    )}
                  </div>
                )}

                {/* Campos personalizados */}
                {customRegistrationFields.map((field) => (
                  <div key={field.id}>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: currentBranding.labelColor }}>
                      {field.label || "Campo personalizado"}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.id] || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.id]: e.target.value });
                          if (validationErrors[field.id]) {
                            setValidationErrors({ ...validationErrors, [field.id]: "" });
                          }
                        }}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                          validationErrors[field.id]
                            ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                            : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                        )}
                        placeholder={field.placeholder || ""}
                        rows={3}
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={formData[field.id] || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.id]: e.target.value });
                          if (validationErrors[field.id]) {
                            setValidationErrors({ ...validationErrors, [field.id]: "" });
                          }
                        }}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                          validationErrors[field.id]
                            ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                            : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                        )}
                      >
                        <option value="">{field.placeholder || "Selecciona una opción"}</option>
                        {field.options?.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.id]: e.target.value });
                          if (validationErrors[field.id]) {
                            setValidationErrors({ ...validationErrors, [field.id]: "" });
                          }
                        }}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-xs text-dark outline-none transition dark:text-white",
                          validationErrors[field.id]
                            ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                            : "border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2"
                        )}
                        placeholder={field.placeholder || ""}
                      />
                    )}
                    {validationErrors[field.id] && (
                      <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">{validationErrors[field.id]}</p>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleStep5CreateAccount}
                className="w-full rounded-lg px-4 py-2 text-xs font-medium transition hover:opacity-90"
                style={{
                  backgroundColor: currentBranding.buttonColor,
                  color: currentBranding.buttonLabelColor,
                }}
              >
                {translations.preview.createAccountButton}
              </button>
              <p className="text-center text-[10px] leading-relaxed text-dark-6 dark:text-dark-6">
                {translations.preview.termsAndPrivacy}
              </p>
            </div>
          );

        default:
          return null;
      }
    };

    const content = (
      <div className="flex h-full min-h-0 flex-col">
        {/* Logo fijo arriba */}
        {currentBranding.logo && (
          <div className="mb-1.5 flex flex-shrink-0 justify-center pt-1">
            <img src={currentBranding.logo} alt="Logo" className="h-10 max-w-full object-contain" />
          </div>
        )}
        
        {/* Indicador de progreso */}
        <div className="mb-2 flex-shrink-0 px-1">
          <ProgressIndicator 
            current={registerStep} 
            total={totalSteps} 
            className="mb-1.5" 
            onStepClick={(step) => setRegisterStep(step)}
          />
          <p className="text-center text-[10px] text-dark-6 dark:text-dark-6">{progressText}</p>
        </div>
        
        {/* Área scrollable con contenido del paso */}
        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-3">
            {renderStepContent()}
          </div>
        </div>
      </div>
    );

    return content;
  };

  const previewContent = serviceType === "login" ? renderLoginPreview() : renderRegisterPreview(viewMode === "mobile");
  const isWebMode = viewMode === "web";
  const switchViewLabel = isWebMode ? translations.preview.switchToMobileView : translations.preview.switchToWebView;

  // Resetear el paso cuando cambia el serviceType o customRegistrationFields
  useEffect(() => {
    if (serviceType === "register") {
      setRegisterStep(1);
      const initialData: typeof formData = {
        fullName: "",
        email: "",
        emailOTP: "",
        phoneCountry: "US",
        phoneNumber: "",
        phoneOTP: "",
        username: "",
        password: "",
        showPassword: false,
        idNumber: "",
        birthDate: "",
        address: "",
      };
      // Inicializar campos personalizados
      customRegistrationFields.forEach((field) => {
        initialData[field.id] = "";
      });
      setFormData(initialData);
      setValidationErrors({});
    }
  }, [serviceType, customRegistrationFields]);

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
                  {/* Success Animation - dentro del dispositivo */}
                  {showSuccessAnimation && (
                    <SuccessAnimation 
                      onComplete={() => setShowSuccessAnimation(false)} 
                      relative={true}
                      small={true}
                    />
                  )}
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
