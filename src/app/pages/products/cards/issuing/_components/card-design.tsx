"use client";

import { cn } from "@/lib/utils";

type CardDesignProps = {
  design: {
    id: string;
    name: string;
    description: string;
    gradient: string;
    textColor: string;
    cardNetwork?: "visa" | "mastercard";
  };
};

function VisaLogo() {
  return (
    <img
      src="https://www.pngmart.com/files/22/Visa-Card-Logo-PNG-Isolated-Transparent-Picture.png"
      alt="Visa"
      className="h-5 w-auto object-contain brightness-0 invert"
    />
  );
}

function MastercardLogo() {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="8" fill="#EB001B" />
      <circle cx="22" cy="10" r="8" fill="#F79E1B" />
      <path
        d="M16 6.5C17.2 7.6 18 9.2 18 11C18 12.8 17.2 14.4 16 15.5C14.8 14.4 14 12.8 14 11C14 9.2 14.8 7.6 16 6.5Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function CardDesign({ design }: CardDesignProps) {
  return (
    <div className="group cursor-pointer rounded-lg border border-stroke bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
      {/* Card Preview */}
      <div className="mb-4 aspect-[85.6/53.98] w-full overflow-hidden rounded-xl">
        <div
          className={cn(
            "flex h-full w-full flex-col justify-between rounded-xl bg-gradient-to-br p-6 shadow-lg transition-transform group-hover:scale-[1.02]",
            design.gradient,
            design.textColor
          )}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {/* Company Icon */}
              <div className="flex items-center">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-white/10 backdrop-blur-sm">
                  <img
                    src="https://logo.clearbit.com/stripe.com"
                    alt="Stripe"
                    className="h-full w-full object-contain p-0.5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://www.stripe.com/favicon.ico";
                    }}
                  />
                </div>
              </div>
              {/* Chip */}
              <div className="h-8 w-12 rounded bg-white/20 backdrop-blur-sm"></div>
              <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
            </div>
            <div className="flex items-center">
              {design.cardNetwork === "visa" ? (
                <VisaLogo />
              ) : design.cardNetwork === "mastercard" ? (
                <MastercardLogo />
              ) : (
                <div className="text-xs font-medium opacity-80">VISA</div>
              )}
            </div>
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="h-3 w-12 rounded bg-white/30"></div>
              <div className="h-3 w-12 rounded bg-white/30"></div>
              <div className="h-3 w-12 rounded bg-white/30"></div>
              <div className="h-3 w-12 rounded bg-white/30"></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="h-2 w-16 rounded bg-white/20"></div>
                <div className="h-2 w-12 rounded bg-white/20"></div>
              </div>
              <div className="h-6 w-10 rounded bg-white/20"></div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div>CARLOS MENDOZA</div>
            <div className="text-xs opacity-80">12/25</div>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-dark dark:text-white">
          {design.name}
        </h3>
        <p className="text-xs text-dark-6 dark:text-dark-6">
          {design.description}
        </p>
      </div>
    </div>
  );
}

