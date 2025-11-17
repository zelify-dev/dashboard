"use client";

import { useState, useEffect } from "react";
import { AnimatedHalftoneBackdrop, EdgeFadeOverlay } from "../../_components/shared-components";
import { cn } from "@/lib/utils";

type Screen = "home" | "categories" | "details" | "contact";

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

const ASSISTANCE_CATEGORIES = [
  { id: "claims", name: "Claims", icon: "📋", description: "File and track insurance claims" },
  { id: "coverage", name: "Coverage Info", icon: "🛡️", description: "View your policy details" },
  { id: "emergency", name: "Emergency", icon: "🚨", description: "24/7 emergency assistance" },
  { id: "documents", name: "Documents", icon: "📄", description: "Access policy documents" },
];

interface InsuranceAssistancePreviewPanelProps {
  viewMode: "mobile" | "web";
  onViewModeChange: (mode: "mobile" | "web") => void;
}

export function InsuranceAssistancePreviewPanel({ viewMode, onViewModeChange }: InsuranceAssistancePreviewPanelProps) {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setScreen("details");
  };

  const goBack = () => {
    if (screen === "categories") setScreen("home");
    else if (screen === "details") setScreen("categories");
    else if (screen === "contact") setScreen("details");
  };

  const renderHomeScreen = () => (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-6">
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", isDarkMode ? "text-white/60" : "text-gray-600")}>Insurance</p>
          <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Assistance Center</h2>
          <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>Get help with your insurance needs</p>
        </div>
        <div className="space-y-3">
          {ASSISTANCE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:border-primary/60",
                isDarkMode 
                  ? "border-white/10 bg-black/30" 
                  : "border-gray-200 bg-white/80"
              )}
            >
              <div className="text-3xl">{category.icon}</div>
              <div className="flex-1">
                <p className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>{category.name}</p>
                <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>{category.description}</p>
              </div>
              <svg className={cn("h-5 w-5", isDarkMode ? "text-white/40" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setScreen("contact")}
        className={cn(
          "w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition",
          isDarkMode 
            ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
            : "border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200"
        )}
      >
        Contact Support
      </button>
    </div>
  );

  const renderDetailsScreen = () => {
    const category = ASSISTANCE_CATEGORIES.find((c) => c.id === selectedCategory);
    return (
      <div className="flex h-full flex-col p-6">
        <button onClick={goBack} className={cn("mb-4 text-sm", isDarkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
          ← Back
        </button>
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4 text-5xl">{category?.icon}</div>
            <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>{category?.name}</h2>
            <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>{category?.description}</p>
          </div>
          <div className={cn(
            "space-y-4 rounded-2xl border p-4",
            isDarkMode 
              ? "border-white/10 bg-black/30"
              : "border-gray-200 bg-white/80"
          )}>
            <div>
              <p className={cn("text-xs", isDarkMode ? "text-white/50" : "text-gray-500")}>Status</p>
              <p className={cn("text-sm font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Available 24/7</p>
            </div>
            <div>
              <p className={cn("text-xs", isDarkMode ? "text-white/50" : "text-gray-500")}>Response Time</p>
              <p className={cn("text-sm font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Within 2 hours</p>
            </div>
          </div>
          <button
            onClick={() => setScreen("contact")}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Get Assistance
          </button>
        </div>
      </div>
    );
  };

  const renderContactScreen = () => (
    <div className="flex h-full flex-col p-6">
      <button onClick={goBack} className={cn("mb-4 text-sm", isDarkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
        ← Back
      </button>
      <div className="flex h-full flex-col justify-center space-y-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-3xl">
              📞
            </div>
          </div>
          <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Contact Support</h2>
          <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-gray-600")}>We're here to help you</p>
        </div>
        <div className="space-y-3">
          <button className={cn(
            "w-full rounded-2xl border p-4 text-left transition hover:border-primary/60",
            isDarkMode 
              ? "border-white/20 bg-black/30"
              : "border-gray-200 bg-white/80"
          )}>
            <p className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Phone</p>
            <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>1-800-INSURANCE</p>
          </button>
          <button className={cn(
            "w-full rounded-2xl border p-4 text-left transition hover:border-primary/60",
            isDarkMode 
              ? "border-white/20 bg-black/30"
              : "border-gray-200 bg-white/80"
          )}>
            <p className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Email</p>
            <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>support@insurance.com</p>
          </button>
          <button className={cn(
            "w-full rounded-2xl border p-4 text-left transition hover:border-primary/60",
            isDarkMode 
              ? "border-white/20 bg-black/30"
              : "border-gray-200 bg-white/80"
          )}>
            <p className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Live Chat</p>
            <p className={cn("text-xs", isDarkMode ? "text-white/60" : "text-gray-600")}>Available now</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case "details":
        return renderDetailsScreen();
      case "contact":
        return renderContactScreen();
      default:
        return renderHomeScreen();
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
                ? "bg-gradient-to-br from-slate-900 to-slate-800"
                : "bg-gradient-to-br from-slate-50 to-white"
            )}>
              <div className={cn(
                "relative flex items-center justify-between px-6 pt-10 pb-2 flex-shrink-0",
                isDarkMode 
                  ? "bg-gradient-to-br from-slate-900 to-slate-800"
                  : "bg-gradient-to-br from-slate-50 to-white"
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
                    <rect x="4" y="6" width="2" height="4" rx="0.5" fill={isDarkMode ? "white" : "white"} />
                    <rect x="7" y="5" width="2" height="6" rx="0.5" fill={isDarkMode ? "white" : "white"} />
                    <rect x="10" y="3" width="2" height="8" rx="0.5" fill={isDarkMode ? "white" : "white"} />
                    <rect x="13" y="4" width="2" height="7" rx="0.5" fill={isDarkMode ? "white" : "white"} />
                    <rect x="16" y="6" width="2" height="5" rx="0.5" fill={isDarkMode ? "white" : "white"} />
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

