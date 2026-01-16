"use client";

interface BottomActionButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function BottomActionButton({
  label,
  onClick,
  icon,
}: BottomActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-xl px-4 py-3.5 text-xs font-medium text-white transition-all hover:opacity-90 flex flex-col items-center justify-center gap-1"
      style={{
        background: "linear-gradient(to right, #004492 0%, #003366 40%, #001122 70%, #000000 100%)",
      }}
    >
      {icon || (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-0.5"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      )}
      {label}
    </button>
  );
}
