"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { AuthConfig, LoginMethod, OAuthProvider, RegistrationField } from "./authentication-config";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";
import { useAuthTranslations } from "./use-auth-translations";

interface ConfigPanelProps {
    config: AuthConfig;
    updateConfig: (updates: Partial<AuthConfig>) => void;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m4 6 4 4 4-4" />
        </svg>
    );
}

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
    const { viewMode, serviceType, loginMethod, oauthProviders, registrationFields, branding } = config;
    const [isBrandingOpen, setIsBrandingOpen] = useState(false);
    const [isServiceConfigOpen, setIsServiceConfigOpen] = useState(true);
    const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const colorPickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const translations = useAuthTranslations();
    
    const currentBranding = branding[currentTheme];
    const modeLabel = translations.config.modeName[currentTheme];
    const logoLabel = translations.config.logoLabel.replace("{mode}", modeLabel);
    const colorPaletteLabel = translations.config.colorPalette.replace("{mode}", modeLabel);

    // Cerrar color picker al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openColorPicker) {
                const pickerElement = colorPickerRefs.current[openColorPicker];
                const target = event.target as HTMLElement;
                
                // Verificar si el clic fue en el botón del color picker
                const isColorButton = target.closest('button[type="button"]') && 
                    target.closest('button[type="button"]')?.getAttribute('style')?.includes('backgroundColor');
                
                if (pickerElement && !pickerElement.contains(target) && !isColorButton) {
                    setOpenColorPicker(null);
                }
            }
        };

        if (openColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openColorPicker]);

    const toggleOAuthProvider = (provider: OAuthProvider) => {
        const newProviders = oauthProviders.includes(provider)
            ? oauthProviders.filter((p) => p !== provider)
            : [...oauthProviders, provider];
        updateConfig({ oauthProviders: newProviders });
    };

    const toggleRegistrationField = (fieldId: string) => {
        const newFields = registrationFields.map((field) =>
            field.id === fieldId ? { ...field, enabled: !field.enabled } : field
        );
        updateConfig({ registrationFields: newFields });
    };

    const toggleFieldRequired = (fieldId: string) => {
        const newFields = registrationFields.map((field) =>
            field.id === fieldId ? { ...field, required: !field.required } : field
        );
        updateConfig({ registrationFields: newFields });
    };

    const handleFileUpload = (file: File) => {
        if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateConfig({
                    branding: {
                        ...branding,
                        [currentTheme]: {
                            ...branding[currentTheme],
                            logo: event.target?.result as string
                        }
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) {
                    handleFileUpload(file);
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Service Type Selector */}
            <div className="rounded-lg bg-white px-6 py-4 shadow-sm dark:bg-dark-2">
                <div className="flex items-center gap-4">
                    <h3 className="min-w-[120px] text-lg font-semibold text-dark dark:text-white">
                        {translations.config.serviceTypeTitle}
                    </h3>
                    <div className="h-6 w-px bg-stroke dark:bg-dark-3"></div>
                    <button
                        onClick={() => updateConfig({ serviceType: serviceType === "login" ? "register" : "login" })}
                        className="group flex-1 rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
                    >
                        <span className="sr-only">
                            {serviceType === "login"
                                ? translations.config.switchToRegister
                                : translations.config.switchToLogin}
                        </span>

                        <span aria-hidden className="relative flex w-full gap-0">
                            {/* Indicator */}
                            <span className={cn(
                                "absolute h-[38px] w-1/2 rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                                serviceType === "register" && "translate-x-full"
                            )} />

                            <span className="relative flex h-[38px] flex-1 items-center justify-center rounded-full">
                                <span className="text-xs font-medium">{translations.config.login}</span>
                            </span>
                            <span className="relative flex h-[38px] flex-1 items-center justify-center rounded-full">
                                <span className="text-xs font-medium">{translations.config.register}</span>
                            </span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Login/Register Configuration */}
            <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
                <button
                    onClick={() => {
                        // Si está cerrado, abrirlo y cerrar Custom Branding
                        if (!isServiceConfigOpen) {
                            setIsServiceConfigOpen(true);
                            setIsBrandingOpen(false);
                        } else {
                            // Si está abierto, cerrarlo y abrir Custom Branding
                            setIsServiceConfigOpen(false);
                            setIsBrandingOpen(true);
                        }
                    }}
                    className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
                >
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                        {serviceType === "login"
                            ? translations.config.loginMethodTitle
                            : translations.config.registrationFieldsTitle}
                    </h3>
                    <ChevronDownIcon
                        className={cn(
                            "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                            isServiceConfigOpen && "rotate-180"
                        )}
                    />
                </button>

                {isServiceConfigOpen && (
                    <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
                        {serviceType === "login" ? (
                            <>
                                <div className="space-y-2">
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "phone"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="phone"
                                    checked={loginMethod === "phone"}
                                    onChange={() => updateConfig({ loginMethod: "phone" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">
                                {translations.config.loginMethods.phone}
                            </span>
                        </label>
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "username"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="username"
                                    checked={loginMethod === "username"}
                                    onChange={() => updateConfig({ loginMethod: "username" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">
                                {translations.config.loginMethods.username}
                            </span>
                        </label>
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "email"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="email"
                                    checked={loginMethod === "email"}
                                    onChange={() => updateConfig({ loginMethod: "email" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">
                                {translations.config.loginMethods.email}
                            </span>
                        </label>
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "oauth"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="oauth"
                                    checked={loginMethod === "oauth"}
                                    onChange={() => updateConfig({ loginMethod: "oauth" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">
                                {translations.config.loginMethods.oauth}
                            </span>
                        </label>
                    </div>

                    {/* OAuth Providers */}
                    {(loginMethod === "oauth" || loginMethod === "email" || loginMethod === "phone" || loginMethod === "username") && (
                        <div className="mt-6">
                            <h4 className="mb-3 text-sm font-medium text-dark dark:text-white">
                                {translations.config.oauthProvidersTitle}
                            </h4>
                            <div className="space-y-2">
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${oauthProviders.includes("google")
                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                        : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                        }`}
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={oauthProviders.includes("google")}
                                            onChange={() => toggleOAuthProvider("google")}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <GoogleIcon />
                                    <span className="text-sm font-medium text-dark dark:text-white">Google</span>
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${oauthProviders.includes("facebook")
                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                        : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                        }`}
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={oauthProviders.includes("facebook")}
                                            onChange={() => toggleOAuthProvider("facebook")}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <FacebookIcon />
                                    <span className="text-sm font-medium text-dark dark:text-white">Facebook</span>
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${oauthProviders.includes("apple")
                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                        : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                        }`}
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={oauthProviders.includes("apple")}
                                            onChange={() => toggleOAuthProvider("apple")}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <AppleIcon />
                                    <span className="text-sm font-medium text-dark dark:text-white">Apple</span>
                                </label>
                            </div>
                        </div>
                    )}
                            </>
                        ) : (
                            <>
                                <p className="mb-4 text-sm text-dark-6 dark:text-dark-6">
                                    {translations.config.registerFieldsDescription}
                                </p>
                                <div className="space-y-2">
                                    {registrationFields.map((field) => (
                                        <div
                                            key={field.id}
                                            className={`flex items-center justify-between rounded-lg border p-3 transition ${field.enabled
                                                ? "border-primary bg-primary/5 dark:bg-primary/10"
                                                : "border-stroke dark:border-dark-3"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex h-5 w-5 items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.enabled}
                                                        onChange={() => toggleRegistrationField(field.id)}
                                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                                    />
                                                    <svg
                                                        className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={3}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-dark dark:text-white">
                                                    {translations.registrationFields[field.id]}
                                                </span>
                                            </div>
                                            {field.enabled && (
                                                <label className="flex cursor-pointer items-center gap-2">
                                                    <div className="relative flex h-4 w-4 items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={() => toggleFieldRequired(field.id)}
                                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                                        />
                                                        <svg
                                                            className="pointer-events-none absolute hidden h-2.5 w-2.5 text-white peer-checked:block"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={3}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs text-dark-6 dark:text-dark-6">
                                                        {translations.config.required}
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Branding Section */}
            <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
                <button
                    onClick={() => {
                        // Si está cerrado, abrirlo y cerrar Login/Register
                        if (!isBrandingOpen) {
                            setIsBrandingOpen(true);
                            setIsServiceConfigOpen(false);
                        } else {
                            // Si está abierto, cerrarlo y abrir Login/Register
                            setIsBrandingOpen(false);
                            setIsServiceConfigOpen(true);
                        }
                    }}
                    className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
                >
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                        {translations.config.customBrandingTitle}
                    </h3>
                    <ChevronDownIcon
                        className={cn(
                            "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                            isBrandingOpen && "rotate-180"
                        )}
                    />
                </button>

                {isBrandingOpen && (
                    <div className="border-t border-stroke px-6 py-4 dark:border-dark-3">
                        <div className="space-y-6">
                            {/* Theme Selector */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                    {translations.config.themeLabel}
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentTheme("light")}
                                        className={cn(
                                            "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                                            currentTheme === "light"
                                                ? "border-primary bg-primary text-white"
                                                : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        )}
                                    >
                                        {translations.config.lightMode}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentTheme("dark")}
                                        className={cn(
                                            "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                                            currentTheme === "dark"
                                                ? "border-primary bg-primary text-white"
                                                : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        )}
                                    >
                                        {translations.config.darkMode}
                                    </button>
                                </div>
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                    {logoLabel}
                                </label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onPaste={handlePaste}
                                    className={cn(
                                        "flex items-center gap-4 rounded-lg border-2 border-dashed p-4 transition",
                                        isDragging
                                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                                            : "border-stroke dark:border-dark-3"
                                    )}
                                >
                                    {currentBranding.logo ? (
                                        <div className="relative">
                                            <img
                                                src={currentBranding.logo}
                                                alt="Logo"
                                                className="h-16 w-16 rounded-lg object-contain border border-stroke dark:border-dark-3"
                                            />
                                            <button
                                                onClick={() => updateConfig({
                                                    branding: {
                                                        ...branding,
                                                        [currentTheme]: {
                                                            ...branding[currentTheme],
                                                            logo: undefined
                                                        }
                                                    }
                                                })}
                                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-3">
                                            <svg className="h-8 w-8 text-dark-6 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            {currentBranding.logo
                                                ? translations.config.changeLogo
                                                : translations.config.uploadLogo}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,.svg,image/svg+xml"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">
                                            {translations.config.logoHint}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Color Palette */}
                            <div>
                                <h4 className="mb-4 text-sm font-medium text-dark dark:text-white">
                                    {colorPaletteLabel}
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Button Background Color */}
                                    <div className="relative">
                                        <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                                            {translations.config.buttonBackground}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setOpenColorPicker(openColorPicker === "button" ? null : "button")}
                                                className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                                                style={{ backgroundColor: currentBranding.buttonColor }}
                                            />
                                            <input
                                                type="text"
                                                value={currentBranding.buttonColor}
                                                onChange={(e) => updateConfig({
                                                    branding: {
                                                        ...branding,
                                                        [currentTheme]: {
                                                            ...branding[currentTheme],
                                                            buttonColor: e.target.value
                                                        }
                                                    }
                                                })}
                                                className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                            />
                                        </div>
                                        {openColorPicker === "button" && (
                                            <div ref={(el) => { colorPickerRefs.current["button"] = el; }} className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2">
                                                <HexColorPicker
                                                    color={currentBranding.buttonColor}
                                                    onChange={(color) => updateConfig({
                                                        branding: {
                                                            ...branding,
                                                            [currentTheme]: {
                                                                ...branding[currentTheme],
                                                                buttonColor: color
                                                            }
                                                        }
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Button Label Color */}
                                    <div className="relative">
                                        <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                                            {translations.config.buttonLabel}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setOpenColorPicker(openColorPicker === "buttonLabel" ? null : "buttonLabel")}
                                                className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                                                style={{ backgroundColor: currentBranding.buttonLabelColor }}
                                            />
                                            <input
                                                type="text"
                                                value={currentBranding.buttonLabelColor}
                                                onChange={(e) => updateConfig({
                                                    branding: {
                                                        ...branding,
                                                        [currentTheme]: {
                                                            ...branding[currentTheme],
                                                            buttonLabelColor: e.target.value
                                                        }
                                                    }
                                                })}
                                                className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                            />
                                        </div>
                                        {openColorPicker === "buttonLabel" && (
                                            <div ref={(el) => { colorPickerRefs.current["buttonLabel"] = el; }} className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2">
                                                <HexColorPicker
                                                    color={currentBranding.buttonLabelColor}
                                                    onChange={(color) => updateConfig({
                                                        branding: {
                                                            ...branding,
                                                            [currentTheme]: {
                                                                ...branding[currentTheme],
                                                                buttonLabelColor: color
                                                            }
                                                        }
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Label Color */}
                                    <div className="relative">
                                        <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                                            {translations.config.labelColor}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setOpenColorPicker(openColorPicker === "label" ? null : "label")}
                                                className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                                                style={{ backgroundColor: currentBranding.labelColor }}
                                            />
                                            <input
                                                type="text"
                                                value={currentBranding.labelColor}
                                                onChange={(e) => updateConfig({
                                                    branding: {
                                                        ...branding,
                                                        [currentTheme]: {
                                                            ...branding[currentTheme],
                                                            labelColor: e.target.value
                                                        }
                                                    }
                                                })}
                                                className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                            />
                                        </div>
                                        {openColorPicker === "label" && (
                                            <div ref={(el) => { colorPickerRefs.current["label"] = el; }} className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2">
                                                <HexColorPicker
                                                    color={currentBranding.labelColor}
                                                    onChange={(color) => updateConfig({
                                                        branding: {
                                                            ...branding,
                                                            [currentTheme]: {
                                                                ...branding[currentTheme],
                                                                labelColor: color
                                                            }
                                                        }
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
