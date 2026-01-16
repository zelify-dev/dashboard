"use client";

import { FinancialEducationConfig } from "../financial-education-config";

interface LearnContentViewScreenProps {
  config: FinancialEducationConfig;
  updateConfig: (updates: Partial<FinancialEducationConfig>) => void;
}

export function LearnContentViewScreen({ config, updateConfig }: LearnContentViewScreenProps) {
  const selectedTip = config.tips.find((tip) => tip.id === config.selectedTip) || config.tips[0];

  return (
    <div className="relative flex h-full flex-col bg-white dark:bg-black">
      <div className="absolute inset-0">
        <img
          src={selectedTip?.image || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"}
          alt={selectedTip?.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex-shrink-0 px-6 pt-4">
          <button
            onClick={() => updateConfig({ currentScreen: "learn", selectedTip: null })}
            className="text-sm font-medium text-white"
          >
            &lt; back
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex-shrink-0 px-6 pb-8">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            {selectedTip?.title || "How to control overspending on not basic items"}
          </h1>
        </div>

        <div className="flex-shrink-0 px-6 pb-4">
          <div className="h-1 w-12 rounded-full bg-white/50"></div>
        </div>
      </div>
    </div>
  );
}
