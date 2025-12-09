"use client";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
  onStepClick?: (step: number) => void;
}

export function ProgressIndicator({ current, total, className = "", onStepClick }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber <= current;
        const isClickable = onStepClick !== undefined;
        
        return (
          <div
            key={index}
            onClick={() => isClickable && onStepClick?.(stepNumber)}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              isCompleted
                ? "bg-primary"
                : "bg-gray-2 dark:bg-dark-3"
            } ${
              isClickable
                ? "cursor-pointer hover:opacity-80 active:scale-95"
                : ""
            }`}
            title={isClickable ? `Ir al paso ${stepNumber}` : undefined}
          />
        );
      })}
    </div>
  );
}





