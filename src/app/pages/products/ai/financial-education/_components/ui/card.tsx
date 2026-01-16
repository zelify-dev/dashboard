"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl bg-gray-50 p-4 dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
