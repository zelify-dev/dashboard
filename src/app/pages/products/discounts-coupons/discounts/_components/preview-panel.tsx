"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AuthConfig } from "../../../auth/authentication/_components/authentication-config";
import Image from "next/image";

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

import { DiscountsConfigState, Plan } from "./discounts-config";

interface DiscountsPreviewPanelProps {
  config: DiscountsConfigState;
  updateConfig: (updates: Partial<DiscountsConfigState>) => void;
}

type PlanType = "free" | "premium";

export function DiscountsPreviewPanel({
  config,
  updateConfig,
}: DiscountsPreviewPanelProps) {
  const { viewMode, plans, promoCount, showHourField } = config;
  // State to track selected plan and current step in the flow
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
  const [step, setStep] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mapPointer, setMapPointer] = useState({ x: 50, y: 50 });
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  // Auto-advance step 10 (loading) to step 11 (success)
  useEffect(() => {
    if (step === 10) {
      setLoadingProgress(0);
      const animTimer = setTimeout(() => {
        setLoadingProgress(100);
      }, 50);

      const navTimer = setTimeout(() => {
        setStep(11);
      }, 3050);

      return () => {
        clearTimeout(animTimer);
        clearTimeout(navTimer);
      };
    } else {
      setLoadingProgress(0);
    }
  }, [step]);

  const toggleViewMode = () => {
    updateConfig({ viewMode: viewMode === "mobile" ? "web" : "mobile" });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  // Reusable Components
  const BackgroundGradient = () => (
    <div
      className="absolute inset-x-0 bottom-0 pointer-events-none z-0"
      style={{
        top: "30%",
        background: `linear-gradient(to bottom, #FFFFFF 10%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.4) 60%, transparent 100%)`,
      }}
    />
  );

  const Header = ({ showBack = false }: { showBack?: boolean }) => (
    <div className="pt-6 px-6 text-center shrink-0 relative flex items-center justify-center z-50">
      {showBack && (
        <button
          onClick={prevStep}
          className="absolute left-6 text-xs text-gray-500 hover:text-dark flex items-center"
        >
          &lt; back
        </button>
      )}
      <div className="flex items-center justify-center">
        <Image
          src="/images/logo/zelifyLogo_ligth.svg"
          alt="Zelify Logo"
          width={100}
          height={30}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>
    </div>
  );

  const AnimatedGraphic = () => (
    <div className="relative w-48 h-48 flex items-center justify-center mb-0 shrink-0 z-10">
      <img
        src="/gift/ANIMACION 1.gif"
        alt="Animation"
        className="w-full h-full object-contain opacity-80"
      />
    </div>
  );

  const MapBackground = () => (
    <div className="absolute inset-0 bg-[#1a2333] z-0 overflow-hidden">
      {/* Simulated Map Streets */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" width="100%" height="100%">
          <pattern
            id="street-pattern"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M50 0 L50 50 M0 50 L50 50"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#street-pattern)" />
          <path
            d="M0 100 L400 120 M100 0 L150 800"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M200 0 L250 800 M0 300 L400 350"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
      {/* Place names (Simulated) */}
      <div className="absolute top-20 left-10 text-[10px] text-gray-500 rotate-90">
        Av. Portugal
      </div>
      <div className="absolute bottom-40 right-10 text-[10px] text-gray-500">
        IÑAQUITO
      </div>
    </div>
  );

  const ContinueButton = ({ onClick = nextStep, text = "Continue" }) => (
    <button
      onClick={onClick}
      className="w-full text-white rounded-full py-3.5 font-bold text-base flex items-center justify-center shadow-lg relative overflow-hidden group transition-transform active:scale-[0.98] z-20"
      style={{
        background: `linear-gradient(to right, #044a95, #000b1e)`,
      }}
    >
      <span className="mr-0">{text}</span>
      <span className="absolute right-6 transition-transform group-hover:translate-x-1">
        &gt;
      </span>
    </button>
  );

  const SelectPlaceholder = ({ text }: { text: string }) => (
    <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer">
      <span className="text-xs text-gray-500">{text}</span>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        stroke="gray"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 1L5 5L9 1" />
      </svg>
    </div>
  );

  // Render Functions for each Step

  // Step 1: Plan Selection
  const renderStep1 = () => {
    const renderCard = (planKey: PlanType) => {
      const plan = plans?.find((p) => p.id === planKey) || plans?.[0];
      const isActive = selectedPlan === planKey;

      return (
        <div
          onClick={() => !isActive && setSelectedPlan(planKey)}
          className={cn(
            "w-[80%] rounded-[2rem] transition-all duration-500 ease-in-out relative overflow-hidden flex flex-col items-center shrink-0 cursor-pointer",
            isActive
              ? "h-[260px] border-[8px] border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] z-10 py-6"
              : "h-[70px] z-0 justify-center translate-y-0 hover:bg-white/40"
          )}
          style={{
            background: isActive
              ? `linear-gradient(to right, #044a95, #000b1e)`
              : "rgba(189, 185, 185, 0.3)",
          }}
        >
          {/* Expanded Content */}
          <div
            className={cn(
              "w-full flex flex-col items-center transition-opacity duration-300 px-4",
              isActive
                ? "opacity-100 delay-150"
                : "opacity-0 absolute pointer-events-none"
            )}
          >
            <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-4xl font-bold text-white">
                {plan.price}
              </span>
              <span className="text-sm text-white/70">/mo</span>
            </div>
            <div className="space-y-1.5 text-center w-full">
              {plan.features.slice(0, 4).map((feature, idx) => (
                <p
                  key={idx}
                  className="text-[11px] text-white/90 leading-tight"
                >
                  {feature}
                </p>
              ))}
            </div>
          </div>

          {/* Collapsed Content */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              isActive
                ? "opacity-0 pointer-events-none"
                : "opacity-100 delay-150"
            )}
          >
            <span className="text-gray-500 font-bold text-lg tracking-wide">
              {plan.title === "Free" ? "Free" : "Premium"}
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
        <BackgroundGradient />
        <Header />

        <div className="flex-1 flex flex-col items-center pt-2 pb-4 min-h-0 z-10">
          <div className="relative w-40 h-40 flex items-center justify-center mb-[-20px] shrink-0">
            <AnimatedGraphic />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-6">
              <h2 className="text-2xl font-bold text-[#003366]">Business</h2>
              <p className="text-gray-500 font-medium tracking-wide text-xs">
                Choose a plan
              </p>
            </div>
          </div>

          <div
            className="w-full flex-1 flex flex-col items-center justify-center -space-y-6 relative z-20"
            style={{ marginTop: "-20px" }}
          >
            {renderCard("free")}
            {renderCard("premium")}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 shrink-0 z-20">
          <ContinueButton />
        </div>
      </div>
    );
  };

  // Step 2: Basic Information
  const renderStep2 = () => (
    <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
      <BackgroundGradient />
      <Header showBack={true} />

      <div className="flex-1 flex flex-col items-center pt-2 px-6 z-10">
        <div className="relative w-32 h-32 flex items-center justify-center mb-2 shrink-0">
          <AnimatedGraphic />
        </div>

        <h2 className="text-2xl font-bold text-[#003366] mb-1">Business</h2>
        <p className="text-gray-400 text-sm mb-6">
          Fill the fields to continue
        </p>

        <div className="w-full space-y-4 bg-gray-50/50 p-6 rounded-3xl">
          <div className="space-y-2">
            <label className="text-[#003366] text-sm font-medium">
              Company's or business name
            </label>
            <input
              type="text"
              placeholder="Input name"
              className="w-full p-3 rounded-xl bg-gray-200/80 border-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#003366]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[#003366] text-sm font-medium">
              Company's or business ID
            </label>
            <input
              type="text"
              placeholder="Input ID"
              className="w-full p-3 rounded-xl bg-gray-200/80 border-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#003366]"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 shrink-0 z-20">
        <ContinueButton />
      </div>
    </div>
  );

  // Step 3: Location Map
  const renderStep3 = () => {
    // Local state for this step could be lifted if needed, but here is fine for visual preview
    // Using a ref or just visually placing it in center for now,
    // but user asked for "interactive... click anywhere".
    // I need to use a new state for pointer position if I want it to move.
    // Since I can't add state easily in this block without breaking the file structure above,
    // I will use a simple implementation where clicking the map sets a reliable visual marker
    // using DOM event in a self-contained way or reusing a state if possible.
    // However, I can't add a hook inside this render function if it's called conditionally (which it is).
    // The `renderStep3` is actually called conditionally in the main return?
    // No, `renderStep1`, `renderStep2` etc are functions defined inside component.
    // So custom hooks or state inside them is BAD practice/will fail.
    // I MUST add the state at the top level of `DiscountsPreviewPanel`.

    // I will skip adding state in this specific tool call and just implement the UI,
    // but I'll add the visual interactive part using `onClick` to just log for now or
    // try to force a re-render if I can access `updateConfig` (abusing it?) or just use the existing `step` state to trigger updates? No.

    // Wait, I can do a multi-replace to add state `mapPosition` at the top AND update `renderStep3`.
    // Yes, I will do that.

    return (
      <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
        <Header showBack={true} />

        <div className="flex-1 px-4 pt-2 pb-20 flex items-center justify-center">
          {/* Map Container - "Circular contour" / Rounded Card */}
          <div
            className="relative w-full h-[88%] rounded-[2.5rem] overflow-hidden shadow-2xl border-[5px] border-[#001a33] bg-[#001a33]"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setMapPointer({ x, y });
            }}
          >
            {/* Map Image/Background */}
            <div className="absolute inset-0 opacity-80">
              <MapBackground />
            </div>

            {/* Address Input Overlay */}
            <div className="absolute top-6 left-0 right-0 px-6 z-20">
              <div className="bg-[#1a334d]/90 backdrop-blur-md rounded-xl p-3 flex items-center shadow-lg border border-white/10">
                <span className="text-gray-400 text-xs mr-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Business Address"
                  className="bg-transparent border-none text-white text-xs w-full placeholder:text-gray-400 focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Interactive Pointer */}
            <div
              className="absolute transition-all duration-300 ease-out z-30"
              style={{
                left: `${mapPointer.x}%`,
                top: `${mapPointer.y}%`,
                transform: "translate(-50%, -100%)", // Tip at coordinates
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="white"
                className="drop-shadow-xl filter"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-20">
          <ContinueButton />
        </div>
      </div>
    );
  };

  // Step 4: Address Details
  const renderStep4 = () => (
    <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm pb-2">
        <Header showBack={true} />
      </div>

      <div className="flex-1 relative w-full h-full">
        <MapBackground />
        <div className="absolute inset-x-0 bottom-0 top-[20%] bg-[#001a33]/95 rounded-t-[2rem] p-6 text-white overflow-y-auto z-20">
          <h2 className="text-xl font-medium mb-6 text-center">
            Address details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[#004492] text-xs block mb-1">
                Business Phone Number
              </label>
              <div className="flex items-center bg-[#1a334d] rounded-lg p-3 border border-gray-700">
                <span className="text-xs mr-2">▼</span>
                <span className="text-sm">+52</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    stroke="none"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="#001a33" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Oficina Matriz</p>
                <p className="text-xs text-gray-400">Bosmediano, Quito</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#004492] text-xs block mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  placeholder="Ex. Antares"
                  className="w-full bg-[#1a334d] border border-gray-700 rounded-xl p-3 text-xs placeholder:text-gray-500 text-white"
                />
              </div>
              <div>
                <label className="text-[#004492] text-xs block mb-1">
                  Floor/Office
                </label>
                <input
                  type="text"
                  placeholder="Ex. 54"
                  className="w-full bg-[#1a334d] border border-gray-700 rounded-xl p-3 text-xs placeholder:text-gray-500 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-[#004492] text-xs block mb-1">
                Reference
              </label>
              <textarea
                rows={3}
                placeholder="Ex. Next to Nissan"
                className="w-full bg-[#1a334d] border border-gray-700 rounded-xl p-3 text-xs placeholder:text-gray-500 text-white resize-none"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={nextStep}
              className="w-full bg-white text-[#003366] rounded-full py-3.5 font-bold text-base shadow-lg hover:bg-gray-50 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5: Business Description
  const renderStep5 = () => (
    <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
      <BackgroundGradient />
      <Header showBack={true} />
      <div className="flex-1 flex flex-col items-center pt-2 px-6 z-10">
        <div className="relative w-32 h-32 flex items-center justify-center mb-2 shrink-0">
          <AnimatedGraphic />
        </div>
        <h2 className="text-2xl font-bold text-[#003366] mb-1">Business</h2>
        <p className="text-gray-400 text-xs text-center max-w-[200px] mb-6">
          Please tell us a little bit about your business
        </p>
        <div className="w-full bg-gray-100 p-6 rounded-3xl h-[240px] flex flex-col shadow-sm">
          <label className="text-[#003366]/70 text-sm mb-2">
            Business Description
          </label>
          <textarea
            placeholder="Type your description here..."
            className="flex-1 w-full bg-transparent border-none resize-none text-sm placeholder:text-gray-400 focus:ring-0 p-0"
          />
          <div className="text-right text-xs text-[#0066cc]">0/180</div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4 shrink-0 z-20">
        <ContinueButton />
      </div>
    </div>
  );

  // Step 6: Category Detection
  const renderStep6 = () => (
    <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
      <BackgroundGradient />
      <Header showBack={true} />
      <div className="flex-1 flex flex-col items-center justify-center -mt-10 px-6 z-10">
        <div className="relative w-64 h-64 flex items-center justify-center mb-4 shrink-0">
          <AnimatedGraphic />
        </div>
        <p className="text-gray-400 text-xs text-center mb-2">
          We have detected your business category:
        </p>
        <h2 className="text-3xl font-bold text-[#003366] mb-10">General</h2>
        <div className="w-full space-y-3">
          <button
            onClick={() => setStep(5)}
            className="w-full text-white bg-[#001a33] rounded-full py-3.5 font-bold text-sm flex items-center justify-between px-6 shadow-lg"
          >
            <span className="flex-1 text-center">No, Try Again</span>
            <span className="">&gt;</span>
          </button>
          <button
            onClick={nextStep}
            className="w-full text-white bg-[#001a33] rounded-full py-3.5 font-bold text-sm flex items-center justify-between px-6 shadow-lg"
          >
            <span className="flex-1 text-center">Yes, Continue</span>
            <span className="">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Step 7: Create Promo Inputs
  const renderStep7 = () => (
    <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
      <BackgroundGradient />
      <Header showBack={true} />
      <div className="flex-1 flex flex-col items-center pt-2 px-6 z-10">
        <div className="relative w-32 h-32 flex items-center justify-center mb-2 shrink-0">
          <AnimatedGraphic />
        </div>
        <h2 className="text-2xl font-bold text-[#003366] mb-1">Business</h2>
        <p className="text-gray-400 text-xs text-center mb-8">
          Now, let's create a promo
        </p>

        <div className="w-full space-y-4">
          <div className="bg-gray-100 rounded-xl p-3">
            <span className="text-[#004492] text-xs block mb-1">
              Product's Name
            </span>
          </div>
          <div className="bg-gray-100 rounded-xl p-3">
            <span className="text-[#004492] text-xs block mb-1">Price</span>
          </div>
          <div className="bg-gray-100 rounded-xl p-3">
            <span className="text-[#004492] text-xs block mb-1">
              Client's Profile
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4 shrink-0 z-20">
        <ContinueButton />
      </div>
    </div>
  );

  // Step 8: Promo Selection Stack
  const renderStep8 = () => {
    // Determine the layout for the carousel
    const count = promoCount || 3; // Assuming promoCount is available, default to 3

    // Helper to get visual offset (-1, 0, 1) handling wrap-around
    const getOffset = (index: number) => {
      let diff = index - activePromoIndex;
      // Handle wrapping for circular effect
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      return diff;
    };

    const renderStackCards = () => {
      const cards = [];
      for (let i = 0; i < count; i++) {
        const offset = getOffset(i);

        // Only render the active card and its immediate neighbors (prev/next)
        // This limits the visible stack to 3 cards for visual clarity
        if (Math.abs(offset) > 1) continue;

        const isActive = offset === 0;

        // Base translation from center. Spacing between cards.
        const translateY = offset * 65; // Reduced from 90 for tighter stack
        const scale = isActive ? 1 : 0.85;
        const zIndex = isActive ? 20 : offset < 0 ? 11 : 10;
        const opacity = isActive ? 1 : 0.8;

        cards.push(
          <div
            key={i}
            onClick={() => setActivePromoIndex(i)}
            className={cn(
              "absolute left-0 right-0 mx-auto transition-all duration-500 ease-out cursor-pointer flex flex-col justify-center",
              isActive
                ? "w-[85%] h-[110px] rounded-[2rem] border-[6px] border-white shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                : "w-[80%] h-[80px] rounded-[2rem] hover:bg-white/10"
            )}
            style={{
              top: "50%",
              transform: `translateY(calc(-50% + ${translateY}px)) scale(${scale})`,
              zIndex: zIndex,
              opacity: opacity,
              background: isActive
                ? "linear-gradient(to right, #044a95, #000b1e)"
                : "rgba(189, 185, 185, 0.3)",
            }}
          >
            {isActive ? (
              <div className="flex items-center px-6 gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#003366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
                  </svg>
                </div>
                {/* Text */}
                <div className="flex flex-col text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                    PROMO {i + 1}
                  </span>
                  <span className="text-xs text-blue-200">Go Green</span>
                  <span className="text-base font-bold leading-tight">
                    2x1 on Veggie Bowls
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-white/60 font-bold text-xs tracking-widest uppercase">
                  PROMO {i + 1}
                </span>
              </div>
            )}
          </div>
        );
      }
      return cards;
    };

    return (
      <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
        <BackgroundGradient />
        <Header showBack={true} />
        <div className="flex-1 flex flex-col items-center pt-2 px-6 z-10">
          <div className="relative w-32 h-32 flex items-center justify-center mb-2 shrink-0">
            <AnimatedGraphic />
          </div>
          <h2 className="text-2xl mb-0 text-[#003366] text-center">
            <span className="font-light">Here We</span>{" "}
            <span className="font-bold">Go</span>
          </h2>
          <p className="text-gray-400 text-xs text-center mb-2">
            Our custom tailored promos for you
          </p>

          {/* Carousel Container */}
          <div className="relative w-full h-[280px] flex items-center justify-center perspective-[1000px]">
            {renderStackCards()}
          </div>
        </div>
        <div className="px-6 pb-8 pt-4 shrink-0 z-20">
          <ContinueButton />
        </div>
      </div>
    );
  };

  // Step 9: Configure Promo (Previously Step 7)
  const renderStep9 = () => (
    <div className="flex flex-col h-full bg-white text-dark relative overflow-hidden font-sans">
      <BackgroundGradient />
      <Header showBack={true} />
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto z-10">
        <h2 className="text-xl font-bold text-[#003366] text-center mb-1">
          Configure your Promo
        </h2>
        <p className="text-gray-400 text-xs text-center mb-6">
          Take a photo of the front of your document,
        </p>

        {/* Promo Card Preview */}
        <div className="bg-[#001a33] rounded-2xl p-4 flex items-center gap-4 mb-8 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#001a33"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 0 6-3 6-7" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wide">
              Promo
            </p>
            <p className="text-white text-sm font-medium leading-tight">
              Promo Carnet Universitario
            </p>
          </div>
        </div>

        {/* Date Fields */}
        <div className="space-y-6">
          <div>
            <label className="text-gray-500 text-xs mb-2 block">
              Start Date
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <SelectPlaceholder text="Day" />
              <SelectPlaceholder text="Month" />
              <SelectPlaceholder text="Year" />
            </div>
            {showHourField && (
              <div className="w-1/3 pr-1">
                <SelectPlaceholder text="Hour" />
              </div>
            )}
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-2 block">End Date</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <SelectPlaceholder text="Day" />
              <SelectPlaceholder text="Month" />
              <SelectPlaceholder text="Year" />
            </div>
            {showHourField && (
              <div className="w-1/3 pr-1">
                <SelectPlaceholder text="Hour" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 shrink-0 z-20">
        <button
          onClick={nextStep}
          className="w-full text-white rounded-full py-3.5 font-bold text-base flex items-center justify-center shadow-lg relative overflow-hidden group transition-transform active:scale-[0.98]"
          style={{ background: `linear-gradient(to right, #001a4d, #000b1e)` }}
        >
          <span className="mr-0">Launch It</span>
          <span className="absolute right-6 transition-transform group-hover:translate-x-1">
            &gt;
          </span>
        </button>
      </div>
    </div>
  );

  // Step 10: Launching (Previously Step 8)
  const renderStep10 = () => {
    const renderContent = (isOverlay: boolean) => (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center w-full">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isOverlay ? "text-white" : "text-[#003366]"
          }`}
        >
          Launching your promo
        </h2>
        <p
          className={`text-xs ${isOverlay ? "text-white/80" : "text-gray-400"}`}
        >
          This will only take a couple of seconds
        </p>
        <div
          className={`w-64 h-2 rounded-full mt-8 overflow-hidden ${
            isOverlay ? "bg-white/20" : "bg-gray-200"
          }`}
        >
          {/* Overlay layer has full white bar that gets revealed */}
          {isOverlay && <div className="h-full w-full bg-white" />}
        </div>
      </div>
    );

    return (
      <div className="relative h-full w-full bg-white overflow-hidden font-sans">
        <div className="absolute top-6 left-6 z-30">
          <button
            onClick={prevStep}
            className="text-white bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-xs flex items-center backdrop-blur-sm"
          >
            &lt; back
          </button>
        </div>

        {/* Base Layer */}
        <div className="absolute inset-0 z-10">{renderContent(false)}</div>

        {/* Overlay Layer (Clipped) */}
        <div
          className="absolute inset-0 z-20 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - loadingProgress}% 0 0)`,
            transition: "clip-path 3s linear",
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(to right, #003670, #000b1e)",
            }}
          >
            {renderContent(true)}
          </div>
        </div>

        {/* Flush Edge Effect */}
        <div
          className="absolute top-0 bottom-0 w-20 z-20 pointer-events-none"
          style={{
            left: `${loadingProgress}%`,
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
            transform: "translateX(-50%)",
            transition: "left 3s linear",
          }}
        />
      </div>
    );
  };

  // Step 11: Success (Previously Step 9)
  const renderStep11 = () => (
    <div
      className="flex flex-col h-full items-center justify-center relative overflow-hidden font-sans p-6 text-center"
      style={{ background: `linear-gradient(to bottom, #003670, #000b1e)` }}
    >
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={prevStep}
          className="text-white hover:text-gray-200 text-xs flex items-center"
        >
          &lt; back
        </button>
      </div>
      <div className="mb-6">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Your promo in live</h2>
      <p className="text-gray-300 text-xs">
        Check your promos on your dashboard
      </p>
    </div>
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      {/* Encabezado del Preview */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Mobile Preview
        </h3>
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-dark-3">
          <button
            onClick={() => viewMode !== "mobile" && toggleViewMode()}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              viewMode === "mobile"
                ? "bg-white text-dark shadow-sm dark:bg-dark-2 dark:text-white"
                : "text-gray-500 hover:text-dark dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <MobileIcon />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => viewMode !== "web" && toggleViewMode()}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              viewMode === "web"
                ? "bg-white text-dark shadow-sm dark:bg-dark-2 dark:text-white"
                : "text-gray-500 hover:text-dark dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <WebIcon />
            <span>Web</span>
          </button>
        </div>
      </div>

      {/* Área del dispositivo */}
      <div className="flex flex-1 items-center justify-center overflow-hidden bg-gray-50 py-8 dark:bg-dark-3/50 rounded-xl">
        <div
          className={cn(
            "relative mx-auto transition-all duration-500 ease-in-out",
            viewMode === "mobile" ? "w-[300px]" : "w-full max-w-4xl px-4"
          )}
        >
          {viewMode === "mobile" ? (
            /* Marco de iPhone */
            <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[3rem] border-[8px] border-dark-2 bg-white shadow-2xl dark:border-dark-3">
              <div className="absolute left-1/2 top-0 z-50 h-7 w-32 -translate-x-1/2 rounded-b-xl bg-black"></div>
              <div className="absolute left-0 top-2 z-40 flex w-full justify-between px-6 text-[10px] font-medium text-black">
                <span>9:41</span>
                <div className="flex gap-1.5">
                  <svg
                    className="h-2.5 w-2.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                  <svg
                    className="h-2.5 w-2.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                </div>
              </div>

              {/* Contenido de la Pantalla */}
              <div className="h-full w-full overflow-hidden bg-white pt-8 scrollbar-hide">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                {step === 6 && renderStep6()}
                {step === 7 && renderStep7()}
                {step === 8 && renderStep8()}
                {step === 9 && renderStep9()}
                {step === 10 && renderStep10()}
                {step === 11 && renderStep11()}
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-black/20 z-50"></div>
            </div>
          ) : (
            /* Marco de Web Browser */
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-dark-3 dark:bg-dark-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                <div className="ml-2 flex-1 rounded-md bg-white px-2 py-0.5 text-xs text-gray-400 shadow-sm dark:bg-dark-2">
                  zelify.com/plans
                </div>
              </div>
              <div className="h-full w-full overflow-auto bg-white p-8">
                <div className="max-w-sm mx-auto border rounded-xl shadow-lg overflow-hidden h-[600px] relative">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                  {step === 5 && renderStep5()}
                  {step === 6 && renderStep6()}
                  {step === 7 && renderStep7()}
                  {step === 8 && renderStep8()}
                  {step === 9 && renderStep9()}
                  {step === 10 && renderStep10()}
                  {step === 11 && renderStep11()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
