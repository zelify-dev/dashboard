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

export function BankAccountPreviewPanel({ country, viewMode = "mobile", onViewModeChange, onBankSelected }: BankAccountPreviewPanelProps) {
    const { language } = useLanguage();
    const t = connectTranslations[language];
  const [searchQuery, setSearchQuery] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("banks");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<BankAccount | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

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

  // Reset screen when country changes
  useEffect(() => {
    setCurrentScreen("banks");
    setSelectedBank(null);
    setUsername("");
    setPassword("");
    setSearchQuery("");
    setWalletBalance(0);
    setSelectedAccountForDeposit(null);
    setDepositAmount("");
    onBankSelected?.(false);
  }, [country, onBankSelected]);

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
    if (!selectedBank) return null;

    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 flex flex-col items-center">
          {/* Bank Logo */}
          <div className="mb-4">
            <BankLogo bank={selectedBank} className="h-20 w-20" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">{selectedBank.name}</h2>
          <p className="text-center text-sm text-dark-6 dark:text-dark-6">{t.credentials.prompt}</p>
        </div>

        <div className="mb-6 w-full space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.credentials.usernameLabel}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.credentials.usernamePlaceholder}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.credentials.passwordLabel}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.credentials.passwordPlaceholder}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={!username || !password}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.credentials.loginButton}
        </button>
      </div>
    );
  };

  // Render loading screen
  const renderLoadingScreen = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 text-center">
          {/* Animated Spinner */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Pulsing rings */}
            <div
              className="absolute h-24 w-24 rounded-full border-4 border-primary/30"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            <div
              className="absolute h-24 w-24 rounded-full border-4 border-primary/20"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s',
              }}
            />
            {/* Spinning circle */}
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary" style={{ animation: 'spin 1s linear infinite' }} />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary/50" style={{ animation: 'spin 1.5s linear infinite reverse' }} />
            </div>
          </div>

          <div
            className="mb-2 text-base font-semibold text-dark dark:text-white"
            style={{
              animation: 'loadingPulse 1.5s ease-in-out infinite',
            }}
          >
            {t.loading.connecting}
          </div>
          <div
            className="text-sm text-dark-6 dark:text-dark-6"
            style={{
              animation: 'loadingPulse 1.5s ease-in-out infinite',
            }}
          >
            {t.loading.pleaseWait}
          </div>
        </div>
      </div>
    );
  };

  // Render success screen
  const renderSuccessScreen = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        <div className="mb-6">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
            style={{
              animation: 'successScale 0.8s ease-out',
            }}
          >
            <svg
              className="h-10 w-10 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <p className="text-center text-xl font-bold text-green-600 dark:text-green-400 mb-2">{t.successTitle}</p>
        <p className="text-center text-sm text-dark-6 dark:text-dark-6">{t.successDesc}</p>
      </div>
    );
  };

  // Render wallet screen
  const renderWalletScreen = () => {
    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">{t.wallet.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{t.wallet.desc}</p>
        </div>

        {/* Balance Card */}
        <div className="mb-6 rounded-xl border-2 border-stroke bg-gradient-to-br from-primary/10 to-primary/5 p-6 dark:border-dark-3 dark:from-primary/20 dark:to-primary/10">
          <p className="mb-2 text-sm font-medium text-dark-6 dark:text-dark-6">{t.wallet.totalBalanceLabel}</p>
          <p
            className="text-3xl font-bold text-dark dark:text-white"
            style={{
              animation: walletBalance > 0 ? 'balanceUpdate 0.5s ease-out' : 'none',
            }}
          >
            {walletBalance.toLocaleString('en-US', {
              style: 'currency',
              currency: country === 'mexico' ? 'MXN' : country === 'brasil' ? 'BRL' : country === 'colombia' ? 'COP' : 'USD',
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Deposit Funds Button */}
        <button
          onClick={() => setCurrentScreen("deposit")}
          className="mb-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t.wallet.depositButton}
        </button>

        {/* Connected Bank Info */}
        {selectedBank && (
          <div className="mt-auto rounded-lg border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <p className="mb-2 text-xs font-medium text-dark-6 dark:text-dark-6">{t.wallet.connectedBankLabel}</p>
            <div className="flex items-center gap-3">
              <BankLogo bank={selectedBank} className="h-10 w-10" />
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{selectedBank.name}</p>
                <p className="text-xs text-dark-6 dark:text-dark-6">{t.wallet.accountLinked}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render deposit screen
  const renderDepositScreen = () => {
    const accounts = bankAccountsByCountry[country] || [];

    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-4">
          <button
            onClick={() => {
              setCurrentScreen("wallet");
              setSelectedAccountForDeposit(null);
              setDepositAmount("");
            }}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 transition hover:text-primary dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.deposit.back}
          </button>
        </div>
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">{t.deposit.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{t.deposit.desc}</p>
        </div>

        {/* Account Selection */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-dark dark:text-white">{t.deposit.selectAccount}</label>
          <div className="space-y-3">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccountForDeposit(account)}
                className={cn(
                  "flex w-full flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all",
                  selectedAccountForDeposit?.id === account.id
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-dark-2"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-dark dark:text-white">{account.type}</p>
                    <p className="text-xs text-dark-6 dark:text-dark-6">{account.accountNumber}</p>
                  </div>
                  {account.balance && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-dark dark:text-white">{account.balance}</p>
                      <p className="text-xs text-dark-6 dark:text-dark-6">{account.currency}</p>
                    </div>
                  )}
                  {selectedAccountForDeposit?.id === account.id && (
                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.deposit.amountLabel}</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-lg font-semibold text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
          />
        </div>

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          disabled={!selectedAccountForDeposit || !depositAmount || parseFloat(depositAmount) <= 0}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.deposit.button}
        </button>
      </div>
    );
  };

  // Render banks list screen
  const renderBanksScreen = () => {
    if (isComingSoon && country !== "ecuador") {
      return (
        <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">{t.comingSoonTitle}</h2>
            <p className="text-sm text-dark-6 dark:text-dark-6">{t.comingSoonDesc}</p>
          </div>
        </div>
      );
    }

    const isEcuadorComingSoon = country === "ecuador";

    return (
      <>
        {/* Coming Soon Banner for Ecuador */}
        {isEcuadorComingSoon && (
          <div className="mb-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-3 text-center dark:bg-primary/10">
            <div className="mb-2 flex items-center justify-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-primary">{t.comingSoonTitle}</p>
            </div>
            <p className="text-xs text-dark-6 dark:text-dark-6">{t.comingSoonEcuadorDesc}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-dark-6 dark:text-dark-6"
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
              className="block w-full rounded-lg border border-stroke bg-white py-3 pl-10 pr-4 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
            />
          </div>
        </div>

        {/* Banks List */}
        <div className="space-y-3">
          {filteredBanks.length === 0 ? (
            <div className="py-8 text-center text-sm text-dark-6 dark:text-dark-6">{t.noBanksFound}</div>
          ) : (
            filteredBanks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleBankSelect(bank)}
                disabled={isEcuadorComingSoon}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border-2 border-stroke bg-white p-4 text-left transition-all dark:border-dark-3 dark:bg-dark-2",
                  isEcuadorComingSoon
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                )}
              >
                {/* Bank Logo */}
                <BankLogo bank={bank} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-dark dark:text-white">{bank.name}</p>
                </div>
                <svg
                  className={cn(
                    "h-5 w-5",
                    isEcuadorComingSoon ? "text-dark-4 dark:text-dark-4" : "text-dark-6 dark:text-dark-6"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))
          )}
        </div>
      </>
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
              {/* Mobile Header */}
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

              {/* Content */}
              <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'thin' }}>
                {currentScreen === "credentials" && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setCurrentScreen("banks");
                        setSelectedBank(null);
                        setUsername("");
                        setPassword("");
                        onBankSelected?.(false);
                      }}
                      className="flex items-center gap-2 text-sm text-dark-6 transition hover:text-primary dark:text-dark-6"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {t.backLabel}
                    </button>
                  </div>
                )}
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

