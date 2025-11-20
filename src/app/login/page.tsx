"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import InputGroup from "@/components/FormElements/InputGroup";

// ============================================================================
// CONSTANTS - Credentials
// ============================================================================
const DEMO_EMAIL = "demo@zwippe.com";
const DEMO_PASSWORD = "zwippe2025";

// ============================================================================
// CONSTANTS - Colors (Cambia estos colores fácilmente)
// ============================================================================
const COLORS = {
  // Background colors
  backgroundLight: "#f1f5f9", // Light mode background
  backgroundDark: "#001832", // Dark mode background
  
  // Card colors
  cardLight: "#ffffff", // Light mode card
  cardDark: "#0d1224", // Dark mode card
  
  // Right panel colors
  rightPanelBg: "rgb(170, 255, 59)", // Color verde del panel derecho
  rightPanelBorderDark: "#04335A", // Borde del panel derecho en dark mode
  
  // Button colors
  buttonPrimaryLight: "#004195", // Botón en light mode
  buttonPrimaryLightHover: "#0a56c2", // Hover del botón en light mode
  buttonPrimaryDark: "#66ff00", // Botón en dark mode (verde)
  buttonPrimaryDarkHover: "#ffffff", // Hover del botón en dark mode
  
  // Error colors
  errorBorder: "#dd2f2c", // Color del borde de error
  
  // Animation colors (para la animación halftone)
  halftoneLight: "rgb(12, 13, 14)", // Color de puntos en light mode
  halftoneDark: "rgba(255, 255, 255, 1)", // Color de puntos en dark mode
} as const;

// ============================================================================
// CONSTANTS - Logo URLs (Cambia las URLs de los logos aquí)
// ============================================================================
const LOGO_URLS = {
  dark: "https://flowchart-diagrams-zelify.s3.us-east-1.amazonaws.com/zelifyLogo_dark.svg",
  light: "https://flowchart-diagrams-zelify.s3.us-east-1.amazonaws.com/zelifyLogo_ligth.svg",
} as const;

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
      // Usar colores de las constantes - parsear rgba
      const halftoneColor = isDarkMode ? COLORS.halftoneDark : COLORS.halftoneLight;
      const rgbaMatch = halftoneColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      const [r, g, b] = rgbaMatch 
        ? [Number(rgbaMatch[1]), Number(rgbaMatch[2]), Number(rgbaMatch[3])]
        : [255, 255, 255];

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

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar modo dark/light
  useEffect(() => {
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

  // Agregar estilos de animación
  useEffect(() => {
    const styleId = "login-halftone-animations";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate demo credentials
    if (data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
      // Save session in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", data.email);
      
      // Dispatch a custom event to notify AuthGuard of the authentication change
      if (typeof window !== "undefined") {
        // Dispatch both storage event (for cross-tab) and custom event (for same tab)
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("authchange", { detail: { authenticated: true } }));
      }
      
      // Simulate authentication delay
      setTimeout(() => {
        setLoading(false);
        // Force a full page reload to ensure all components re-initialize correctly
        // This ensures the DashboardLayout, Sidebar, and Header render properly
        window.location.href = "/";
      }, 500);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError("Incorrect credentials.");
      }, 500);
    }
  };

  return (
    <div 
      className="relative flex min-h-screen items-center justify-center bg-gray-2 px-4 overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      }}
    >
      {/* ======================================================================
          ANIMACIÓN DE FONDO - Aquí se aplica la animación halftone
          ====================================================================== */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(0, 24, 50, 0.95) 0%, rgba(0, 8, 26, 1) 50%, rgba(0, 24, 50, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)",
          }}
        ></div>

        {/* ANIMACIÓN PRINCIPAL: Puntos halftone animados con efecto de onda */}
        <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
        
        {/* Overlay con fade en los bordes */}
        <EdgeFadeOverlay isDarkMode={isDarkMode} />

        {/* Capa adicional de patrón halftone con animación de pulso */}
        <div
          className="absolute inset-0 mix-blend-overlay"
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

      {/* ======================================================================
          CONTENEDOR PRINCIPAL
          ====================================================================== */}
      <div className="relative z-10 w-full max-w-[1200px]">
        <div 
          className="rounded-[10px] shadow-1 dark:shadow-card"
          style={{
            backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
          }}
        >
          <div className="flex flex-wrap items-center">
            
            {/* ==================================================================
                SECCIÓN IZQUIERDA - Formulario de Login
                ================================================================== */}
            <div className="w-full xl:w-1/2">
              <div className="w-full p-4 sm:p-12.5 xl:p-15">
                
                {/* LOGO #1 - Logo en la sección del formulario (izquierda) */}
                <div className="mb-10">
                  <Link href="/" className="inline-block">
                    <Image
                      className="hidden dark:block"
                      src={LOGO_URLS.dark}
                      alt="Zelify Logo"
                      width={176}
                      height={32}
                    />
                    <Image
                      className="dark:hidden"
                      src={LOGO_URLS.light}
                      alt="Zelify Logo"
                      width={176}
                      height={32}
                    />
                  </Link>
                </div>

                <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                  Welcome back
                </h1>
                <p className="mb-8 text-sm text-dark-6 dark:text-dark-6">
                  Sign in to your account to access the dashboard
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Mensaje de error */}
                  {error && (
                    <div 
                      className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20"
                      style={{
                        borderColor: isDarkMode ? COLORS.errorBorder : undefined,
                        color: isDarkMode ? COLORS.errorBorder : undefined,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <InputGroup
                    type="email"
                    label="Email"
                    className="mb-4 [&_input]:py-[15px]"
                    placeholder="demo@zwippe.com"
                    name="email"
                    handleChange={handleChange}
                    value={data.email}
                    icon={<EmailIcon />}
                  />

                  <InputGroup
                    type="password"
                    label="Password"
                    className="mb-5 [&_input]:py-[15px]"
                    placeholder="Enter your password"
                    name="password"
                    handleChange={handleChange}
                    value={data.password}
                    icon={<PasswordIcon />}
                  />

                  {/* Botón de login */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-4 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isDarkMode ? COLORS.buttonPrimaryDark : COLORS.buttonPrimaryLight,
                        color: isDarkMode ? "#000000" : "#ffffff",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.backgroundColor = isDarkMode 
                            ? COLORS.buttonPrimaryDarkHover 
                            : COLORS.buttonPrimaryLightHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode 
                          ? COLORS.buttonPrimaryDark 
                          : COLORS.buttonPrimaryLight;
                      }}
                    >
                      {loading ? (
                        <>
                          Signing in...
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>

                  {/* <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                    <p className="mb-2 text-xs font-semibold text-dark-6 dark:text-dark-6">
                      Demo credentials:
                    </p>
                    <p className="text-xs text-dark-6 dark:text-dark-6">
                      <strong>Email:</strong> demo@gmail.com
                    </p>
                    <p className="text-xs text-dark-6 dark:text-dark-6">
                      <strong>Password:</strong> demodashboard
                    </p>
                  </div> */}
                </form>
              </div>
            </div>

            {/* ==================================================================
                SECCIÓN DERECHA - Panel Informativo (Color Verde)
                ================================================================== */}
            <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
              <div 
                className="relative overflow-hidden rounded-2xl px-12.5 pt-12.5 border"
                style={{
                  backgroundColor: COLORS.rightPanelBg,
                  borderColor: isDarkMode ? COLORS.rightPanelBorderDark : "transparent",
                }}
              >
                <div className="relative z-10">
                <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                  Sign in to your account
                </p>

                <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                  Demo Dashboard Zelify
                </h2>

                <p className="mb-8 w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                  Access all the tools and settings of your dashboard by completing the required fields
                </p>

                <div className="mt-31">
                  <Image
                    src={"/images/grids/grid-02.svg"}
                    alt="Grid"
                    width={405}
                    height={325}
                    className="mx-auto dark:opacity-30"
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

