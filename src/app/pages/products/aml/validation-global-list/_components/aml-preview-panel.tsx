"use client";

import { useEffect, useState, useRef } from "react";
import { AMLConfig } from "./aml-config-types";
import { cn } from "@/lib/utils";

interface AMLPreviewPanelProps {
    config: AMLConfig;
}

// Reuse AnimatedHalftoneBackdrop from Auth (simplified version)
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

export function AMLPreviewPanel({ config }: AMLPreviewPanelProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const currentBranding = isDarkMode ? config.branding.dark : config.branding.light;
    const themeColor = currentBranding.customColorTheme;

    // Helper to determine text color based on background (simple version)
    // Assuming light text for colored backgrounds unless very light color (complexity omitted for brevity)
    const textColor = "#FFFFFF";

    return (
        <div className="relative flex h-full min-h-[600px] w-full items-center justify-center overflow-hidden rounded-3xl bg-gray-50 p-8 dark:bg-[#080b19]">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
                <EdgeFadeOverlay isDarkMode={isDarkMode} />
            </div>

            {/* iPhone Mockup */}
            <div className="relative z-10 w-[300px] overflow-hidden rounded-[3rem] border-[8px] bg-white shadow-2xl dark:bg-dark-2" style={{ borderColor: isDarkMode ? '#2d3748' : '#e2e8f0', aspectRatio: '9/19.5' }}>
                {/* Notch and top bar */}
                <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-black"></div>
                <div className="absolute top-2 right-5 px-1 py-0.5 text-[10px] font-bold text-black dark:text-white">
                    9:41
                </div>

                {/* App Content */}
                <div className="flex h-full flex-col bg-gray-50 dark:bg-dark-2">

                    {/* Header with Custom Branding */}
                    <div className="flex h-32 flex-col justify-end px-5 pb-4" style={{ backgroundColor: themeColor }}>
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <p className="text-xs opacity-80">Welcome back,</p>
                                <p className="font-semibold">Jane Doe</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-white/20 p-1 flex items-center justify-center backdrop-blur-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Logo Section (Mocking App Navigation/Logo) */}
                    {currentBranding.logo && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2" style={{ top: '60px' }}>
                            <img src={currentBranding.logo} alt="Brand Logo" className="h-8 object-contain drop-shadow-sm brightness-0 invert" />
                        </div>
                    )}


                    {/* Simple AML List Mockup */}
                    <div className="flex-1 overflow-hidden p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-dark dark:text-white">Recent Validations</h3>
                            <span className="text-xs text-primary" style={{ color: themeColor }}>View All</span>
                        </div>

                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm dark:bg-dark-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold dark:bg-dark-4">
                                            JD
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-dark dark:text-white">John Doe {i}</p>
                                            <p className="text-[10px] text-gray-500">ID: 123456789</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        Clean
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300">Quick Check</h4>
                            <p className="mt-1 text-[10px] text-blue-600 dark:text-blue-400">Enter an ID to check instantly against global lists.</p>
                            <div className="mt-3 flex gap-2">
                                <div className="h-8 flex-1 rounded-lg bg-white dark:bg-dark-3 border border-blue-200 dark:border-blue-800"></div>
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Nav Mockup */}
                    <div className="border-t border-gray-200 bg-white px-6 py-3 pb-6 flex justify-between dark:border-dark-3 dark:bg-dark-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex flex-col items-center gap-1">
                                <div className={`h-5 w-5 rounded-md ${item === 1 ? 'opacity-100' : 'opacity-40'}`} style={{ backgroundColor: item === 1 ? themeColor : 'gray' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

