"use client";

import { useRef, useEffect, useState } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  placeholder = "0",
  className = "",
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(() => 
    value.split("").slice(0, length).concat(Array(length - value.length).fill(""))
  );

  useEffect(() => {
    const newOtp = value.split("").slice(0, length).concat(Array(Math.max(0, length - value.length)).fill(""));
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;
    
    // Solo permitir números
    const numericValue = newValue.replace(/[^0-9]/g, "");
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange(otpString);

    // Mover al siguiente input si hay un valor
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Llamar onComplete si todos los campos están llenos
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    const otpString = newOtp.join("");
    onChange(otpString);
    
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
    
    // Enfocar el siguiente input disponible
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={`flex gap-1.5 justify-center ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={placeholder}
          className="h-10 w-10 text-center text-base font-semibold rounded-lg border-2 border-stroke bg-gray-2 text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      ))}
    </div>
  );
}

