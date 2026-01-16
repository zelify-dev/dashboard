"use client";
import { useBasicServicesTranslations } from "./use-basic-services-translations";

import type { CSSProperties } from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ServiceRegion } from "./basic-services-config";

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

function DefaultServicesHeroArt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 270 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="heroFade" x1="0" y1="0" x2="0" y2="190">
          <stop offset="0" stopColor="white" stopOpacity="1" />
          <stop offset="0.62" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="heroMask">
          <rect width="270" height="190" fill="url(#heroFade)" />
        </mask>
      </defs>

      <g mask="url(#heroMask)">
        {Array.from({ length: 16 }).map((_, idx) => {
          const t = idx / 16;
          const opacity = 0.9 - t * 0.75;
          const offset = idx * 3.2;
          return (
            <path
              key={idx}
              d={`M20 ${148 - offset}
                 C 60 ${92 - offset} 120 ${66 - offset} 175 ${78 - offset}
                 C 220 ${88 - offset} 248 ${112 - offset} 255 ${148 - offset}
                 C 262 ${182 - offset} 236 ${214 - offset} 186 ${220 - offset}
                 C 128 ${228 - offset} 68 ${206 - offset} 36 ${178 - offset}
                 C 10 ${156 - offset} 6 ${154 - offset} 20 ${148 - offset}Z`}
              stroke="#0B4FB6"
              strokeWidth="1"
              opacity={opacity}
            />
          );
        })}
      </g>
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

export type ServiceCategory = "telecom" | "electricity" | "water" | "government" | "gas";

export type PaymentMethod = "reference" | "phone" | "phone-my-number";

export interface ServiceProvider {
  id: string;
  name: string;
  logo?: string; // URL or path to logo
  category: ServiceCategory;
  isPopular?: boolean;
  paymentOptions: PaymentMethod[];
}

interface ServiceAccount {
  id: string;
  type: string;
  accountNumber: string;
  balance?: string;
  currency: string;
}

interface BasicServicesPreviewPanelProps {
  region: ServiceRegion;
  viewMode?: "mobile" | "web";
  onViewModeChange?: (mode: "mobile" | "web") => void;
  onProviderSelected?: (selected: boolean) => void;
  visibleProviderIds?: string[];
  customHeroImageUrl?: string;
}

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  telecom: "Telefonía e internet",
  electricity: "Luz",
  water: "Agua",
  government: "Gobierno e impuestos",
  gas: "Gas",
};

const horizontalScrollStyle: CSSProperties = {
  WebkitOverflowScrolling: "touch",
};

const verticalScrollStyle: CSSProperties = {
  WebkitOverflowScrolling: "touch",
};

// Helper function to get provider logo URL
const getProviderLogoUrl = (providerName: string, region: ServiceRegion): string => {
  const logoMap: Record<string, string> = {
    // Ecuador
    "CNEL EP": "https://logo.clearbit.com/cnel.gob.ec",
    "CNT Corporación": "https://logo.clearbit.com/cnt.gob.ec",
    "Interagua": "https://logo.clearbit.com/interagua.com.ec",
    "ETAPA": "https://logo.clearbit.com/etapa.net.ec",
    "Empresa Eléctrica Quito": "https://logo.clearbit.com/eeq.com.ec",
    "Austrogas": "https://logo.clearbit.com/austrogas.com.ec",

    // Mexico
    "CFE": "https://logo.clearbit.com/cfe.mx",
    "Telmex": "https://logo.clearbit.com/telmex.com",
    "Telcel": "https://logo.clearbit.com/telcel.com",
    "Megacable": "https://logo.clearbit.com/megacable.com.mx",
    "Izzi": "https://logo.clearbit.com/izzi.mx",
    "Axtel": "https://logo.clearbit.com/axtel.com.mx",
    "Movistar": "https://logo.clearbit.com/movistar.es",
    "Naturgy": "https://logo.clearbit.com/naturgy.com",
    "SACMEX": "https://logo.clearbit.com/sacmex.cdmx.gob.mx",
    "Agua de Puebla": "https://logo.clearbit.com/aguasdepuebla.com",
    "SAT": "https://logo.clearbit.com/sat.gob.mx",
    "Gobierno CDMX": "https://logo.clearbit.com/cdmx.gob.mx",
    "Totalplay": "https://logo.clearbit.com/totalplay.com.mx",
    "Blue Telecomm": "https://logo.clearbit.com/bluetelecomm.com.mx",
    "SADM": "https://logo.clearbit.com/sadm.gob.mx",
    "SIAPA": "https://logo.clearbit.com/siapa.gob.mx",
    "Iberdrola México": "https://logo.clearbit.com/iberdrola.com",
    "Gobierno de Jalisco": "https://logo.clearbit.com/jalisco.gob.mx",
    "Gobierno de Hidalgo": "https://logo.clearbit.com/hidalgo.gob.mx",
    "Gas Natural Fenosa": "https://logo.clearbit.com/gasnaturalfenosa.com",

    // Brasil
    "Enel Brasil": "https://logo.clearbit.com/enel.com",
    "Vivo": "https://logo.clearbit.com/vivo.com.br",
    "Claro Brasil": "https://logo.clearbit.com/claro.com.br",
    "CEMIG": "https://logo.clearbit.com/cemig.com.br",
    "Sabesp": "https://logo.clearbit.com/sabesp.com.br",
    "Copel": "https://logo.clearbit.com/copel.com",
    "Oi": "https://logo.clearbit.com/oi.com.br",
    "TIM Brasil": "https://logo.clearbit.com/tim.com.br",
    "Light S.A.": "https://logo.clearbit.com/light.com.br",
    "Sanepar": "https://logo.clearbit.com/sanepar.com.br",

    // Colombia
    "EPM": "https://logo.clearbit.com/epm.com.co",
    "Codensa": "https://logo.clearbit.com/enel.com",
    "Emcali": "https://logo.clearbit.com/emcali.com.co",
    "TigoUNE": "https://logo.clearbit.com/tigo.com.co",
    "ETB": "https://logo.clearbit.com/etb.com",
    "Aguas de Bogotá": "https://logo.clearbit.com/acueducto.com.co",
    "Movistar Colombia": "https://logo.clearbit.com/movistar.co",
    "Claro Colombia": "https://logo.clearbit.com/claro.com.co",
    "Triple A": "https://logo.clearbit.com/triplea.com.co",
    "Air-e": "https://logo.clearbit.com/aire.com.co",

    // Estados Unidos
    "PG&E": "https://logo.clearbit.com/pge.com",
    "Duke Energy": "https://logo.clearbit.com/duke-energy.com",
    "AT&T": "https://logo.clearbit.com/att.com",
    "Verizon": "https://logo.clearbit.com/verizon.com",
    "Comcast": "https://logo.clearbit.com/comcast.com",
    "Spectrum": "https://logo.clearbit.com/spectrum.com",
    "LADWP": "https://logo.clearbit.com/ladwp.com",
    "IRS": "https://logo.clearbit.com/irs.gov",
    "T-Mobile": "https://logo.clearbit.com/t-mobile.com",
    "Xfinity": "https://logo.clearbit.com/xfinity.com",
    "FPL": "https://logo.clearbit.com/fpl.com",
    "Con Edison": "https://logo.clearbit.com/coned.com",
    "NYC Water": "https://logo.clearbit.com/nyc.gov",
    "Texas Gas Service": "https://logo.clearbit.com/texasgasservice.com",
  };

  return logoMap[providerName] || "";
};

// Example customer accounts by region
const serviceAccountsByRegion: Record<ServiceRegion, ServiceAccount[]> = {
  ecuador: [
    { id: "1", type: "Electricidad", accountNumber: "Contrato CNEL 001234", balance: "$65.40", currency: "USD" },
    { id: "2", type: "Agua potable", accountNumber: "Interagua 567890", balance: "$24.10", currency: "USD" },
  ],
  mexico: [
    { id: "1", type: "Electricidad", accountNumber: "CFE - 1234567890", balance: "$650.55", currency: "MXN" },
    { id: "2", type: "Internet", accountNumber: "Telmex - 908172", balance: "$499.00", currency: "MXN" },
  ],
  brasil: [
    { id: "1", type: "Energía", accountNumber: "Enel - 778899", balance: "R$ 245.80", currency: "BRL" },
    { id: "2", type: "Agua", accountNumber: "Sabesp - 445566", balance: "R$ 110.25", currency: "BRL" },
  ],
  colombia: [
    { id: "1", type: "Energía", accountNumber: "EPM - 223344", balance: "$185,400", currency: "COP" },
    { id: "2", type: "Internet", accountNumber: "TigoUNE - 778899", balance: "$95,990", currency: "COP" },
  ],
  estados_unidos: [
    { id: "1", type: "Electric", accountNumber: "PG&E - 12121", balance: "$84.62", currency: "USD" },
    { id: "2", type: "Cable & Internet", accountNumber: "Comcast - 776655", balance: "$129.00", currency: "USD" },
  ],
};

const currencyByRegion: Record<ServiceRegion, string> = {
  mexico: "MXN",
  brasil: "BRL",
  colombia: "COP",
  ecuador: "USD",
  estados_unidos: "USD",
};

// Basic services providers by region
const telecomOverride: PaymentMethod[] = ["phone-my-number", "phone"];
const autoLinkRegions: ServiceRegion[] = ["mexico", "brasil", "estados_unidos"];
const favoritesByRegion: Record<ServiceRegion, string[]> = {
  mexico: ["mx-pop-movistar", "mx-pop-cfe", "mx-tel-telmex"],
  brasil: ["br-pop-vivo", "br-tele-claro"],
  colombia: ["co-pop-movistar", "co-tele-tigo"],
  estados_unidos: ["us-pop-att", "us-tele-comcast"],
  ecuador: [],
};

export const PROVIDERS_BY_REGION: Record<ServiceRegion, ServiceProvider[] | "coming_soon"> = {
  ecuador: "coming_soon",
  mexico: [
    { id: "mx-pop-movistar", name: "Movistar", logo: getProviderLogoUrl("Movistar", "mexico"), category: "telecom", isPopular: true, paymentOptions: telecomOverride },
    { id: "mx-pop-cfe", name: "CFE", logo: getProviderLogoUrl("CFE", "mexico"), category: "electricity", isPopular: true, paymentOptions: ["reference"] },
    { id: "mx-pop-scmx", name: "SACMEX", logo: getProviderLogoUrl("SACMEX", "mexico"), category: "water", isPopular: true, paymentOptions: ["reference"] },
    { id: "mx-pop-naturgy", name: "Naturgy", logo: getProviderLogoUrl("Naturgy", "mexico"), category: "gas", isPopular: true, paymentOptions: ["reference"] },
    { id: "mx-tel-atat", name: "AT&T", logo: getProviderLogoUrl("AT&T", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-telmex", name: "Telmex", logo: getProviderLogoUrl("Telmex", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-telcel", name: "Telcel", logo: getProviderLogoUrl("Telcel", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-mega", name: "Megacable", logo: getProviderLogoUrl("Megacable", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-izzi", name: "Izzi", logo: getProviderLogoUrl("Izzi", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-axtel", name: "Axtel", logo: getProviderLogoUrl("Axtel", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-totalplay", name: "Totalplay", logo: getProviderLogoUrl("Totalplay", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-tel-blue", name: "Blue Telecomm", logo: getProviderLogoUrl("Blue Telecomm", "mexico"), category: "telecom", paymentOptions: telecomOverride },
    { id: "mx-elec-iberdrola", name: "Iberdrola México", logo: getProviderLogoUrl("Iberdrola México", "mexico"), category: "electricity", paymentOptions: ["reference"] },
    { id: "mx-water-agua", name: "Agua de Puebla", logo: getProviderLogoUrl("Agua de Puebla", "mexico"), category: "water", paymentOptions: ["reference"] },
    { id: "mx-water-sadm", name: "SADM", logo: getProviderLogoUrl("SADM", "mexico"), category: "water", paymentOptions: ["reference"] },
    { id: "mx-water-siapa", name: "SIAPA", logo: getProviderLogoUrl("SIAPA", "mexico"), category: "water", paymentOptions: ["reference"] },
    { id: "mx-gov-sat", name: "SAT", logo: getProviderLogoUrl("SAT", "mexico"), category: "government", paymentOptions: ["reference"] },
    { id: "mx-gov-cdmx", name: "Gobierno CDMX", logo: getProviderLogoUrl("Gobierno CDMX", "mexico"), category: "government", paymentOptions: ["reference"] },
    { id: "mx-gov-jalisco", name: "Gobierno de Jalisco", logo: getProviderLogoUrl("Gobierno de Jalisco", "mexico"), category: "government", paymentOptions: ["reference"] },
    { id: "mx-gov-hidalgo", name: "Gobierno de Hidalgo", logo: getProviderLogoUrl("Gobierno de Hidalgo", "mexico"), category: "government", paymentOptions: ["reference"] },
    { id: "mx-gas-fenosa", name: "Gas Natural Fenosa", logo: getProviderLogoUrl("Gas Natural Fenosa", "mexico"), category: "gas", paymentOptions: ["reference"] },
  ],
  brasil: [
    { id: "br-pop-vivo", name: "Vivo", logo: getProviderLogoUrl("Vivo", "brasil"), category: "telecom", isPopular: true, paymentOptions: telecomOverride },
    { id: "br-pop-enel", name: "Enel Brasil", logo: getProviderLogoUrl("Enel Brasil", "brasil"), category: "electricity", isPopular: true, paymentOptions: ["reference"] },
    { id: "br-pop-sabesp", name: "Sabesp", logo: getProviderLogoUrl("Sabesp", "brasil"), category: "water", isPopular: true, paymentOptions: ["reference"] },
    { id: "br-tele-claro", name: "Claro Brasil", logo: getProviderLogoUrl("Claro Brasil", "brasil"), category: "telecom", paymentOptions: telecomOverride },
    { id: "br-tele-oi", name: "Oi", logo: getProviderLogoUrl("Oi", "brasil"), category: "telecom", paymentOptions: telecomOverride },
    { id: "br-tele-tim", name: "TIM Brasil", logo: getProviderLogoUrl("TIM Brasil", "brasil"), category: "telecom", paymentOptions: telecomOverride },
    { id: "br-elec-cemig", name: "CEMIG", logo: getProviderLogoUrl("CEMIG", "brasil"), category: "electricity", paymentOptions: ["reference"] },
    { id: "br-elec-light", name: "Light S.A.", logo: getProviderLogoUrl("Light S.A.", "brasil"), category: "electricity", paymentOptions: ["reference"] },
    { id: "br-elec-copel", name: "Copel", logo: getProviderLogoUrl("Copel", "brasil"), category: "electricity", paymentOptions: ["reference"] },
    { id: "br-water-sanepar", name: "Sanepar", logo: getProviderLogoUrl("Sanepar", "brasil"), category: "water", paymentOptions: ["reference"] },
  ],
  colombia: [
    { id: "co-pop-movistar", name: "Movistar Colombia", logo: getProviderLogoUrl("Movistar Colombia", "colombia"), category: "telecom", isPopular: true, paymentOptions: telecomOverride },
    { id: "co-pop-epm", name: "EPM", logo: getProviderLogoUrl("EPM", "colombia"), category: "electricity", isPopular: true, paymentOptions: ["reference"] },
    { id: "co-pop-aguas", name: "Aguas de Bogotá", logo: getProviderLogoUrl("Aguas de Bogotá", "colombia"), category: "water", isPopular: true, paymentOptions: ["reference"] },
    { id: "co-tele-tigo", name: "TigoUNE", logo: getProviderLogoUrl("TigoUNE", "colombia"), category: "telecom", paymentOptions: telecomOverride },
    { id: "co-tele-etb", name: "ETB", logo: getProviderLogoUrl("ETB", "colombia"), category: "telecom", paymentOptions: telecomOverride },
    { id: "co-tele-claro", name: "Claro Colombia", logo: getProviderLogoUrl("Claro Colombia", "colombia"), category: "telecom", paymentOptions: telecomOverride },
    { id: "co-elec-codensa", name: "Codensa", logo: getProviderLogoUrl("Codensa", "colombia"), category: "electricity", paymentOptions: ["reference"] },
    { id: "co-elec-aire", name: "Air-e", logo: getProviderLogoUrl("Air-e", "colombia"), category: "electricity", paymentOptions: ["reference"] },
    { id: "co-water-triplea", name: "Triple A", logo: getProviderLogoUrl("Triple A", "colombia"), category: "water", paymentOptions: ["reference"] },
  ],
  estados_unidos: [
    { id: "us-pop-att", name: "AT&T", logo: getProviderLogoUrl("AT&T", "estados_unidos"), category: "telecom", isPopular: true, paymentOptions: telecomOverride },
    { id: "us-pop-verizon", name: "Verizon", logo: getProviderLogoUrl("Verizon", "estados_unidos"), category: "telecom", isPopular: true, paymentOptions: telecomOverride },
    { id: "us-pop-pge", name: "PG&E", logo: getProviderLogoUrl("PG&E", "estados_unidos"), category: "electricity", isPopular: true, paymentOptions: ["reference"] },
    { id: "us-pop-ladwp", name: "LADWP", logo: getProviderLogoUrl("LADWP", "estados_unidos"), category: "water", isPopular: true, paymentOptions: ["reference"] },
    { id: "us-tele-comcast", name: "Comcast", logo: getProviderLogoUrl("Comcast", "estados_unidos"), category: "telecom", paymentOptions: telecomOverride },
    { id: "us-tele-spectrum", name: "Spectrum", logo: getProviderLogoUrl("Spectrum", "estados_unidos"), category: "telecom", paymentOptions: telecomOverride },
    { id: "us-tele-tmobile", name: "T-Mobile", logo: getProviderLogoUrl("T-Mobile", "estados_unidos"), category: "telecom", paymentOptions: telecomOverride },
    { id: "us-tele-xfinity", name: "Xfinity", logo: getProviderLogoUrl("Xfinity", "estados_unidos"), category: "telecom", paymentOptions: telecomOverride },
    { id: "us-elec-duke", name: "Duke Energy", logo: getProviderLogoUrl("Duke Energy", "estados_unidos"), category: "electricity", paymentOptions: ["reference"] },
    { id: "us-elec-fpl", name: "FPL", logo: getProviderLogoUrl("FPL", "estados_unidos"), category: "electricity", paymentOptions: ["reference"] },
    { id: "us-elec-coned", name: "Con Edison", logo: getProviderLogoUrl("Con Edison", "estados_unidos"), category: "electricity", paymentOptions: ["reference"] },
    { id: "us-water-nyc", name: "NYC Water", logo: getProviderLogoUrl("NYC Water", "estados_unidos"), category: "water", paymentOptions: ["reference"] },
    { id: "us-gov-irs", name: "IRS", logo: getProviderLogoUrl("IRS", "estados_unidos"), category: "government", paymentOptions: ["reference"] },
    { id: "us-gas-texas", name: "Texas Gas Service", logo: getProviderLogoUrl("Texas Gas Service", "estados_unidos"), category: "gas", paymentOptions: ["reference"] },
  ],
};

type PaymentOptionConfig = { title: string; description: string; label: string; placeholder: string; skipInput?: boolean };

const paymentMethodDetails: Record<PaymentMethod, PaymentOptionConfig> = {
  reference: {
    title: "Número de referencia",
    description: "Ingresa el número de referencia proporcionado por el servicio.",
    label: "Número de referencia",
    placeholder: "Ej. 1234 5678 90",
  },
  phone: {
    title: "Ingresar número de teléfono",
    description: "Ingresa el número telefónico asociado a la cuenta.",
    label: "Número telefónico",
    placeholder: "+52 55 1234 5678",
  },
  "phone-my-number": {
    title: "Mi número de teléfono",
    description: "Usa tu número registrado para la línea.",
    label: "Número de teléfono",
    placeholder: "Mi número",
    skipInput: true,
  },
};

// Provider Logo Component with fallback
function ProviderLogo({ provider, className }: { provider: ServiceProvider; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultSize = "h-14 w-14";
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset states when logo changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [provider.logo]);

  // Check if image is already loaded after mount
  useEffect(() => {
    if (provider.logo && imgRef.current) {
      const img = imgRef.current;
      // Check if image is already loaded (cached)
      if (img.complete && img.naturalHeight !== 0 && !imageError) {
        setImageLoaded(true);
      }
    }
  }, [provider.logo, imageError]);

  const wrapperClasses = cn(
    "relative flex shrink-0 items-center justify-center rounded-full border border-stroke bg-white text-primary shadow-sm dark:border-dark-3 dark:bg-dark-2",
    className || defaultSize
  );

  if (!provider.logo || imageError) {
    return (
      <div className={wrapperClasses}>
        <span className="text-lg font-bold">
          {provider.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <img
        ref={imgRef}
        src={provider.logo}
        alt={provider.name}
        className="h-10 w-10 object-contain"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
      />
    </div>
  );
}

type Screen = "providers" | "payment" | "summary" | "credentials" | "loading" | "invoice" | "success" | "wallet" | "deposit";

export function BasicServicesPreviewPanel({
  region,
  viewMode = "mobile",
  onViewModeChange,
  onProviderSelected,
  visibleProviderIds,
  customHeroImageUrl,
}: BasicServicesPreviewPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("providers");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<"popular" | "favorites" | ServiceCategory>("favorites");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<ServiceAccount | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const currencyCode = currencyByRegion[region] || "USD";
  const [pendingProvider, setPendingProvider] = useState<ServiceProvider | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentInput, setPaymentInput] = useState("");
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<"card" | "bank">("card");
  const [invoiceNumber] = useState(() => `INV-${Math.floor(Math.random() * 900000 + 100000)}`);
  const [favoriteProviderIds, setFavoriteProviderIds] = useState<string[]>(favoritesByRegion[region] || []);
  const translations = useBasicServicesTranslations();

  // Add CSS animations
  useEffect(() => {
    const styleId = 'basic-services-animations';
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

  // Reset screen when region changes
useEffect(() => {
  setCurrentScreen("providers");
  setSelectedProvider(null);
  setUsername("");
  setPassword("");
    setSearchQuery("");
    setSelectedCategoryTab("favorites");
    setWalletBalance(0);
  setSelectedAccountForDeposit(null);
  setDepositAmount("");
  setPendingProvider(null);
  setPaymentInput("");
  setSelectedPaymentMethod(null);
  setIsPaymentModalOpen(false);
  setFavoriteProviderIds(favoritesByRegion[region] || []);
  onProviderSelected?.(false);
}, [region, onProviderSelected]);

  const providersData = PROVIDERS_BY_REGION[region];
  // Treat a region as "coming_soon" only when the data is the literal string.
  // Previous code forced Ecuador to be "coming_soon" even after we added cooperatives.
  const isComingSoon = providersData === "coming_soon";
  const allProviders = providersData === "coming_soon" ? [] : (providersData as ServiceProvider[]);
  const providers =
    visibleProviderIds && visibleProviderIds.length > 0
      ? allProviders.filter((provider) => visibleProviderIds.includes(provider.id))
      : allProviders;
  const categoryOrder: ServiceCategory[] = ["telecom", "electricity", "water", "government", "gas"];

  const { popularProviders, categories, favoritesSection, searchResults, showSearchResults } = useMemo(() => {
    if (isComingSoon) {
      return {
        popularProviders: [],
        categories: [],
        favoritesSection: [],
        searchResults: [],
        showSearchResults: false,
      };
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const baseProviders = providers ?? [];
    const popular = baseProviders.filter((provider) => provider.isPopular);
    const favorites = (favoriteProviderIds || [])
      .map((id) => baseProviders.find((provider) => provider.id === id))
      .filter((provider): provider is ServiceProvider => Boolean(provider));
    const grouped = categoryOrder
      .map((category) => ({
        category,
        title: (translations.categories && translations.categories[category]) || CATEGORY_LABELS[category],
        providers: baseProviders.filter((provider) => provider.category === category),
      }))
      .filter((group) => group.providers.length > 0);

    if (!normalizedQuery) {
      return {
        popularProviders: popular,
        categories: grouped,
        favoritesSection: favorites,
        searchResults: [],
        showSearchResults: false,
      };
    }

    const filterList = (list: ServiceProvider[]) =>
      list.filter((provider) => provider.name.toLowerCase().includes(normalizedQuery));

      return {
        popularProviders: filterList(popular),
        categories: grouped.map((group) => ({
          ...group,
          providers: filterList(group.providers),
        })).filter((group) => group.providers.length > 0),
        favoritesSection: filterList(favorites),
        searchResults: filterList(baseProviders),
        showSearchResults: true,
      };
  }, [providers, searchQuery, isComingSoon, region, favoriteProviderIds]);

  const selectProviderWithMethod = (
    provider: ServiceProvider,
    method: PaymentMethod,
    options?: { skipInput?: boolean; presetValue?: string }
  ) => {
    setSelectedProvider(provider);
    setSelectedPaymentMethod(method);
    setPendingProvider(null);
    setIsPaymentModalOpen(false);

    const shouldSkipInput = options?.skipInput || method === "phone-my-number";
    const defaultValue = method === "phone-my-number" ? "+52 55 9087 2214" : "";
    const presetValue = options?.presetValue ?? defaultValue;

    if (shouldSkipInput) {
      setPaymentInput(presetValue);
      setCurrentScreen("summary");
    } else {
      setPaymentInput("");
      setCurrentScreen("payment");
    }
    onProviderSelected?.(false);
  };

  const toggleFavorite = (providerId: string) => {
    setFavoriteProviderIds((prev) =>
      prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId]
    );
  };

  const handleProviderSelect = (provider: ServiceProvider) => {
    const autoLinked =
      autoLinkRegions.includes(region) && provider.category !== "telecom";

    if (autoLinked) {
      const method = provider.paymentOptions[0] ?? "reference";
      selectProviderWithMethod(provider, method, {
        skipInput: true,
        presetValue: "ID vinculada",
      });
      return;
    }

    setPendingProvider(provider);
    setIsPaymentModalOpen(true);
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

  const handlePaymentContinue = () => {
    if (!paymentInput.trim()) return;
    setSelectedPaymentOption("card");
    setCurrentScreen("summary");
  };

  const handleSummaryConfirm = () => {
    setCurrentScreen("loading");
    setTimeout(() => {
      setCurrentScreen("invoice");
    }, 3000);
  };

  const handleFinishPayment = () => {
    setCurrentScreen("providers");
    setSelectedProvider(null);
    setSelectedPaymentMethod(null);
    setSelectedPaymentOption("card");
    setPaymentInput("");
    setPendingProvider(null);
    setIsPaymentModalOpen(false);
    setUsername("");
    setPassword("");
    onProviderSelected?.(false);
  };

  // Render credentials screen
  const renderCredentialsScreen = () => {
    if (!selectedProvider) return null;

    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 flex flex-col items-center">
          {/* Provider Logo */}
          <div className="mb-4">
            <ProviderLogo provider={selectedProvider} className="h-20 w-20" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">{selectedProvider.name}</h2>
          <p className="text-center text-sm text-dark-6 dark:text-dark-6">
            {translations.credentials.prompt}
          </p>
        </div>

        <div className="mb-6 w-full space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              {translations.credentials.usernameLabel}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={translations.credentials.usernamePlaceholder}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              {translations.credentials.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translations.credentials.passwordPlaceholder}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={!username || !password}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {translations.credentials.loginButton}
        </button>
      </div>
    );
  };

  const renderPaymentScreen = () => {
    if (!selectedProvider || !selectedPaymentMethod) return null;
    const methodCopy = (translations.paymentMethods && translations.paymentMethods[selectedPaymentMethod]) || paymentMethodDetails[selectedPaymentMethod];

    return (
      <div className="flex h-full flex-col justify-between px-6 py-3">
        <div className="space-y-3">
          <div className="text-center">
            <ProviderLogo provider={selectedProvider} className="mx-auto h-12 w-12" />
            <h2 className="mt-2 text-base font-semibold text-dark dark:text-white">{selectedProvider.name}</h2>
            <p className="text-xs text-dark-6 dark:text-dark-6">{methodCopy.description}</p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">
                {methodCopy.label}
              </label>
              <input
                type="text"
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                placeholder={methodCopy.placeholder}
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
              />
            </div>

            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-2 text-center text-xs text-dark-6 dark:border-primary/20 dark:bg-primary/10 dark:text-dark-6">
              {translations.payment.chooseMethodNote}
            </div>
          </div>
        </div>

        <button
          onClick={handlePaymentContinue}
          disabled={!paymentInput.trim()}
          className="mt-4 mb-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {translations.actions.continue}
        </button>
      </div>
    );
  };

  const renderPaymentModal = () => {
    if (!isPaymentModalOpen || !pendingProvider) return null;
    const options = pendingProvider.paymentOptions;

    return (
      <div className="pointer-events-auto absolute inset-0 z-20 flex items-end bg-black/40 px-4 pb-10 pt-20">
        <div className="w-full rounded-3xl bg-white p-6 shadow-lg dark:bg-dark-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-dark-6 dark:text-dark-6">{translations.modal.selectOption}</p>
              <h3 className="text-lg font-bold text-dark dark:text-white">{pendingProvider.name}</h3>
            </div>
            <button
              onClick={() => {
                setPendingProvider(null);
                setIsPaymentModalOpen(false);
              }}
              className="text-dark-5 transition hover:text-dark"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {options.map((option) => {
              const copy = (translations.paymentMethods && translations.paymentMethods[option]) || paymentMethodDetails[option];
              return (
                <button
                  key={option}
                  onClick={() => selectProviderWithMethod(pendingProvider, option)}
                  className="w-full rounded-xl border border-stroke bg-white px-4 py-3 text-left transition hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:bg-dark-2"
                >
                  <p className="text-sm font-semibold text-dark dark:text-white">{copy.title}</p>
                  <p className="text-xs text-dark-6 dark:text-dark-6">{copy.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSummaryScreen = () => {
    if (!selectedProvider || !selectedPaymentMethod) return null;
    const methodCopy = (translations.paymentMethods && translations.paymentMethods[selectedPaymentMethod]) || paymentMethodDetails[selectedPaymentMethod];
    const dueDate = "15 de Octubre, 2024";

    const paymentOptions = [
      {
        id: "card",
        title: translations.paymentOptions?.card.title || "Tarjeta Visa **** 4242",
        subtitle: translations.paymentOptions?.card.subtitle || "Pago automático habilitado",
        icon: (
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <rect x="4" y="9" width="4" height="2" fill="white" />
            <circle cx="16" cy="12" r="2" fill="white" />
            <circle cx="20" cy="12" r="2" fill="white" />
          </svg>
        ),
      },
      {
        id: "bank",
        title: translations.paymentOptions?.bank.title || "Cuenta bancaria **** 8899",
        subtitle: translations.paymentOptions?.bank.subtitle || "Banco Zelify",
        icon: (
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l10 6v2H2V9l10-6z" />
            <path d="M4 11h16v9H4z" />
          </svg>
        ),
      },
    ] as const;

    return (
      <div className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-4 pb-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{translations.summary.smallLabel}</p>
              <h2 className="mt-1 text-xl font-bold text-dark dark:text-white">{translations.summary.title}</h2>
              <p className="text-xs text-dark-6 dark:text-dark-6">{translations.summary.subtitle}</p>
            </div>
            <button
              onClick={() => selectedProvider && toggleFavorite(selectedProvider.id)}
              className={cn(
                "rounded-full border border-stroke p-2 text-dark-4 transition hover:text-primary dark:border-dark-3 dark:text-gray-300",
                selectedProvider && favoriteProviderIds.includes(selectedProvider.id) && "text-red-500 border-red-200 dark:border-red-500/70 hover:text-red-500 dark:text-red-500"
              )}
              aria-label="Marcar como favorito"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill={selectedProvider && favoriteProviderIds.includes(selectedProvider.id) ? "currentColor" : "none"}
                stroke={selectedProvider && favoriteProviderIds.includes(selectedProvider.id) ? "currentColor" : "currentColor"}
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6.75-4.35-9-9.75C1.5 7.004 3.5 4.5 6.375 4.5 8.002 4.5 9.5 5.625 10.125 7.05 10.75 5.625 12.248 4.5 13.875 4.5 16.75 4.5 18.75 7.004 21 11.25 18.75 16.65 12 21 12 21z"
                />
              </svg>
            </button>
          </div>

          <div className="rounded-2xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center gap-3">
              <ProviderLogo provider={selectedProvider} className="h-12 w-12" />
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{selectedProvider.name}</p>
                <p className="text-xs text-dark-6 dark:text-dark-6">{methodCopy.title}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex items-center justify-between text-dark dark:text-white">
                <span>{translations.summary.referenceLabel}</span>
                <span className="font-semibold">{paymentInput}</span>
              </div>
              <div className="flex items-center justify-between text-dark-6 dark:text-dark-6">
                <span>{translations.summary.dueDateLabel}</span>
                <span>{dueDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="mb-2 text-sm font-semibold text-dark dark:text-white">{translations.summary.paymentMethodLabel}</p>
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedPaymentOption(option.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                    selectedPaymentOption === option.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-dark-2"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-dark dark:text-white">{option.title}</p>
                    <p className="text-xs text-dark-6 dark:text-dark-6">{option.subtitle}</p>
                  </div>
                  {selectedPaymentOption === option.id && (
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentScreen("payment")}
            className="w-1/3 rounded-lg border border-stroke px-4 py-3 text-sm font-medium text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
          >
            {translations.actions.edit}
          </button>
          <button
            onClick={handleSummaryConfirm}
            className="w-2/3 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {translations.actions.confirm}
          </button>
        </div>
      </div>
    );
  };

  const renderInvoiceScreen = () => {
    if (!selectedProvider || !selectedPaymentMethod) return null;
    const methodCopy = (translations.paymentMethods && translations.paymentMethods[selectedPaymentMethod]) || paymentMethodDetails[selectedPaymentMethod];
    const dueDate = "15 de Octubre, 2024";
    const amount = "$1,245.80";
    const paymentLabel = selectedPaymentOption === "card" ? "Tarjeta Visa **** 4242" : "Cuenta bancaria **** 8899";

    return (
      <div className="flex h-full flex-col px-6 py-4">
        <div className="flex flex-1 flex-col gap-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark dark:text-white">{translations.invoice.processedTitle}</h2>
            <p className="text-xs text-dark-6 dark:text-dark-6">{translations.invoice.processedDesc}</p>
          </div>

          <div className="rounded-2xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between text-xs text-dark-6 dark:text-dark-6">
              <span>{translations.invoice.invoiceLabel}</span>
              <span className="font-semibold text-dark dark:text-white">{invoiceNumber}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-dark-6 dark:text-dark-6">
              <span>{translations.invoice.dueDateLabel}</span>
              <span>{dueDate}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-3 flex items-center gap-3">
              <ProviderLogo provider={selectedProvider} className="h-12 w-12" />
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{selectedProvider.name}</p>
                <p className="text-xs text-dark-6 dark:text-dark-6">{methodCopy.title}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between text-dark dark:text-white">
                <span>{translations.summary.referenceLabel}</span>
                <span className="font-semibold">{paymentInput}</span>
              </div>
              <div className="flex items-center justify-between text-dark dark:text-white">
                <span>{translations.invoice.paymentMethodLabel}</span>
                <span>{paymentLabel}</span>
              </div>
              <div className="flex items-center justify-between text-dark-6 dark:text-dark-6">
                <span>{translations.invoice.amountLabel}</span>
                <span className="text-lg font-bold text-dark dark:text-white">{amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="flex gap-3">
            <button
              className="flex w-1/2 items-center justify-center gap-2 rounded-lg border border-stroke px-4 py-3 text-sm font-medium text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="6" cy="12" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="18" cy="18" r="2" />
                <path d="M7.8 10.9l8.4-3.8M7.8 13.1l8.4 3.8" strokeLinecap="round" />
              </svg>
              {translations.actions.share}
            </button>
            <button
              onClick={handleFinishPayment}
              className="w-1/2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {translations.actions.finish}
            </button>
          </div>
          <button
            onClick={handleFinishPayment}
            className="w-full text-sm text-dark-6 underline-offset-4 transition hover:text-primary dark:text-dark-6"
          >
            {translations.actions.returnToList}
          </button>
        </div>
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
            {translations.loading.processing}
          </div>
          <div
            className="text-sm text-dark-6 dark:text-dark-6"
            style={{
              animation: 'loadingPulse 1.5s ease-in-out infinite',
            }}
          >
            {translations.loading.waiting}
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
        <p className="text-center text-xl font-bold text-green-600 dark:text-green-400 mb-2">
          {translations.success.title}
        </p>
        <p className="text-center text-sm text-dark-6 dark:text-dark-6">
          {translations.success.subtitle}
        </p>
      </div>
    );
  };

  // Render wallet screen
  const renderWalletScreen = () => {
    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">{translations.wallet.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {translations.wallet.desc}
          </p>
        </div>

        {/* Balance Card */}
        <div className="mb-6 rounded-xl border-2 border-stroke bg-gradient-to-br from-primary/10 to-primary/5 p-6 dark:border-dark-3 dark:from-primary/20 dark:to-primary/10">
          <p className="mb-2 text-sm font-medium text-dark-6 dark:text-dark-6">{translations.wallet.totalBalanceLabel}</p>
          <p
            className="text-3xl font-bold text-dark dark:text-white"
            style={{
              animation: walletBalance > 0 ? 'balanceUpdate 0.5s ease-out' : 'none',
            }}
          >
            {walletBalance.toLocaleString('en-US', {
              style: 'currency',
              currency: currencyCode,
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Deposit Funds Button */}
        <button
          onClick={() => setCurrentScreen("deposit")}
          className="mb-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {translations.wallet.depositButton}
        </button>

        {/* Connected provider info */}
        {selectedProvider && (
          <div className="mt-auto rounded-lg border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <p className="mb-2 text-xs font-medium text-dark-6 dark:text-dark-6">{translations.wallet.connectedServiceLabel}</p>
            <div className="flex items-center gap-3">
              <ProviderLogo provider={selectedProvider} className="h-10 w-10" />
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{selectedProvider.name}</p>
                <p className="text-xs text-dark-6 dark:text-dark-6">{translations.wallet.accountLinkedLabel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render deposit screen
  const renderDepositScreen = () => {
    const accounts = serviceAccountsByRegion[region] || [];

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
            {translations.backLabel}
          </button>
        </div>
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">{translations.deposit.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {translations.deposit.desc}
          </p>
        </div>

        {/* Account Selection */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
            {translations.deposit.selectAccountLabel}
          </label>
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
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            {translations.deposit.amountLabel}
          </label>
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
          {translations.deposit.depositButton}
        </button>
      </div>
    );
  };

  // Render providers list screen
  const renderProvidersScreen = () => {
    if (isComingSoon && region !== "ecuador") {
      return (
        <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">{translations.comingSoon.title}</h2>
            <p className="text-sm text-dark-6 dark:text-dark-6">
              {translations.comingSoon.description}
            </p>
          </div>
        </div>
      );
    }

    const isEcuadorComingSoon = region === "ecuador";

    const renderProviderButton = (provider: ServiceProvider) => (
      <button
        key={provider.id}
        onClick={() => handleProviderSelect(provider)}
        disabled={isEcuadorComingSoon}
        className={cn(
          "flex min-w-[96px] max-w-[96px] flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center transition-all snap-start",
          isEcuadorComingSoon
            ? "cursor-not-allowed opacity-60"
            : selectedProvider?.id === provider.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "hover:border-primary/40 hover:bg-primary/5"
        )}
        aria-label={`${translations.aria?.selectProvider} ${provider.name}`}
      >
        <ProviderLogo provider={provider} className="h-16 w-16" />
        <span className="text-xs font-semibold text-dark dark:text-white leading-tight">{provider.name}</span>
      </button>
    );

    const renderProviderRow = (list: ServiceProvider[]) => (
      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={horizontalScrollStyle}
      >
        {list.map((provider) => renderProviderButton(provider))}
      </div>
    );

    const serviceCategoryOrder: ServiceCategory[] = ["telecom", "electricity", "water", "government", "gas"];
    const providersByCategory = new Map<ServiceCategory, ServiceProvider[]>(
      categories.map((group) => [group.category, group.providers])
    );
    const telecomProviders = providersByCategory.get("telecom") ?? [];
    const categoryTabs = [
      { id: "popular" as const, label: "Most Popular", providers: popularProviders },
      { id: "favorites" as const, label: "Favoritos", providers: favoritesSection },
      { id: "telecom" as const, label: "Telecom & Internet", providers: telecomProviders },
      ...serviceCategoryOrder
        .filter((category) => category !== "telecom")
        .map((category) => ({
          id: category,
          label: (translations.categories && translations.categories[category]) || CATEGORY_LABELS[category],
          providers: providersByCategory.get(category) ?? [],
        })),
    ];
    const selectedProvidersForTab =
      categoryTabs.find((tab) => tab.id === selectedCategoryTab)?.providers ?? [];
    const displayedProvidersForTab = selectedProvidersForTab.slice(0, 4);

    const activeTabIndex = Math.max(0, categoryTabs.findIndex((tab) => tab.id === selectedCategoryTab));
    const CATEGORY_CARDS_BORDER_RADIUS = { active: 25, inactive: 16 };
    const cardOverlap = 18;
    const activeGradient = "linear-gradient(to right, #0b4fb6 0%, #072f73 40%, #031232 70%, #020812 100%)";

    const renderCategoryBadge = (id: (typeof categoryTabs)[number]["id"]) => {
      const letter = (() => {
        if (id === "favorites") return "F";
        if (id === "popular") return "P";
        if (id === "telecom") return "T";
        if (id === "electricity") return "L";
        if (id === "water") return "A";
        if (id === "government") return "G";
        if (id === "gas") return "S";
        return "•";
      })();

      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base font-semibold text-[#0b2d5a]">
          {letter}
        </div>
      );
    };

    return (
      <>
        {/* Coming Soon Banner for Ecuador */}
        {isEcuadorComingSoon && (
          <div className="mb-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-3 text-center dark:bg-primary/10">
            <div className="mb-2 flex items-center justify-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-primary">{translations.providers.comingSoonBannerTitle}</p>
            </div>
            <p className="text-xs text-dark-6 dark:text-dark-6">
              {translations.providers.comingSoonBannerDesc}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center">
          <img
            src="/images/logo/zelifyLogo_ligth.svg"
            alt="Zelify"
            className="h-9 w-auto"
          />

	          <div className="mt-6 w-full">
	            <div className="flex justify-center">
	              {customHeroImageUrl ? (
	                <img
	                  src={customHeroImageUrl}
	                  alt="Hero"
	                  className="h-[190px] w-[270px] object-contain"
	                />
	              ) : (
	                <DefaultServicesHeroArt className="h-[190px] w-[270px]" />
	              )}
	            </div>

            <div className="mt-6 text-center">
              <h2 className="text-[44px] leading-[1] tracking-tight">
                <span className="font-extrabold text-primary">Services</span>{" "}
                <span className="font-light text-primary">Payments</span>
              </h2>
              <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
                Which service would you like to pay?
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="relative w-full max-w-[280px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-6 w-6 text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search banks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-2xl border border-transparent bg-gray-200/90 py-4 pl-14 pr-4 text-sm text-dark placeholder-dark-5 shadow-sm focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                />
              </div>
            </div>

            <div className="mt-8">
              {showSearchResults ? (
                <div className="space-y-3">
                  {searchResults.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-stroke p-6 text-center text-sm text-dark-6 dark:border-dark-3 dark:text-dark-6">
                      {translations.noResults}
                    </div>
                  ) : (
                    renderProviderRow(searchResults)
                  )}
                </div>
              ) : (
                <div className="flex justify-center gap-7">
                  {displayedProvidersForTab.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider)}
                      disabled={isEcuadorComingSoon}
                      className={cn(
                        "flex w-[62px] flex-col items-center gap-2",
                        isEcuadorComingSoon && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-[#0b2d5a] text-2xl font-medium text-[#0b2d5a]">
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-dark-5 dark:text-dark-6">{provider.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-[280px]">
                <div
                  className="max-h-[260px] overflow-y-auto pb-3"
                  style={verticalScrollStyle}
                >
                  {categoryTabs.map((tab, index) => {
                    const isActive = tab.id === selectedCategoryTab;
                    const zIndex = categoryTabs.length - index;
                    const cardBorderRadius = isActive
                      ? CATEGORY_CARDS_BORDER_RADIUS.active
                      : CATEGORY_CARDS_BORDER_RADIUS.inactive;
                    const isActiveRow = index === activeTabIndex;

                    return (
                      <div
                        key={tab.id}
                        className="cursor-pointer select-none"
                        onClick={() => setSelectedCategoryTab(tab.id)}
                        style={{
                          borderRadius: `${cardBorderRadius}px`,
                          zIndex: zIndex,
                          marginTop: index === 0 ? "0px" : `-${cardOverlap}px`,
                          height: isActive ? "60px" : "65px",
                          padding: isActive ? "20px 24px" : "16px 24px",
                          backgroundColor: isActive ? undefined : "#E5E7EB",
                          color: isActive ? "white" : "#1F2937",
                          border: "5px solid #FFFFFF",
                          boxShadow: isActive
                            ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                            : "0 10px 18px -10px rgba(0, 0, 0, 0.18)",
                          transform: isActive ? "scale(1.02)" : isActiveRow ? "scale(1.01)" : "scale(1)",
                          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          ...(isActive ? { background: activeGradient } : {}),
                        }}
                      >
                        <div className="flex w-full items-center" style={{ paddingLeft: isActive ? "14px" : "0", paddingRight: "14px" }}>
                          {isActive && renderCategoryBadge(tab.id)}
                          <span
                            className={`${isActive ? "text-xs font-semibold" : "text-[10px] font-medium"}`}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "visible",
                              marginLeft: isActive ? "10px" : "0",
                              flex: "1",
                              textAlign: isActive ? "left" : "center",
                            }}
                          >
                            {tab.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render current screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case "payment":
        return renderPaymentScreen();
      case "summary":
        return renderSummaryScreen();
      case "credentials":
        return renderCredentialsScreen();
      case "invoice":
        return renderInvoiceScreen();
      case "loading":
        return renderLoadingScreen();
      case "success":
        return renderSuccessScreen();
      case "wallet":
        return renderWalletScreen();
      case "deposit":
        return renderDepositScreen();
      default:
        return renderProvidersScreen();
    }
  };

  // Mobile Preview only
  return (
    <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">{translations.previewTitle}</h2>
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
              <div className="flex-1 min-h-0 bg-white dark:bg-black px-6 py-6 relative">
                {renderPaymentModal()}
                {["payment", "summary", "credentials"].includes(currentScreen) && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        if (currentScreen === "payment") {
                          setCurrentScreen("providers");
                          setSelectedProvider(null);
                          setSelectedPaymentMethod(null);
                          setPaymentInput("");
                          onProviderSelected?.(false);
                        } else if (currentScreen === "summary") {
                          setCurrentScreen("payment");
                          setSelectedPaymentOption("card");
                        } else {
                          setCurrentScreen("summary");
                          setUsername("");
                          setPassword("");
                          onProviderSelected?.(false);
                        }
                      }}
                      className="flex items-center gap-2 text-sm text-dark-6 transition hover:text-primary dark:text-dark-6"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {translations.backLabel}
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
