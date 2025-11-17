"use client";

import { useState, useEffect } from "react";
import { AnimatedHalftoneBackdrop, EdgeFadeOverlay } from "../../_components/shared-components";
import { cn } from "@/lib/utils";

type Screen = "start" | "info" | "coverage" | "quote" | "success";

function MobileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function WebIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const INSURANCE_TYPES = [
  { id: "auto", name: "Auto Insurance", icon: "🚗", basePrice: 120 },
  { id: "home", name: "Home Insurance", icon: "🏠", basePrice: 85 },
  { id: "health", name: "Health Insurance", icon: "🏥", basePrice: 200 },
  { id: "life", name: "Life Insurance", icon: "💼", basePrice: 150 },
];

interface InsuranceQuotePreviewPanelProps {
  viewMode: "mobile" | "web";
  onViewModeChange: (mode: "mobile" | "web") => void;
}

export function InsuranceQuotePreviewPanel({ viewMode, onViewModeChange }: InsuranceQuotePreviewPanelProps) {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    coverage: "basic",
  });
  const [quote, setQuote] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setScreen("info");
  };

  const handleGetQuote = () => {
    if (selectedType) {
      const type = INSURANCE_TYPES.find((t) => t.id === selectedType);
      const basePrice = type?.basePrice || 100;
      const ageMultiplier = parseInt(formData.age) > 50 ? 1.3 : 1.0;
      const coverageMultiplier = formData.coverage === "premium" ? 1.5 : formData.coverage === "standard" ? 1.2 : 1.0;
      const calculatedQuote = Math.round(basePrice * ageMultiplier * coverageMultiplier);
      setQuote(calculatedQuote);
      setScreen("quote");
    }
  };

  const goBack = () => {
    if (screen === "info") setScreen("start");
    else if (screen === "coverage") setScreen("info");
    else if (screen === "quote") setScreen("coverage");
    else if (screen === "success") setScreen("start");
  };

  const renderStartScreen = () => (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-6">
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", isDarkMode ? "text-white/60" : "text-gray-600")}>Insurance</p>
          <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Get a Quote</h2>
          <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>Find the perfect insurance plan for you</p>
        </div>
        <div className="space-y-3">
          {INSURANCE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:border-primary/60",
                isDarkMode 
                  ? "border-white/10 bg-black/30" 
                  : "border-gray-200 bg-white/80"
              )}
            >
              <div className="text-3xl">{type.icon}</div>
              <div className="flex-1">
                <p className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>{type.name}</p>
                <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>Starting at ${type.basePrice}/month</p>
              </div>
              <svg className={cn("h-5 w-5", isDarkMode ? "text-white/40" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInfoScreen = () => {
    const type = INSURANCE_TYPES.find((t) => t.id === selectedType);
    return (
      <div className="flex h-full flex-col p-6">
        <button onClick={goBack} className={cn("mb-4 text-sm", isDarkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
          ← Back
        </button>
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4 text-5xl">{type?.icon}</div>
            <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>{type?.name}</h2>
            <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>Tell us about yourself</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className={cn("mb-2 block text-xs", isDarkMode ? "text-white/50" : "text-gray-500")}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 focus:border-primary focus:outline-none",
                  isDarkMode 
                    ? "border-white/10 bg-black/30 text-white placeholder-white/30"
                    : "border-gray-200 bg-white text-gray-900 placeholder-gray-400"
                )}
              />
            </div>
            <div>
              <label className={cn("mb-2 block text-xs", isDarkMode ? "text-white/50" : "text-gray-500")}>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="30"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 focus:border-primary focus:outline-none",
                  isDarkMode 
                    ? "border-white/10 bg-black/30 text-white placeholder-white/30"
                    : "border-gray-200 bg-white text-gray-900 placeholder-gray-400"
                )}
              />
            </div>
          </div>
          <button
            onClick={() => setScreen("coverage")}
            disabled={!formData.name || !formData.age}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderCoverageScreen = () => (
    <div className="flex h-full flex-col p-6">
      <button onClick={goBack} className={cn("mb-4 text-sm", isDarkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
        ← Back
      </button>
      <div className="space-y-6">
        <div>
          <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Select Coverage</h2>
          <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>Choose the level of protection</p>
        </div>
        <div className="space-y-3">
          {[
            { id: "basic", name: "Basic", price: "Base", desc: "Essential coverage" },
            { id: "standard", name: "Standard", price: "+20%", desc: "Enhanced protection" },
            { id: "premium", name: "Premium", price: "+50%", desc: "Comprehensive coverage" },
          ].map((coverage) => (
            <button
              key={coverage.id}
              onClick={() => {
                setFormData({ ...formData, coverage: coverage.id });
                handleGetQuote();
              }}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition",
                formData.coverage === coverage.id
                  ? "border-primary bg-primary/20"
                  : isDarkMode
                    ? "border-white/10 bg-black/30 hover:border-primary/60"
                    : "border-gray-200 bg-white/80 hover:border-primary/60"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>{coverage.name}</p>
                  <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>{coverage.desc}</p>
                </div>
                <p className="text-sm font-semibold text-primary">{coverage.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuoteScreen = () => {
    const type = INSURANCE_TYPES.find((t) => t.id === selectedType);
    return (
      <div className="flex h-full flex-col p-6">
        <button onClick={goBack} className={cn("mb-4 text-sm", isDarkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
          ← Back
        </button>
        <div className="flex h-full flex-col justify-center space-y-6">
          <div className="text-center">
            <div className="mb-4 text-5xl">{type?.icon}</div>
            <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Your Quote</h2>
            <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>Personalized for {formData.name}</p>
          </div>
          <div className={cn(
            "space-y-4 rounded-2xl border p-6",
            isDarkMode 
              ? "border-white/10 bg-black/30"
              : "border-gray-200 bg-white/80"
          )}>
            <div className="text-center">
              <p className={cn("text-xs", isDarkMode ? "text-white/50" : "text-gray-500")}>Monthly Premium</p>
              <p className={cn("text-4xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>${quote}</p>
              <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>per month</p>
            </div>
            <div className={cn("space-y-2 border-t pt-4", isDarkMode ? "border-white/10" : "border-gray-200")}>
              <div className="flex justify-between text-sm">
                <span className={cn(isDarkMode ? "text-white/60" : "text-gray-600")}>Coverage Type</span>
                <span className={cn(isDarkMode ? "text-white" : "text-gray-900")}>{formData.coverage.charAt(0).toUpperCase() + formData.coverage.slice(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={cn(isDarkMode ? "text-white/60" : "text-gray-600")}>Age</span>
                <span className={cn(isDarkMode ? "text-white" : "text-gray-900")}>{formData.age} years</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setScreen("success")}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Accept Quote
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessScreen = () => (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-400/30 text-green-300">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Quote Accepted!</h2>
        <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>Your insurance application is being processed</p>
      </div>
      <button
        onClick={goBack}
        className={cn(
          "rounded-2xl border px-4 py-2 text-sm font-medium transition",
          isDarkMode 
            ? "border-white/30 text-white hover:border-white"
            : "border-gray-300 text-gray-900 hover:border-gray-400"
        )}
      >
        Get Another Quote
      </button>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case "info":
        return renderInfoScreen();
      case "coverage":
        return renderCoverageScreen();
      case "quote":
        return renderQuoteScreen();
      case "success":
        return renderSuccessScreen();
      default:
        return renderStartScreen();
    }
  };

  if (viewMode === "web") {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">Web Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange("mobile")}
              className="rounded-lg p-2 transition bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-gray-400"
            >
              <MobileIcon />
            </button>
            <button
              onClick={() => onViewModeChange("web")}
              className="rounded-lg p-2 transition bg-primary text-white"
            >
              <WebIcon />
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-stroke bg-gray-50 p-8 dark:border-dark-3 dark:bg-dark-3">
          <div className="mx-auto max-w-2xl">{renderScreen()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-dark dark:text-white">Mobile Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange("mobile")}
            className="rounded-lg p-2 transition bg-primary text-white"
          >
            <MobileIcon />
          </button>
          <button
            onClick={() => onViewModeChange("web")}
            className="rounded-lg p-2 transition bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-gray-400"
          >
            <WebIcon />
          </button>
        </div>
      </div>
      <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
        <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: "850px" }}>
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
        </div>
        <div className="relative mx-auto max-w-[340px] z-10">
          <div className={cn(
            "relative overflow-hidden rounded-[3rem] border-[4px] shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)]",
            isDarkMode 
              ? "border-gray-800/80 bg-gray-900/95 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]"
              : "border-gray-300/80 bg-gray-100/95"
          )}>
            <div className={cn(
              "relative h-[680px] overflow-hidden rounded-[2.5rem] m-0.5 flex flex-col",
              isDarkMode 
                ? "bg-gradient-to-br from-blue-900 to-indigo-900"
                : "bg-gradient-to-br from-blue-50 to-indigo-50"
            )}>
              <div className={cn(
                "relative flex items-center justify-between px-6 pt-10 pb-2 flex-shrink-0",
                isDarkMode 
                  ? "bg-gradient-to-br from-blue-900 to-indigo-900"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50"
              )}>
                <div className="absolute left-6 top-4 flex items-center">
                  <span className={cn("text-xs font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>9:41</span>
                </div>
                <div className="absolute left-1/2 top-3 -translate-x-1/2">
                  <div className={cn("h-5 w-24 rounded-full", isDarkMode ? "bg-black" : "bg-gray-900")}></div>
                  <div className={cn("absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full", isDarkMode ? "bg-gray-800" : "bg-gray-700")}></div>
                </div>
                <div className="absolute right-6 top-4 flex items-center gap-1.5">
                  <svg className={cn("h-3 w-5", isDarkMode ? "text-white" : "text-gray-900")} fill="none" viewBox="0 0 20 12">
                    <rect x="0.5" y="4.5" width="19" height="7" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M2 1 L4 4 L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M13 1 L15 4 L18 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <svg className={cn("h-4 w-6", isDarkMode ? "text-white" : "text-gray-900")} fill="none" viewBox="0 0 24 12">
                    <rect x="2" y="4" width="20" height="8" rx="1" fill="currentColor" />
                    <rect x="4" y="6" width="2" height="4" rx="0.5" fill="white" />
                    <rect x="7" y="5" width="2" height="6" rx="0.5" fill="white" />
                    <rect x="10" y="3" width="2" height="8" rx="0.5" fill="white" />
                    <rect x="13" y="4" width="2" height="7" rx="0.5" fill="white" />
                    <rect x="16" y="6" width="2" height="5" rx="0.5" fill="white" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">{renderScreen()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

