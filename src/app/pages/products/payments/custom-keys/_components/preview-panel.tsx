"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { CustomKeysConfig, ViewMode, CustomKeyType } from "./custom-keys-config";
import { useCustomKeysTranslations } from "./use-custom-keys-translations";

interface PreviewPanelProps {
  config: CustomKeysConfig;
  updateConfig: (updates: Partial<CustomKeysConfig>) => void;
}

type ScreenState = "dashboard" | "selection" | "confirm" | "processing" | "success";

// Animated Halftone Backdrop - same as auth for consistency
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

// Zelify Logo Component
function ZelifyLogo({ className, white = false }: { className?: string; white?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        className={cn("h-6 w-6", white ? "text-white" : "text-primary")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h6v6H4z" fill="currentColor" />
        <path d="M14 4h6v6h-6z" fill="currentColor" />
        <path d="M4 14h6v6H4z" fill="currentColor" />
        <path d="M17 14l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={cn("text-xl font-bold", white ? "text-white" : "text-primary")}>
        Zelify
      </span>
    </div>
  );
}

// Contact Avatar Component
function ContactAvatar({
  initials,
  name,
  image,
  selected = false,
  onClick
}: {
  initials: string;
  name: string;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105"
    >
      <div
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 overflow-hidden",
          selected
            ? "ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/30"
            : "border border-gray-300 bg-white"
        )}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-700">{initials}</span>
        )}
      </div>
      <span className="text-[9px] text-gray-500 text-center max-w-[45px] truncate">
        {name.split(' ')[0]}
      </span>
    </button>
  );
}

// Slide to Confirm Button Component
function SlideToConfirm({ onConfirm }: { onConfirm: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxPosition = 180;

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPos = Math.max(0, Math.min(clientX - rect.left - 28, maxPosition));
    setPosition(newPos);
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (position > maxPosition * 0.7) {
      onConfirm();
    }
    setPosition(0);
  }, [position, onConfirm]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => handleEnd();
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const themeColor = "#004492";
  const darkenColor = (color: string, amount: number = 0.3): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  const getAlmostBlackColor = (color: string): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const factor = 0.15;
    const newR = Math.max(0, Math.floor(r * factor));
    const newG = Math.max(0, Math.floor(g * factor));
    const newB = Math.max(0, Math.floor(b * factor));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  const darkThemeColor = darkenColor(themeColor, 0.4);
  const almostBlackColor = getAlmostBlackColor(themeColor);
  const blackColor = '#000000';

  return (
    <div
      ref={containerRef}
      className="relative h-12 w-full rounded-full overflow-hidden"
      style={{
        background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/60 text-xs font-medium pl-10">Slide to confirm</span>
      </div>

      <div
        className={cn(
          "absolute top-1 left-1 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform cursor-grab select-none",
          isDragging && "cursor-grabbing scale-95"
        )}
        style={{ transform: `translateX(${position}px)` }}
        onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX); }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: themeColor }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// Progress Bar Component  
function AnimatedProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth continuous animation from 0 to 100
    const duration = 2500; // 2.5 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Reset and loop
        setTimeout(() => {
          setProgress(0);
          requestAnimationFrame(animate);
        }, 200);
      }
    };
    
    const animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const translations = useCustomKeysTranslations();
  const { viewMode, currentCustomKey, currentKeyType } = config;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>("dashboard");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Contact data matching mockup
  const contacts = [
    { id: "cs", initials: "CS", name: "Carlos Santander", image: "/images/team/team-01.png" },
    { id: "ar", initials: "AR", name: "Ana Ruiz", image: "/images/team/team-02.png" },
    { id: "sv", initials: "SV", name: "Sofia Vargas", image: "/images/team/team-03.png" },
    { id: "mc", initials: "MC", name: "Miguel Castro", image: "/images/team/team-04.png" },
  ];

  // Theme color - same as auth primary
  const themeColor = "#004492";

  // Helper function to darken color - same as auth
  const darkenColor = (color: string, amount: number = 0.3): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Helper function to get almost black color - same as auth
  const getAlmostBlackColor = (color: string): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const factor = 0.15;

    const newR = Math.max(0, Math.floor(r * factor));
    const newG = Math.max(0, Math.floor(g * factor));
    const newB = Math.max(0, Math.floor(b * factor));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const darkThemeColor = darkenColor(themeColor, 0.4);
  const almostBlackColor = getAlmostBlackColor(themeColor);
  const blackColor = '#000000';

  useEffect(() => {
    const styleId = "custom-keys-preview-animations";
    if (typeof document !== "undefined" && !document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes halftonePulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        @keyframes revealFromLeft {
          0% {
            clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
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

  const handleContactClick = (contactId: string) => {
    if (selectedContact === contactId) {
      setSelectedContact(null);
    } else {
      setSelectedContact(contactId);
    }
  };

  const handlePayToContact = () => {
    setScreenState("confirm");
  };

  const handlePayToCustomKey = () => {
    setScreenState("confirm");
    setSelectedContact(null);
  };

  const handleConfirm = () => {
    setScreenState("processing");
    setTimeout(() => {
      setScreenState("success");
    }, 2500);
  };

  const handleBack = () => {
    if (screenState === "confirm") {
      setScreenState(selectedContact ? "selection" : "dashboard");
    } else {
      setScreenState("dashboard");
      setSelectedContact(null);
    }
  };

  const handleReset = () => {
    setScreenState("dashboard");
    setSelectedContact(null);
  };

  // Update screen state when contact is selected
  useEffect(() => {
    if (selectedContact && screenState === "dashboard") {
      setScreenState("selection");
    } else if (!selectedContact && screenState === "selection") {
      setScreenState("dashboard");
    }
  }, [selectedContact, screenState]);

  const renderMobileContent = () => {
    // Processing Screen
    if (screenState === "processing") {
      return (
        <div className="flex flex-col h-full items-center justify-center p-5">
          <div
            className="w-full flex-1 max-h-[400px] rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, ${darkThemeColor} 50%, ${almostBlackColor} 100%)`,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              animation: 'revealFromLeft 1s ease-out'
            }}
          >
              <ZelifyLogo white className="mb-6" />

              <div className="mb-6">
                <img
                  src="/gift/ANIMACION%201.gif"
                  alt="Processing"
                  className="h-24 w-24 object-contain opacity-60"
                  style={{ filter: 'brightness(2)' }}
                />
              </div>

              <p className="text-sm font-semibold text-white text-center mb-1">
                Processing your payment
              </p>
              <p className="text-xs text-white/60 text-center mb-6">
                This will only take a few seconds
              </p>

              <div className="w-full max-w-[180px]">
                <AnimatedProgressBar />
              </div>
          </div>
        </div>
      );
    }

    // Success Screen
    if (screenState === "success") {
      return (
        <div className="flex flex-col h-full items-center justify-center p-5">
          <div
            className="w-full flex-1 max-h-[400px] rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, ${darkThemeColor} 50%, ${almostBlackColor} 100%)`
            }}
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Payment sent</h2>
            <p className="text-xs text-white/70 text-center">
              Zelify notified the recipient
            </p>
          </div>

          <button
            onClick={handleReset}
            className="rounded-xl border-2 border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Make another payment
          </button>
        </div>
      );
    }

    // Confirm Screen
    if (screenState === "confirm") {
      const selectedContactData = contacts.find(c => c.id === selectedContact);
      return (
        <div className="flex flex-col h-full px-5 py-3">
          {/* Header */}
          <ZelifyLogo className="mb-3" />

          {/* Animated GIF Hero - positioned to overlap */}
          <div className="relative -mb-16 z-0 flex justify-center">
            <img
              src="/gift/ANIMACION%201.gif"
              alt="Payment Animation"
              className="h-48 w-48 object-contain opacity-90 mix-blend-multiply dark:mix-blend-normal"
            />
          </div>

          {/* Glass Card with content - exactly like dashboard */}
          <div
            className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
            }}
          >
            {/* Back button inside glass card */}
            <button
              onClick={handleBack}
              className="self-start flex items-center text-gray-400 hover:text-gray-600 transition text-xs mb-3"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-1">back</span>
            </button>

            {/* Title */}
            <div className="text-center mb-3">
              <h1 className="text-base font-bold" style={{ color: themeColor }}>
                Confirm Payment
              </h1>
              <p className="text-[9px] text-gray-500 mt-0.5">Review the details before sending</p>
            </div>

            {/* Recipient Card */}
            <div className="mb-2">
              <p className="text-[8px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                Recipient
              </p>
              <div 
                className="flex items-center gap-2.5 rounded-lg p-2.5"
                style={{
                  backgroundColor: '#F5F7FA',
                }}
              >
                {selectedContactData?.image ? (
                  <img
                    src={selectedContactData.image}
                    alt={selectedContactData.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: themeColor }}
                  >
                    {selectedContactData?.initials || "CS"}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {selectedContactData?.name || "Carlos Santander"}
                  </p>
                  <p className="text-[9px] text-gray-400">091 2345 678</p>
                </div>
              </div>
            </div>

            {/* Amount Card */}
            <div className="mb-2">
              <p className="text-[8px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                Amount
              </p>
              <div 
                className="rounded-lg p-2.5"
                style={{
                  backgroundColor: '#E8EBF0',
                }}
              >
                <p className="text-lg font-bold" style={{ color: themeColor }}>10,000.00 MXN</p>
              </div>
            </div>

            {/* Slide to Confirm - at bottom */}
            <div className="mt-auto">
              <SlideToConfirm onConfirm={handleConfirm} />
            </div>
          </div>
        </div>
      );
    }

    // Dashboard / Selection Screen
    return (
      <div className="flex flex-col h-full px-5 py-3">
        {/* Header */}
        <ZelifyLogo className="mb-3" />

        {/* Animated GIF Hero - positioned to overlap */}
        <div className="relative -mb-16 z-0 flex justify-center">
          <img
            src="/gift/ANIMACION%201.gif"
            alt="Payment Animation"
            className="h-48 w-48 object-contain opacity-90 mix-blend-multiply dark:mix-blend-normal"
          />
        </div>

        {/* Glass Card with content - exactly like auth */}
        <div
          className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
          }}
        >
          {/* Title */}
          <div className="text-center mb-3">
            <h1 className="text-lg font-bold" style={{ color: themeColor }}>Payments</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">Make fast and secure payment</p>
          </div>

          {/* Custom Key Card */}
          <div
            className="rounded-xl p-3 mb-3"
            style={{
              backgroundColor: '#E8EBF0',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wide" style={{ color: themeColor }}>
                  Custom Key Configured
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{currentCustomKey}</p>
                <p className="text-[10px] text-gray-500">ID Number</p>
              </div>
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: darkThemeColor }}
              >
                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Suggested Contacts */}
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-2">Suggested Contacts</p>
            <div className="flex justify-between px-1">
              {contacts.map((contact) => (
                <ContactAvatar
                  key={contact.id}
                  initials={contact.initials}
                  name={contact.name}
                  image={contact.image}
                  selected={selectedContact === contact.id}
                  onClick={() => handleContactClick(contact.id)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons - gradient buttons like auth */}
          <div className="mt-auto space-y-2">
            {selectedContact && (
              <button
                className="group relative w-full overflow-hidden rounded-xl border px-4 py-2.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                  borderColor: themeColor,
                }}
                onClick={handlePayToContact}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Pay to {contacts.find(c => c.id === selectedContact)?.name}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            )}
            <button
              onClick={handlePayToCustomKey}
              className={cn(
                "w-full rounded-xl px-4 py-2.5 text-xs font-semibold transition",
                selectedContact
                  ? "border-2 text-primary bg-white hover:bg-primary/5"
                  : "group relative overflow-hidden border text-white hover:opacity-90"
              )}
              style={selectedContact ? {
                borderColor: themeColor,
                color: themeColor,
              } : {
                background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                borderColor: themeColor,
              }}
            >
              {selectedContact ? (
                "Pay to Custom Key"
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Pay to Custom Key
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent self-start">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">{translations.preview.title}</h2>
        </div>
        <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
          <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: "750px" }}>
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

          <div className="relative mx-auto max-w-[300px] z-10">
            <div className="relative mx-auto">
              <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="relative h-[600px] overflow-hidden rounded-[2.3rem] bg-white dark:bg-black m-0.5 flex flex-col">
                  <div className="relative flex items-center justify-between bg-white dark:bg-black px-5 pt-8 pb-1 flex-shrink-0">
                    <div className="absolute left-5 top-3 flex items-center">
                      <span className="text-[11px] font-semibold text-black dark:text-white">9:41</span>
                    </div>

                    <div className="absolute left-1/2 top-2 -translate-x-1/2">
                      <div className="h-5 w-20 rounded-full bg-black dark:bg-white/20"></div>
                    </div>

                    <div className="absolute right-5 top-3 flex items-center gap-1">
                      <svg className="h-3 w-4" fill="none" viewBox="0 0 20 12">
                        <path
                          d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z"
                          fill="currentColor"
                          className="text-black dark:text-white"
                        />
                      </svg>
                      <div className="h-2 w-5 rounded-sm border border-black dark:border-white">
                        <div className="h-full w-4/5 rounded-sm bg-black dark:bg-white"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {renderMobileContent()}
                  </div>

                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex-shrink-0">
                    <div className="h-1 w-28 rounded-full bg-black/30 dark:bg-white/30"></div>
                  </div>
                </div>

                <div className="absolute -left-[5px] top-20 h-10 w-[3px] rounded-l bg-gray-800 dark:bg-gray-700"></div>
                <div className="absolute -left-[5px] top-36 h-7 w-[3px] rounded-l bg-gray-800 dark:bg-gray-700"></div>
                <div className="absolute -right-[5px] top-28 h-8 w-[3px] rounded-r bg-gray-800 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
