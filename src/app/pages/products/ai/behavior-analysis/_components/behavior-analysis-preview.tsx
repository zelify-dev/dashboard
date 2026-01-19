"use client";

import { useState, useEffect } from "react";
import { NotificationTemplate } from "./behavior-analysis-config";
import type { BehaviorAnalysisCategoryId } from "./use-behavior-analysis-translations";
import { useBehaviorAnalysisTranslations } from "./use-behavior-analysis-translations";
import { useLanguage } from "@/contexts/language-context";

interface BehaviorAnalysisPreviewProps {
    selectedCategory: BehaviorAnalysisCategoryId | null;
    notification: NotificationTemplate | null;
    categoryColor: string;
    onNextNotification?: () => void;
    notificationIndex?: number;
    totalNotifications?: number;
    defaultNotification?: NotificationTemplate | null;
    customIcon?: string | null;
}

export function BehaviorAnalysisPreview({
    selectedCategory,
    notification,
    categoryColor,
    onNextNotification,
    notificationIndex = 0,
    totalNotifications = 0,
    defaultNotification,
    customIcon,
}: BehaviorAnalysisPreviewProps) {
    const t = useBehaviorAnalysisTranslations();
    const { language } = useLanguage();
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Trigger animation when category is activated or deactivated
    useEffect(() => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsAnimating(true);
        }, 10);
    }, [selectedCategory]);

    useEffect(() => {
        const styleId = "behavior-analysis-animations";
        if (typeof document !== "undefined" && !document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
        @keyframes pushNotificationSlide {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          10% {
            transform: translateY(0);
            opacity: 1;
          }
          90% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-push-notification {
          animation: fadeInOut 0.5s ease-in-out forwards;
        }
      `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent" data-tour-id="tour-behavior-preview">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                    {t.preview.title}
                </h2>
            </div>
            <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
                <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: "850px" }}>
                    {/* Base white background */}
                    <div className="absolute inset-0 rounded-3xl bg-white"></div>
                </div>

                <div className="relative mx-auto max-w-[340px] z-10">
                    {/* iPhone Frame */}
                    <div className="relative mx-auto">
                        {/* Outer frame with iPhone-like design */}
                        <div className="relative overflow-hidden rounded-[3rem] border-[4px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
                            {/* Screen - Fixed height container */}
                            <div className="relative h-[680px] overflow-hidden rounded-[2.5rem] bg-white m-0.5 flex flex-col">
                                {/* Status bar iOS - Minimalista */}
                                <div className="relative flex items-center justify-between bg-white px-6 pt-10 pb-2 flex-shrink-0">
                                    {/* Left side - Time */}
                                    <div className="absolute left-6 top-4 flex items-center">
                                        <span className="text-xs font-semibold text-black">9:41</span>
                                    </div>

                                    {/* Center - Dynamic Island */}
                                    <div className="absolute left-1/2 top-3 -translate-x-1/2">
                                        <div className="h-5 w-24 rounded-full bg-black"></div>
                                        {/* Speaker */}
                                        <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800"></div>
                                    </div>

                                    {/* Right side - Signal and Battery */}
                                    <div className="absolute right-6 top-4 flex items-center gap-1.5">
                                        <svg className="h-3 w-5" fill="none" viewBox="0 0 20 12">
                                            <path
                                                d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z"
                                                fill="currentColor"
                                                className="text-black"
                                            />
                                        </svg>
                                        <div className="h-2.5 w-6 rounded-sm border border-black">
                                            <div className="h-full w-4/5 rounded-sm bg-black"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content area - Landscape background like iPhone lock screen */}
                                <div className="flex-1 min-h-0 bg-transparent relative overflow-hidden">
                                    {/* Landscape background - iPhone lock screen style */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                        style={{
                                            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')`,
                                            filter: 'brightness(0.95) contrast(1.1) saturate(1.05)',
                                        }}
                                    >
                                        {/* Overlay sutil para estilo pantalla de bloqueo */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5"></div>
                                    </div>

                                    {/* Lock Screen Clock - Hora grande en el centro */}
                                    <div className="absolute top-20 left-0 right-0 z-10 text-center">
                                        <div className="text-7xl font-light text-white drop-shadow-lg">
                                            {currentTime.toLocaleTimeString(language === "es" ? "es-ES" : "en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })}
                                        </div>
                                    </div>

                                    {/* Push Notification - Estilo iOS con animación - Abajo */}
                                    {(notification || defaultNotification) && (
                                        <div
                                            key={`${selectedCategory || 'default'}-${notification?.id || defaultNotification?.id}-${notificationIndex}`}
                                            className={`absolute bottom-24 left-4 right-4 z-20 ${isAnimating ? 'animate-push-notification' : ''}`}
                                        >
                                            <div
                                                className="bg-[#F2F2F2] rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow backdrop-blur-sm bg-opacity-95"
                                                onClick={onNextNotification}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Icono cuadrado verde a la izquierda */}
                                                    <div className="relative flex-shrink-0">
                                                        <div
                                                            className="h-12 w-12 rounded-xl flex items-center justify-center"
                                                            style={{ backgroundColor: customIcon ? categoryColor : 'transparent' }}
                                                        >
                                                            {customIcon ? (
                                                                <img src={customIcon} alt={t.branding.customLogoAlt} className="h-8 w-8 object-contain" />
                                                            ) : (
                                                                <img src="/images/iconAlaiza.svg" alt={t.branding.defaultLogoAlt} className="h-8 w-8 object-contain" />
                                                            )}
                                                        </div>
                                                        {/* Badge circular pequeño con número */}
                                                        {(notification?.badge || defaultNotification?.badge) && (
                                                            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                                                                <span className="text-[10px] font-bold text-white">
                                                                    {notification?.badge || defaultNotification?.badge}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Notification content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            {/* Título en negrita */}
                                                            <h4 className="font-bold text-sm text-black flex-1">
                                                                {(notification || defaultNotification)?.title}
                                                            </h4>
                                                            {/* Hora alineada a la derecha */}
                                                            <span className="text-xs text-gray-500 flex-shrink-0">
                                                                {(notification || defaultNotification)?.timestamp}
                                                            </span>
                                                        </div>
                                                        {/* Texto secundario en gris */}
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {(notification || defaultNotification)?.message}
                                                        </p>
                                                        {totalNotifications > 1 && (
                                                            <div className="mt-2 text-xs text-gray-400">
                                                                {t.preview.notificationCount(notificationIndex + 1, totalNotifications)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Placeholder when no category selected */}
                                    {!selectedCategory && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center px-6">
                                                <p className="text-white text-sm drop-shadow-lg">
                                                    {t.preview.placeholder}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Home indicator - Centrado abajo, gris claro */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex-shrink-0">
                                    <div className="h-1 w-32 rounded-full bg-gray-300"></div>
                                </div>
                            </div>

                            {/* Side buttons */}
                            <div className="absolute -left-1 top-24 h-12 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
                            <div className="absolute -left-1 top-40 h-8 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
                            <div className="absolute -right-1 top-32 h-10 w-1 rounded-r bg-gray-800 dark:bg-gray-700"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
