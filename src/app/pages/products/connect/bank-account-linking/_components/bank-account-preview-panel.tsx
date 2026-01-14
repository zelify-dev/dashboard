"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { BankAccountCountry } from "./bank-account-config";
import { useLanguage } from "@/contexts/language-context";
import { connectTranslations } from "./connect-translations";

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
      const [r, g, b] = isDarkMode ? [255, 255, 255] : [70, 85, 110];
      const minAlpha = isDarkMode ? 0.06 : 0.1;
      const maxAlpha = isDarkMode ? 0.45 : 0.5;

      for (let y = -spacing; y <= logicalHeight + spacing; y += spacing) {
        for (let x = -spacing; x <= logicalWidth + spacing; x += spacing) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalizedDistance = distance / maxDistance;
          const wavePhase = (normalizedDistance * waveFrequency - elapsed * waveSpeed) * Math.PI * 2;
          const pulse = (Math.cos(wavePhase) + 1) / 2;
          const edgeFade = Math.pow(1 - normalizedDistance, 1.4);
          const alpha = (minAlpha + pulse * maxAlpha) * edgeFade;
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

interface Bank {
  id: string;
  name: string;
  logo?: string; // URL or path to logo
}

interface BankAccount {
  id: string;
  type: string;
  accountNumber: string;
  balance?: string;
  currency: string;
}

interface BankAccountPreviewPanelProps {
  country: BankAccountCountry;
  viewMode?: "mobile" | "web";
  onViewModeChange?: (mode: "mobile" | "web") => void;
  onBankSelected?: (selected: boolean) => void;
  branding?: {
    logo?: string;
    customColorTheme?: string;
  };
}

// Helper function to get bank logo URL
const getBankLogoUrl = (bankName: string, country: BankAccountCountry): string => {
  const logoMap: Record<string, string> = {
    // Ecuador
    "Banco Pichincha": "https://i.pinimg.com/474x/f5/f8/2a/f5f82af6e493d255169b12e2665ceb77.jpg",
    "Banco de Guayaquil": "https://logo.clearbit.com/bancoguayaquil.com",
    "Banco del Pacífico": "https://logo.clearbit.com/bancodelpacifico.com",
    "Banco Produbanco": "https://logo.clearbit.com/produbanco.com",
    "Banco Internacional": "https://logo.clearbit.com/bancointernacional.com.ec",
    "Banco Bolivariano": "https://logo.clearbit.com/bolivariano.com",

    // Mexico
    "BBVA México": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVdrhJI-7dmgG6mHo_Tlp4omfIsp1yuwvfJw&s",
    "Banco Santander": "https://logo.clearbit.com/santander.com.mx",
    "Banamex": "https://logo.clearbit.com/banamex.com",
    "HSBC México": "https://logo.clearbit.com/hsbc.com.mx",
    "Banco Azteca": "https://logo.clearbit.com/bancoazteca.com.mx",
    "Scotiabank México": "https://logo.clearbit.com/scotiabank.com.mx",

    // Brasil
    "Banco do Brasil": "https://logo.clearbit.com/bb.com.br",
    "Itaú Unibanco": "https://logo.clearbit.com/itau.com.br",
    "Bradesco": "https://logo.clearbit.com/bradesco.com.br",
    "Santander Brasil": "https://logo.clearbit.com/santander.com.br",
    "Banco Inter": "https://logo.clearbit.com/bancointer.com.br",
    "Nubank": "https://logo.clearbit.com/nubank.com.br",

    // Colombia
    "Bancolombia": "https://logo.clearbit.com/bancolombia.com",
    "Banco de Bogotá": "https://logo.clearbit.com/bancodebogota.com",
    "Davivienda": "https://logo.clearbit.com/davivienda.com",
    "Banco Popular": "https://logo.clearbit.com/bancopopular.com.co",
    "BBVA Colombia": "https://logo.clearbit.com/bbva.com.co",
    "Banco de Occidente": "https://logo.clearbit.com/bancodeoccidente.com.co",

    // Estados Unidos
    "Chase Bank": "https://logo.clearbit.com/chase.com",
    "Bank of America": "https://freelogopng.com/images/all_img/1658985797bank-of-america-logo.png",
    "Wells Fargo": "https://logo.clearbit.com/wellsfargo.com",
    "Citibank": "https://logo.clearbit.com/citi.com",
    "US Bank": "https://logo.clearbit.com/usbank.com",
    "PNC Bank": "https://logo.clearbit.com/pnc.com",
  };

  return logoMap[bankName] || "";
};

// Bank accounts examples by country
const bankAccountsByCountry: Record<BankAccountCountry, BankAccount[]> = {
  ecuador: [
    { id: "1", type: "Cuenta CLABE", accountNumber: "012345678901234567", balance: "$1,234.56", currency: "USD" },
    { id: "2", type: "Chequera", accountNumber: "****1234", balance: "$5,678.90", currency: "USD" },
  ],
  mexico: [
    { id: "1", type: "Cuenta CLABE", accountNumber: "012345678901234567", balance: "$12,345.67", currency: "MXN" },
    { id: "2", type: "Chequera", accountNumber: "****4567", balance: "$8,901.23", currency: "MXN" },
  ],
  brasil: [
    { id: "1", type: "Cuenta CLABE", accountNumber: "012345678901234567", balance: "R$ 3,456.78", currency: "BRL" },
    { id: "2", type: "Chequera", accountNumber: "****1234-5", balance: "R$ 9,012.34", currency: "BRL" },
  ],
  colombia: [
    { id: "1", type: "Cuenta CLABE", accountNumber: "012345678901234567", balance: "$4,567.89", currency: "COP" },
    { id: "2", type: "Chequera", accountNumber: "****12345678", balance: "$11,234.56", currency: "COP" },
  ],
  estados_unidos: [
    { id: "1", type: "Cuenta CLABE", accountNumber: "012345678901234567", balance: "$2,345.67", currency: "USD" },
    { id: "2", type: "Chequera", accountNumber: "****1234", balance: "$18,901.23", currency: "USD" },
  ],
};

// Banks / providers data by country
const banksByCountry: Record<BankAccountCountry, Bank[] | "coming_soon"> = {
  // For Ecuador we now show cooperatives instead of traditional banks.
  // Names are placeholders and should be verified against authoritative sources before production.
  ecuador: [
    { id: "ec-coop-jep", name: "Juventud Ecuatoriana Progresista", logo: "https://www.jep.coop/documents/20182/41979/JEP-Social.png"},
    { id: "ec-coop-jardin", name: "Jardín Azuayo", logo: "https://www.asociacioncge.com/wp-content/uploads/2023/05/LOGO-COOP-JARDIN-AZUAYO-1024x818.png"},
    { id: "ec-coop-alianza", name: "Alianza del Valle", logo: "https://play-lh.googleusercontent.com/oRckG6u4J-3iS_kn_Bh4nJzamqrBNqiJInNmAHFcnc3kjbgJoSstxMZs9Jp5jX_FdA"},
    { id: "ec-coop-cpn", name: "Policía Nacional", logo: "https://www.cpn.fin.ec/frontend/web/images/logo_cpn.jpg"},
    { id: "ec-coop-cacpeco", name: "CACPECO", logo: "https://www.cacpeco.com/wp-content/uploads/2025/06/cacpecologo.png"},
  ],
  mexico: [
    { id: "1", name: "BBVA México", logo: getBankLogoUrl("BBVA México", "mexico") },
    { id: "2", name: "Banco Santander", logo: getBankLogoUrl("Banco Santander", "mexico") },
    { id: "3", name: "Banamex", logo: getBankLogoUrl("Banamex", "mexico") },
    { id: "4", name: "HSBC México", logo: getBankLogoUrl("HSBC México", "mexico") },
    { id: "5", name: "Banco Azteca", logo: getBankLogoUrl("Banco Azteca", "mexico") },
    { id: "6", name: "Scotiabank México", logo: getBankLogoUrl("Scotiabank México", "mexico") },
  ],
  brasil: [
    { id: "1", name: "Banco do Brasil", logo: getBankLogoUrl("Banco do Brasil", "brasil") },
    { id: "2", name: "Itaú Unibanco", logo: getBankLogoUrl("Itaú Unibanco", "brasil") },
    { id: "3", name: "Bradesco", logo: getBankLogoUrl("Bradesco", "brasil") },
    { id: "4", name: "Santander Brasil", logo: getBankLogoUrl("Santander Brasil", "brasil") },
    { id: "5", name: "Banco Inter", logo: getBankLogoUrl("Banco Inter", "brasil") },
    { id: "6", name: "Nubank", logo: getBankLogoUrl("Nubank", "brasil") },
  ],
  colombia: [
    { id: "1", name: "Bancolombia", logo: getBankLogoUrl("Bancolombia", "colombia") },
    { id: "2", name: "Banco de Bogotá", logo: getBankLogoUrl("Banco de Bogotá", "colombia") },
    { id: "3", name: "Davivienda", logo: getBankLogoUrl("Davivienda", "colombia") },
    { id: "4", name: "Banco Popular", logo: getBankLogoUrl("Banco Popular", "colombia") },
    { id: "5", name: "BBVA Colombia", logo: getBankLogoUrl("BBVA Colombia", "colombia") },
    { id: "6", name: "Banco de Occidente", logo: getBankLogoUrl("Banco de Occidente", "colombia") },
  ],
  estados_unidos: [
    { id: "1", name: "Chase Bank", logo: getBankLogoUrl("Chase Bank", "estados_unidos") },
    { id: "2", name: "Bank of America", logo: getBankLogoUrl("Bank of America", "estados_unidos") },
    { id: "3", name: "Wells Fargo", logo: getBankLogoUrl("Wells Fargo", "estados_unidos") },
    { id: "4", name: "Citibank", logo: getBankLogoUrl("Citibank", "estados_unidos") },
    { id: "5", name: "US Bank", logo: getBankLogoUrl("US Bank", "estados_unidos") },
    { id: "6", name: "PNC Bank", logo: getBankLogoUrl("PNC Bank", "estados_unidos") },
  ],
};

// Bank Logo Component with fallback
function BankLogo({ bank, className }: { bank: Bank; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultSize = "h-12 w-12";
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset states when logo changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [bank.logo]);

  // Check if image is already loaded after mount
  useEffect(() => {
    if (bank.logo && imgRef.current) {
      const img = imgRef.current;
      // Check if image is already loaded (cached)
      if (img.complete && img.naturalHeight !== 0 && !imageError) {
        setImageLoaded(true);
      }
    }
  }, [bank.logo, imageError]);

  if (!bank.logo || imageError) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3", className || defaultSize)}>
        <span className="text-lg font-bold text-primary">
          {bank.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center rounded-lg bg-white dark:bg-dark-3 overflow-hidden p-2", className || defaultSize)}>
      <img
        ref={imgRef}
        src={bank.logo}
        alt={bank.name}
        className="h-full w-full object-contain"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
      />
    </div>
  );
}

type Screen = "banks" | "credentials" | "loading" | "success" | "wallet" | "deposit";

export function BankAccountPreviewPanel({ country, viewMode = "mobile", onViewModeChange, onBankSelected, branding }: BankAccountPreviewPanelProps) {
    const { language } = useLanguage();
    const t = connectTranslations[language];
    
    // Get current branding based on dark mode
    const currentBranding = branding || { customColorTheme: "#3C50E0" };
  const [searchQuery, setSearchQuery] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("banks");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [activeBankCard, setActiveBankCard] = useState<number>(0); // Estado para la tarjeta activa de bancos
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<BankAccount | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  // Helper functions for theme colors (similar to identity)
  const themeColor = currentBranding.customColorTheme || "#3C50E0";
  
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '60, 80, 224';
  };

  const darkenColor = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, ((num >> 16) & 0xFF) - amount);
    const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
    const b = Math.max(0, (num & 0xFF) - amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const lightenColor = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, ((num >> 16) & 0xFF) + amount);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
    const b = Math.min(255, (num & 0xFF) + amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const darkThemeColor = darkenColor(themeColor, 30);
  const almostBlackColor = darkenColor(themeColor, 80);
  const blackColor = darkenColor(themeColor, 100);

  // Add CSS animations
  useEffect(() => {
    const styleId = 'bank-account-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes loadingPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes successScale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes balanceUpdate {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
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

  const banksData = banksByCountry[country];
  const isComingSoon = banksData === "coming_soon" || country === "ecuador";
  const banks = isComingSoon && country !== "ecuador" ? [] : (banksData === "coming_soon" ? [] : banksData);

  const filteredBanks = useMemo(() => {
    if (isComingSoon && country !== "ecuador") return [];
    if (!searchQuery.trim()) {
      return banks;
    }
    const query = searchQuery.toLowerCase();
    return banks.filter((bank) => bank.name.toLowerCase().includes(query));
  }, [banks, searchQuery, isComingSoon, country]);

  // Reset screen when country changes
  useEffect(() => {
    setCurrentScreen("banks");
    setSelectedBank(null);
    setActiveBankCard(0);
    setUsername("");
    setPassword("");
    setSearchQuery("");
    setWalletBalance(0);
    setSelectedAccountForDeposit(null);
    setDepositAmount("");
    onBankSelected?.(false);
  }, [country, onBankSelected]);

  // Reset activeBankCard when filtered banks change
  useEffect(() => {
    if (filteredBanks.length > 0 && activeBankCard >= filteredBanks.length) {
      setActiveBankCard(0);
      setSelectedBank(null);
    }
  }, [filteredBanks.length, activeBankCard]);

  const handleBankSelect = (bank: Bank) => {
    // Don't allow selection if coming soon
    if (country === "ecuador") {
      return;
    }
    setSelectedBank(bank);
    setCurrentScreen("credentials");
    onBankSelected?.(true);
  };

  const handleLogin = () => {
    setCurrentScreen("loading");
    // Simulate loading animation
    setTimeout(() => {
      setCurrentScreen("success");
      setTimeout(() => {
        setCurrentScreen("wallet");
      }, 2000);
    }, 3000);
  };

  const handleDeposit = () => {
    if (!selectedAccountForDeposit || !depositAmount) return;
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setWalletBalance(prev => prev + amount);
      setDepositAmount("");
      setSelectedAccountForDeposit(null);
      setCurrentScreen("wallet");
    }
  };

  // Render credentials screen
  const renderCredentialsScreen = () => {
    // SVG geométrico (forma organica2.svg) adaptado al customColorTheme
    const GeometricSVG = () => {
      const lightThemeColor = lightenColor(themeColor, 0.3);
      const baseId = 'connect-credentials';

      return (
        <div className="flex justify-center py-1">
          <svg
            id={`Capa_2_${baseId}`}
            data-name="Capa 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 215.02 215.02"
            className="h-32 w-32 opacity-80"
          >
            <defs>
              <linearGradient id={`connect-gradient-${baseId}`} x1="4.35" y1="612.77" x2="210.66" y2="612.77" gradientTransform="translate(0 720.29) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={lightThemeColor} />
                <stop offset="1" stopColor={darkThemeColor} />
              </linearGradient>
              <linearGradient id={`connect-gradient-2-${baseId}`} x1="5.57" y1="612.78" x2="209.46" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-3-${baseId}`} x1="20.99" y1="612.78" x2="194.05" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-4-${baseId}`} x1="0" y1="612.78" x2="215.02" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-5-${baseId}`} x1="17.91" y1="612.78" x2="197.11" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-6-${baseId}`} x1="7.41" y1="612.77" x2="207.62" y2="612.77" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-7-${baseId}`} x1="2.97" y1="612.78" x2="212.04" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-8-${baseId}`} x1="26.88" y1="612.78" x2="188.15" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-9-${baseId}`} x1=".65" y1="612.78" x2="214.38" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-10-${baseId}`} x1="13.07" y1="612.77" x2="201.95" y2="612.77" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-11-${baseId}`} x1="11.2" y1="612.78" x2="203.81" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-12-${baseId}`} x1="1.17" y1="612.78" x2="213.84" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-13-${baseId}`} x1="29.6" y1="612.77" x2="185.42" y2="612.77" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-14-${baseId}`} x1="2.1" y1="612.77" x2="212.92" y2="612.77" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-15-${baseId}`} x1="8.95" y1="612.78" x2="206.07" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-16-${baseId}`} x1="15.74" y1="612.78" x2="199.28" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-17-${baseId}`} x1=".19" y1="612.77" x2="214.85" y2="612.77" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-18-${baseId}`} x1="23.44" y1="612.78" x2="191.59" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-19-${baseId}`} x1="5.57" y1="612.78" x2="209.46" y2="612.78" href={`#connect-gradient-${baseId}`} />
              <linearGradient id={`connect-gradient-20-${baseId}`} x1="20.99" y1="612.78" x2="194.05" y2="612.78" href={`#connect-gradient-${baseId}`} />
            </defs>
            <g id="object">
              <g>
                <path fill={`url(#connect-gradient-9-${baseId})`} d="M77.1,210.67l-.14-.25L4.35,77.11,137.91,4.37l.14.25,72.61,133.31-133.56,72.74h0ZM5.13,77.33l72.2,132.57,132.57-72.2L137.7,5.13S5.13,77.33,5.13,77.33Z" />
                <path fill={`url(#connect-gradient-${baseId})`} d="M141.77,209.45L5.57,141.77l.13-.25L73.26,5.58l136.2,67.68-.13.25-67.56,135.94h0ZM6.33,141.52l135.18,67.18,67.18-135.18L73.51,6.34,6.33,141.52h0Z" />
                <path fill={`url(#connect-gradient-2-${baseId})`} d="M43.66,194.05l-.04-.28L20.99,43.66l150.39-22.68.04.28,22.63,150.11-150.39,22.68h0ZM21.62,44.14l22.51,149.26,149.26-22.51-22.51-149.26L21.61,44.14h.01Z" />
                <path fill={`url(#connect-gradient-5-${baseId})`} d="M104.84,215.02l-.2-.21L0,104.83,110.18,0l.2.21,104.64,109.98-110.18,104.83h0ZM.8,104.86l104.05,109.36,109.36-104.05L110.16.81.8,104.86Z" />
                <path fill={`url(#connect-gradient-6-${baseId})`} d="M166.98,197.11l-149.07-30.13L48.04,17.91l149.07,30.13-30.13,149.07ZM18.58,166.55l147.96,29.9,29.9-147.96L48.48,18.59l-29.9,147.96Z" />
                <path fill={`url(#connect-gradient-3-${baseId})`} d="M68.23,207.63l-.11-.26L7.41,68.24,146.8,7.41l.11.26,60.71,139.13-139.39,60.83h0ZM8.15,68.53l60.37,138.35,138.35-60.37L146.5,8.16,8.15,68.53Z" />
                <path fill={`url(#connect-gradient-4-${baseId})`} d="M132.75,212.05l-.24-.15L2.97,132.75,82.26,2.97l.24.15,129.54,79.15-79.29,129.78h0ZM3.75,132.57l128.81,78.7,78.7-128.81L82.45,3.76,3.75,132.57Z" />
                <path fill={`url(#connect-gradient-7-${baseId})`} d="M36.36,188.15L26.88,36.36l151.79-9.48,9.48,151.79-151.79,9.48ZM27.47,36.89l9.41,150.66,150.66-9.41-9.41-150.66L27.47,36.89Z" />
                <path fill={`url(#connect-gradient-8-${baseId})`} d="M95.48,214.38l-.18-.22L.65,95.48l.22-.18L119.55.65l.18.22,94.65,118.68-.22.18-118.68,94.65h0ZM1.44,95.57l94.12,118.01,118.01-94.12L119.45,1.45,1.44,95.57h0Z" />
                <path fill={`url(#connect-gradient-11-${baseId})`} d="M158.95,201.96l-.27-.08L13.07,158.96l.08-.27L56.07,13.08l.27.08,145.61,42.92-.08.27-42.92,145.61h0ZM13.77,158.57l144.79,42.68,42.68-144.79L56.45,13.78,13.77,158.57h0Z" />
                <path fill={`url(#connect-gradient-12-${baseId})`} d="M59.65,203.82l-.09-.27L11.2,59.66l.27-.09L155.36,11.21l.09.27,48.36,143.89-.27.09-143.89,48.36h0ZM11.92,60.01l48.09,143.09,143.09-48.09L155.01,11.92,11.92,60.01Z" />
                <path fill={`url(#connect-gradient-13-${baseId})`} d="M123.54,213.85L1.17,123.55,91.47,1.18l122.37,90.3-90.3,122.37h0ZM1.96,123.43l121.46,89.63,89.63-121.46L91.59,1.97,1.96,123.43Z" />
                <path fill={`url(#connect-gradient-14-${baseId})`} d="M181.64,185.43l-152.04-3.78v-.28l3.78-151.76,152.04,3.78v.28l-3.78,151.76h0ZM30.18,181.09l150.91,3.75,3.75-150.91-150.91-3.75-3.75,150.91Z" />
                <path fill={`url(#connect-gradient-15-${baseId})`} d="M86.21,212.93L2.1,86.22,128.81,2.11l84.11,126.71-126.71,84.11ZM2.88,86.37l83.48,125.77,125.77-83.48L128.65,2.89,2.88,86.37Z" />
                <path fill={`url(#connect-gradient-16-${baseId})`} d="M150.52,206.08l-.26-.1L8.95,150.53,64.5,8.95l.26.1,141.31,55.45-55.55,141.58ZM9.68,150.21l140.52,55.14,55.14-140.52L64.82,9.69,9.68,150.21Z" />
                <path fill={`url(#connect-gradient-19-${baseId})`} d="M51.44,199.28l-.07-.28L15.74,51.44,163.58,15.74l.07.28,35.63,147.56-147.84,35.7ZM16.43,51.86l35.43,146.74,146.74-35.43L163.17,16.43S16.43,51.86,16.43,51.86Z" />
                <path fill={`url(#connect-gradient-17-${baseId})`} d="M114.22,214.85l-.21-.19L.19,114.22l.19-.21L100.82.19l.21.19,113.82,100.44-.19.21-100.44,113.82h0ZM.98,114.17l113.19,99.88,99.88-113.19L100.86.98.98,114.17h0Z" />
                <path fill={`url(#connect-gradient-18-${baseId})`} d="M174.57,191.59l-151.13-17.02.03-.28L40.46,23.44l151.13,17.02-.03.28-16.99,150.85ZM24.06,174.07l150,16.89,16.89-150L40.95,24.07l-16.89,150Z" />
                <path fill={`url(#connect-gradient-9-${baseId})`} d="M77.1,210.67l-.14-.25L4.35,77.11,137.91,4.37l.14.25,72.61,133.31-133.56,72.74h0ZM5.13,77.33l72.2,132.57,132.57-72.2L137.7,5.13S5.13,77.33,5.13,77.33Z" />
                <path fill={`url(#connect-gradient-${baseId})`} d="M141.77,209.45L5.57,141.77l.13-.25L73.26,5.58l136.2,67.68-.13.25-67.56,135.94h0ZM6.33,141.52l135.18,67.18,67.18-135.18L73.51,6.34,6.33,141.52h0Z" />
                <path fill={`url(#connect-gradient-2-${baseId})`} d="M43.66,194.05l-.04-.28L20.99,43.66l150.39-22.68.04.28,22.63,150.11-150.39,22.68h0ZM21.62,44.14l22.51,149.26,149.26-22.51-22.51-149.26L21.61,44.14h.01Z" />
              </g>
            </g>
          </svg>
        </div>
      );
    };

    return (
      <div className="flex h-full flex-col overflow-y-auto">
        {/* SVG Geométrico */}
        <div className="relative flex-shrink-0 z-0 mb-2">
          <GeometricSVG />
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 flex-1 flex flex-col px-6 pb-4 min-h-0">
          {/* Título del banco */}
          <div className="text-center mb-1">
            <h2 className="text-lg font-bold" style={{ color: themeColor }}>
              {selectedBank?.name || "BBVA México"}
            </h2>
          </div>

          {/* Subtítulo */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.credentials.prompt}
            </p>
          </div>

          {/* Formulario */}
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900 dark:text-white">
                {t.credentials.usernameLabel}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.credentials.usernamePlaceholder}
                className="block w-full rounded-lg border border-stroke bg-white py-2.5 px-4 text-sm text-dark placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900 dark:text-white">
                {t.credentials.passwordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.credentials.passwordPlaceholder}
                className="block w-full rounded-lg border border-stroke bg-white py-2.5 px-4 text-sm text-dark placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            {/* Botón Login */}
            <div className="mt-2 pb-2">
              <button
                onClick={handleLogin}
                disabled={!username || !password}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{t.credentials.loginButton}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render loading screen
  const renderLoadingScreen = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        {/* Contenido pendiente */}
      </div>
    );
  };

  // Render success screen
  const renderSuccessScreen = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        {/* Contenido pendiente */}
      </div>
    );
  };

  // Render wallet screen
  const renderWalletScreen = () => {
    return (
      <div className="flex h-full flex-col px-6 py-6">
        {/* Contenido pendiente */}
      </div>
    );
  };

  // Render deposit screen
  const renderDepositScreen = () => {
    return (
      <div className="flex h-full flex-col px-6 py-6">
        {/* Contenido pendiente */}
      </div>
    );
  };

  // Render banks list screen
  const renderBanksScreen = () => {
    // Configuración compartida para tarjetas verticales
    const VERTICAL_CARDS_BORDER_RADIUS = {
      active: 25,
      inactive: 16,
    };

    // Inicializar activeBankCard si es null
    if (filteredBanks.length > 0 && activeBankCard >= filteredBanks.length) {
      setActiveBankCard(0);
    }

    return (
      <div className="flex h-full flex-col px-6 py-6">
        {/* Título */}
        <div className="mb-2 text-center">
          <h2 className="mb-1 text-sm font-bold" style={{ color: themeColor }}>
            {language === "es" ? "Vinculación de cuenta bancaria" : "Bank Account Linking"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === "es" ? "Vamos a vincular tu cuenta" : "Let's link your account"}
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border border-stroke bg-white py-3 pl-10 pr-4 text-sm text-dark placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Tarjetas de bancos - acordeón vertical con efecto de pila colapsable */}
        <div className="relative flex items-center justify-center py-2 mb-4 overflow-hidden" style={{ maxHeight: '400px', minHeight: '250px' }}>
          <div className="relative w-full" style={{ height: `${Math.max(250, Math.min(filteredBanks.length * 75, 400))}px`, overflow: 'visible', position: 'relative' }}>
            {filteredBanks.map((bank, index) => {
              const isActive = activeBankCard === index;
              const currentActive = activeBankCard;
              const isFirst = index === 0;
              const isLast = index === filteredBanks.length - 1;
              
              // Dimensiones - igual que identity
              const activeCardHeight = 75;
              const inactiveCardHeight = 60;
              const borderRadiusActive = 20;
              const borderRadiusInactive = 20;
              
              // Porcentaje de superposición - igual que identity
              const overlapPercentage = 0.3;
              const visiblePart = Math.round(inactiveCardHeight * (1 - overlapPercentage));
              const overlapAmount = inactiveCardHeight - visiblePart;

              // Calcular posición vertical - misma lógica que identity
              let topOffset = 0;
              const containerHeight = Math.min(filteredBanks.length * 75, 400);
              let centerY = (containerHeight - activeCardHeight) / 2;

              // Cuando la primera tarjeta está activa, mover todo más arriba (igual que identity)
              if (currentActive === 0) {
                centerY = (containerHeight - activeCardHeight) / 2 - 30;
              }

              if (isActive) {
                // La tarjeta activa está centrada verticalmente (o más arriba si es la primera)
                topOffset = centerY;
              } else if (index < currentActive) {
                // Tarjetas arriba de la activa - parcialmente visibles
                const cardsAbove = currentActive - index;
                topOffset = centerY - visiblePart * cardsAbove;
              } else {
                // Tarjetas abajo de la activa - parcialmente visibles
                const cardsBelow = index - currentActive;
                if (currentActive === 0) {
                  // Primera activa: controlar independientemente las tarjetas de abajo
                  if (cardsBelow === 1) {
                    topOffset = centerY + activeCardHeight - overlapAmount;
                  } else {
                    // Calcular posición acumulada
                    const firstInactiveTop = centerY + activeCardHeight - overlapAmount;
                    topOffset = firstInactiveTop + (cardsBelow - 1) * visiblePart;
                  }
                } else {
                  topOffset = centerY + activeCardHeight - overlapAmount * cardsBelow;
                }
              }

              // Z-index dinámico - igual que identity
              let zIndex = 10;
              if (isActive) {
                zIndex = 30;
              } else {
                if (currentActive === 0) {
                  zIndex = 20 - index;
                } else if (currentActive === filteredBanks.length - 1) {
                  zIndex = 20 + index;
                } else {
                  zIndex = index === 0 || index === filteredBanks.length - 1 ? 15 : 20;
                }
              }

              // Bordes redondeados - igual que identity
              let borderRadius = '0px';
              if (isActive) {
                borderRadius = `${borderRadiusActive}px`;
              } else {
                borderRadius = `${borderRadiusInactive}px`;
              }

              return (
                <div
                  key={bank.id}
                  onClick={() => {
                    setActiveBankCard(index);
                    setSelectedBank(bank);
                  }}
                  className={`absolute left-0 right-0 flex cursor-pointer items-center gap-3 transition-all duration-300 ease-in-out ${
                    isActive ? 'shadow-lg' : ''
                  }`}
                  style={{
                    ...(isActive
                      ? {
                          background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                          border: '2px solid white',
                        }
                      : {
                          backgroundColor: '#9BA2AF',
                          border: '2px solid white',
                        }
                    ),
                    top: `${topOffset}px`,
                    height: isActive ? `${activeCardHeight}px` : `${inactiveCardHeight}px`,
                    width: '100%',
                    paddingLeft: isActive ? '14px' : '0',
                    paddingRight: isActive ? '14px' : '0',
                    paddingTop: isActive ? '8px' : '0',
                    paddingBottom: isActive ? '8px' : '0',
                    justifyContent: isActive ? 'flex-start' : 'center',
                    zIndex: zIndex,
                    borderRadius: borderRadius,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  {/* Cuadrado interno con esquinas redondeadas - solo visible cuando está activa */}
                  {isActive && (
                    <div className="flex shrink-0 items-center justify-center rounded-lg bg-white p-1.5" style={{ width: '38px', height: '38px' }}>
                      {bank.logo ? (
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-lg font-bold" style={{ color: themeColor }}>
                          {bank.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Nombre del banco */}
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-sm leading-tight text-white ${isActive ? 'font-bold' : 'font-medium'}`}>
                      {bank.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón Continuar */}
        <div className="mt-auto flex justify-center pb-4">
          <button
            onClick={() => {
              if (selectedBank) {
                setCurrentScreen("credentials");
                onBankSelected?.(true);
              }
            }}
            disabled={!selectedBank}
            className="flex items-center justify-between rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
              minWidth: '200px',
              width: 'auto',
            }}
          >
            <span>{language === "es" ? "Continuar" : "Continue"}</span>
            <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render current screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case "credentials":
        return renderCredentialsScreen();
      case "loading":
        return renderLoadingScreen();
      case "success":
        return renderSuccessScreen();
      case "wallet":
        return renderWalletScreen();
      case "deposit":
        return renderDepositScreen();
      default:
        return renderBanksScreen();
    }
  };

  // Mobile Preview only
  return (
    <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">{t.mobilePreviewTitle}</h2>
      </div>
      <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
        {/* Interactive animated background with halftone dots and glow */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: '850px' }}>
          {/* Base gradient background */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)',
            }}
          ></div>

          <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
          <EdgeFadeOverlay isDarkMode={isDarkMode} />

          {/* Additional animated halftone layer for depth */}
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
        <div className="relative mx-auto max-w-[340px] z-10">
          <div className="relative overflow-hidden rounded-[3rem] border-[4px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="relative h-[680px] overflow-hidden rounded-[2.5rem] bg-white dark:bg-black m-0.5 flex flex-col">
              {/* Mobile Header - Status Bar */}
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

              {/* Header con back y logo */}
              <div className="relative mb-3 flex flex-shrink-0 items-center justify-between px-6 pt-6">
                <button 
                  onClick={() => {
                    if (currentScreen !== "banks") {
                      setCurrentScreen("banks");
                      setSelectedBank(null);
                      setUsername("");
                      setPassword("");
                      onBankSelected?.(false);
                    }
                  }}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  &lt; {language === "es" ? "atrás" : "back"}
                </button>
                {currentBranding.logo && (
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <img src={currentBranding.logo} alt="Logo" className="h-8 max-w-full object-contain" />
                  </div>
                )}
                <div className="w-12"></div> {/* Spacer para centrar el logo */}
              </div>

              {/* Content */}
              <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'thin' }}>
                {renderScreenContent()}
              </div>

              {/* Mobile Bottom Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex-shrink-0">
                <div className="h-1 w-32 rounded-full bg-black/30 dark:bg-white/30"></div>
              </div>
            </div>
            {/* Phone Frame Details */}
            <div className="absolute -left-1 top-24 h-12 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
            <div className="absolute -left-1 top-40 h-8 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
            <div className="absolute -right-1 top-32 h-10 w-1 rounded-r bg-gray-800 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

