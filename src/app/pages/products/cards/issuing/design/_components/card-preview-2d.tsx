"use client";

import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../../_components/cards-translations";
import { CardDesignConfig } from "./card-editor";
import { useMemo } from "react";

type CardPreview2DProps = {
  config: CardDesignConfig;
};

const DEFAULT_GRADIENT = ["#111827", "#1F2937", "#0F172A"];

// Helper function to determine if background is light or dark
function isLightColor(color: string): boolean {
  // Remove # if present and handle rgb/rgba
  let hex = color.replace("#", "").trim();

  // Handle rgb/rgba format
  if (color.startsWith("rgb")) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = Number.parseInt(matches[0], 10);
      const g = Number.parseInt(matches[1], 10);
      const b = Number.parseInt(matches[2], 10);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }
    return false;
  }

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }

  // Handle 6-digit hex
  if (hex.length === 6) {
    const r = Number.parseInt(hex.substring(0, 2), 16);
    const g = Number.parseInt(hex.substring(2, 4), 16);
    const b = Number.parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  // Default to dark if can't parse
  return false;
}

function VisaLogo({ isLightBackground = false, size = "md" }: { isLightBackground?: boolean; size?: "sm" | "md" | "lg" }) {
  const height = size === "sm" ? "h-10" : size === "lg" ? "h-14" : "h-12";
  // Para fondos oscuros, invertir el color (el SVG de Visa es azul, lo hacemos blanco)
  // Para fondos claros, mantener el color original azul
  return (
    <div className="flex items-center drop-shadow-md">
      <img
        src="/visa.svg"
        alt="Visa"
        className={`${height} w-auto ${isLightBackground ? "" : "brightness-0 invert"} filter drop-shadow-lg`}
      />
    </div>
  );
}

function MastercardLogo({ isLightBackground = false, size = "md" }: { isLightBackground?: boolean; size?: "sm" | "md" | "lg" }) {
  const height = size === "sm" ? "h-10" : size === "lg" ? "h-14" : "h-12";
  return (
    <div className="flex items-center drop-shadow-md">
      <img
        src="/mastercard.svg"
        alt="Mastercard"
        className={`${height} w-auto filter drop-shadow-lg`}
      />
    </div>
  );
}

function ZelifyLogo({ isLightBackground = false }: { isLightBackground?: boolean }) {
  return (
    <div className="flex items-center">
      <img
        src="/images/logo/logo-icon.svg"
        alt="Zelify"
        className={`h-10 w-auto ${isLightBackground ? "" : "brightness-0 invert"} opacity-90`}
      />
    </div>
  );
}

export function CardPreview2D({ config }: CardPreview2DProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].issuing.editor;

  const gradientColors =
    config.gradientColors && config.gradientColors.length > 0
      ? config.gradientColors
      : DEFAULT_GRADIENT;

  const cardBackground =
    config.colorType === "solid"
      ? config.solidColor
      : `linear-gradient(135deg, ${gradientColors.join(", ")})`;

  // Determine if background is light or dark
  const isLightBg = useMemo(() => {
    if (config.colorType === "solid") {
      return isLightColor(config.solidColor);
    }
    // For gradients, check the first color
    return isLightColor(gradientColors[0] || "#111827");
  }, [config.colorType, config.solidColor, gradientColors]);

  const cardholderName =
    config.cardholderName?.trim() || "CARDHOLDER";

  const limitValue = Number.parseFloat(config.spendingLimit || "0");
  const formattedLimit = Number.isFinite(limitValue)
    ? new Intl.NumberFormat(language === "es" ? "es-ES" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(limitValue)
    : "--";

  const formattedDate = config.expirationDate
    ? new Date(`${config.expirationDate}T00:00:00`).toLocaleDateString(
      language === "es" ? "es-ES" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )
    : "--";

  const typeLabel = `${config.cardForm === "virtual" ? t.cardFormVirtual : t.cardFormPhysical} ${config.cardType === "credit" ? t.cardTypeCredit : t.cardTypeDebit
    }`;

  const intervalLabel =
    config.limitInterval === "daily"
      ? t.limitIntervalDaily
      : config.limitInterval === "weekly"
        ? t.limitIntervalWeekly
        : t.limitIntervalMonthly;

  const textColor = isLightBg ? "text-dark" : "text-white";
  const textColorMuted = isLightBg ? "text-gray-7" : "text-white/75";
  const textColorSubtle = isLightBg ? "text-gray-6" : "text-white/60";

  return (
    <div className="w-full" data-tour-id="tour-cards-preview">
      <div className="mx-auto w-full max-w-[420px]">
        <div
          className="relative aspect-[1.586/1] w-full overflow-hidden rounded-3xl p-10 shadow-[0_25px_80px_rgba(0,0,0,0.4)]"
          style={{ background: cardBackground }}
        >
          {/* Enhanced gradient overlay for depth and premium look */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/15" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-7">
            {/* Top section: Chip (Left) and Brand Logo (Right) */}
            <div className="flex items-start justify-between w-full">
              {/* Chip */}
              <div className="mt-6 ml-1">
                <div className={`relative h-10 w-14 rounded-md overflow-hidden ${isLightBg
                    ? "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 border border-gray-400/50"
                    : "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 border border-white/20"
                  }`}>
                  {/* Metallic shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10" />

                  {/* Chip contact lines */}
                  <div className="absolute inset-0 opacity-60">
                    <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-gray-600" />
                    <div className="absolute top-[40%] left-0 right-0 h-[1px] bg-gray-600" />
                    <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-gray-600" />
                    <div className="absolute top-[80%] left-0 right-0 h-[1px] bg-gray-600" />
                    <div className="absolute left-[33%] top-0 bottom-0 w-[1px] bg-gray-600" />
                    <div className="absolute right-[33%] top-0 bottom-0 w-[1px] bg-gray-600" />

                    {/* Center piece */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-3 border border-gray-600 rounded-[2px]" />
                  </div>
                </div>
              </div>

              {/* Brand Logo */}
              <div className="mt-1 mr-1">
                <ZelifyLogo isLightBackground={isLightBg} />
              </div>
            </div>

            {/* Bottom section: details */}
            <div className="flex items-end justify-between w-full mb-1">
              {/* Left side: Name and Number */}
              <div className="flex flex-col gap-1">
                {/* Cardholder name */}
                <p className={`text-sm font-medium tracking-wide uppercase ${textColor} opacity-90`}>
                  {cardholderName}
                </p>

                {/* Card number */}
                <p className={`text-base font-mono tracking-widest ${textColor} opacity-85`}>
                  **** **** **** 1234
                </p>
              </div>

              {/* Right side: Network logo */}
              <div className="flex-shrink-0 translate-y-1">
                {config.cardNetwork === "visa" ? (
                  <VisaLogo isLightBackground={isLightBg} size="lg" />
                ) : (
                  <MastercardLogo isLightBackground={isLightBg} size="lg" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-gray-3 bg-white px-5 py-4 text-sm text-dark shadow-sm dark:border-dark-3 dark:bg-dark-2 dark:text-white">
          <div className="flex items-center justify-between text-xs text-gray-6 dark:text-dark-6">
            <span>{t.previewTypeLabel}</span>
            <span className="font-medium text-dark dark:text-white">
              {typeLabel}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-6 dark:text-dark-6">
            <span>{t.previewNicknameLabel}</span>
            <span className="font-medium text-dark dark:text-white">
              {config.nickname || "--"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-6 dark:text-dark-6">
            <span>{`${t.previewLimitLabel} (${intervalLabel})`}</span>
            <span className="font-medium text-dark dark:text-white">
              {formattedLimit}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-6 dark:text-dark-6">
            <span>{t.previewExpiryLabel}</span>
            <span className="font-medium text-dark dark:text-white">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
