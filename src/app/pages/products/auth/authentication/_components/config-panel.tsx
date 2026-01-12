"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { AuthConfig, LoginMethod, OAuthProvider, RegistrationField, CustomRegistrationField, CustomFieldType } from "./authentication-config";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";
import { useAuthTranslations } from "./use-auth-translations";

interface ConfigPanelProps {
    config: AuthConfig;
    updateConfig: (updates: Partial<AuthConfig>) => void;
    onSave?: () => void;
    hasChanges?: boolean;
    isSaving?: boolean;
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

export function ConfigPanel({ config, updateConfig, onSave, hasChanges = false, isSaving = false }: ConfigPanelProps) {
    const { viewMode, serviceType, loginMethod, oauthProviders, registrationFields, customRegistrationFields, branding } = config;
    const [isBrandingOpen, setIsBrandingOpen] = useState(false);
    const [isServiceConfigOpen, setIsServiceConfigOpen] = useState(true);
    const [isCustomFieldsOpen, setIsCustomFieldsOpen] = useState(false);
    const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const colorPickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [newOptionInputs, setNewOptionInputs] = useState<{ [fieldId: string]: string }>({});
    const translations = useAuthTranslations();

    // Función para manejar el toggle asegurando que siempre haya uno abierto
    const handleSectionToggle = (section: "service" | "custom" | "branding") => {
        // Si intentamos cerrar el único abierto, no permitirlo
        const currentOpenCount = [isServiceConfigOpen, isCustomFieldsOpen, isBrandingOpen].filter(Boolean).length;
        const isCurrentlyOpen = 
            (section === "service" && isServiceConfigOpen) ||
            (section === "custom" && isCustomFieldsOpen) ||
            (section === "branding" && isBrandingOpen);
        
        if (currentOpenCount === 1 && isCurrentlyOpen) {
            return; // No permitir cerrar el último abierto
        }

        // Si la sección está cerrada, abrirla y cerrar las demás
        if (!isCurrentlyOpen) {
            setIsServiceConfigOpen(section === "service");
            setIsCustomFieldsOpen(section === "custom");
            setIsBrandingOpen(section === "branding");
        } else {
            // Si está abierta, cerrarla y abrir la primera disponible
            if (section === "service") {
                setIsServiceConfigOpen(false);
                setIsCustomFieldsOpen(serviceType === "register");
                setIsBrandingOpen(serviceType !== "register");
            } else if (section === "custom") {
                setIsCustomFieldsOpen(false);
                setIsServiceConfigOpen(true);
                setIsBrandingOpen(false);
            } else {
                setIsBrandingOpen(false);
                setIsServiceConfigOpen(true);
                setIsCustomFieldsOpen(false);
            }
        }
    };
    
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

    // Funciones para campos personalizados
    const addCustomField = () => {
        if (customRegistrationFields.length >= 3) return;
        const fieldNumber = customRegistrationFields.length + 1;
        const newField: CustomRegistrationField = {
            id: `custom-${Date.now()}`,
            label: `Campo ${fieldNumber}`,
            type: "text",
            required: false,
            placeholder: `Ingresa ${fieldNumber === 1 ? "tu información" : "la información"}`,
        };
        updateConfig({ customRegistrationFields: [...customRegistrationFields, newField] });
        // Abrir la sección de campos personalizados si está cerrada
        if (!isCustomFieldsOpen) {
            handleSectionToggle("custom");
        }
    };

    const updateCustomField = (id: string, updates: Partial<CustomRegistrationField>) => {
        const newFields = customRegistrationFields.map((field) =>
            field.id === id ? { ...field, ...updates } : field
        );
        updateConfig({ customRegistrationFields: newFields });
    };

    const removeCustomField = (id: string) => {
        const newFields = customRegistrationFields.filter((field) => field.id !== id);
        updateConfig({ customRegistrationFields: newFields });
    };

    const addOptionToField = (id: string, option: string) => {
        const field = customRegistrationFields.find((f) => f.id === id);
        if (!field || field.type !== "select") return;
        const newOptions = [...(field.options || []), option];
        updateCustomField(id, { options: newOptions });
    };

    const removeOptionFromField = (id: string, optionIndex: number) => {
        const field = customRegistrationFields.find((f) => f.id === id);
        if (!field || field.type !== "select") return;
        const newOptions = field.options?.filter((_, index) => index !== optionIndex) || [];
        updateCustomField(id, { options: newOptions });
    };

    // Función para optimizar y redimensionar imágenes
    const optimizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Si es SVG, no optimizar, solo leer
            if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('No se pudo crear el contexto del canvas'));
                        return;
                    }

                    // Redimensionar si es muy grande (máximo 800px de ancho o alto)
                    const maxDimension = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height * maxDimension) / width;
                            width = maxDimension;
                        } else {
                            width = (width * maxDimension) / height;
                            height = maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Dibujar imagen redimensionada
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convertir a base64 con compresión
                    const quality = 0.85; // Calidad de compresión (85%)
                    const mimeType = file.type || 'image/png';
                    
                    try {
                        const optimizedBase64 = canvas.toDataURL(mimeType, quality);
                        resolve(optimizedBase64);
                    } catch (error) {
                        // Si falla la compresión, usar PNG como fallback
                        const fallbackBase64 = canvas.toDataURL('image/png', quality);
                        resolve(fallbackBase64);
                    }
                };
                img.onerror = () => reject(new Error('Error al cargar la imagen'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (file: File) => {
        if (!file) {
            console.warn("No file provided");
            return;
        }

        // Validar tipo de archivo: aceptar PNG, SVG y otros formatos de imagen comunes
        const validImageTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/svg'
        ];
        
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        const isValidType = validImageTypes.includes(file.type.toLowerCase()) || 
                           file.type.startsWith('image/') ||
                           validExtensions.includes(fileExtension);
        
        if (!isValidType) {
            console.error("Invalid file type. Accepted formats: PNG, JPG, GIF, WEBP, SVG");
            alert("Formato de archivo no válido. Por favor, sube una imagen PNG, JPG, GIF, WEBP o SVG.");
            return;
        }

        // Validar tamaño del archivo (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            console.error("File too large. Maximum size: 5MB");
            alert("El archivo es demasiado grande. El tamaño máximo permitido es 5MB.");
            return;
        }

        try {
            // Optimizar imagen antes de convertir a base64
            const optimizedBase64 = await optimizeImage(file);
            
            // Validar tamaño del base64 resultante (máximo 2MB en base64 ≈ 1.5MB original)
            const base64Size = optimizedBase64.length;
            const maxBase64Size = 2 * 1024 * 1024; // 2MB
            if (base64Size > maxBase64Size) {
                alert("La imagen optimizada sigue siendo muy grande. Por favor, intenta con una imagen más pequeña.");
                return;
            }

            updateConfig({
                branding: {
                    ...branding,
                    [currentTheme]: {
                        ...branding[currentTheme],
                        logo: optimizedBase64
                    }
                }
            });
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Error al procesar la imagen. Por favor, intenta de nuevo.");
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
            const item = items[i];
            // Aceptar cualquier tipo de imagen, incluyendo SVG
            if (item.type.startsWith('image/') || item.type === 'image/svg+xml') {
                const file = item.getAsFile();
                if (file) {
                    handleFileUpload(file);
                }
            }
        }
    };

    return (
        <div className="space-y-6 relative">
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

            {/* 1. Campos de Registro */}
            <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
                <button
                    onClick={() => handleSectionToggle("service")}
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
                                    {registrationFields.map((field) => {
                                        // No mostrar password ni fullName en el panel (fullName siempre está activo)
                                        if (field.id === "fullName" || field.id === "email" || field.id === "phone") return null;
                                        
                                        return (
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
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 2. Campos de Registro Personalizados */}
            {serviceType === "register" && (
                <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
                    <button
                        onClick={() => handleSectionToggle("custom")}
                        className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
                    >
                        <h3 className="text-lg font-semibold text-dark dark:text-white">
                            {translations.config.customFieldsTitle}
                        </h3>
                        <ChevronDownIcon
                            className={cn(
                                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                                isCustomFieldsOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isCustomFieldsOpen && (
                        <div className="border-t border-stroke px-4 py-3 dark:border-dark-3">
                            <p className="mb-3 text-xs text-dark-6 dark:text-dark-6">
                                {translations.config.customFieldsDescription}
                            </p>
                            
                            <div className="space-y-2.5">
                                {customRegistrationFields.map((field) => (
                                    <div
                                        key={field.id}
                                        className="rounded-lg border border-stroke p-2.5 dark:border-dark-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <h4 className="text-xs font-medium text-dark dark:text-white">
                                                Campo {customRegistrationFields.indexOf(field) + 1}
                                            </h4>
                                            <button
                                                onClick={() => removeCustomField(field.id)}
                                                className="text-[10px] text-red-500 hover:text-red-600"
                                            >
                                                {translations.config.removeField}
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {/* Label y Type en la misma fila */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-medium text-dark dark:text-white">
                                                        {translations.config.fieldLabel}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                                                        className="w-full rounded border border-stroke bg-gray-2 px-2 py-1.5 text-[11px] text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                                        placeholder="Ej: Ciudad..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-medium text-dark dark:text-white">
                                                        {translations.config.fieldType}
                                                    </label>
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => {
                                                            const newType = e.target.value as CustomFieldType;
                                                            updateCustomField(field.id, {
                                                                type: newType,
                                                                options: newType === "select" ? field.options || [] : undefined,
                                                            });
                                                        }}
                                                        className="w-full rounded border border-stroke bg-gray-2 px-2 py-1.5 text-[11px] text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                                    >
                                                        <option value="text">{translations.config.fieldTypes.text}</option>
                                                        <option value="email">{translations.config.fieldTypes.email}</option>
                                                        <option value="number">{translations.config.fieldTypes.number}</option>
                                                        <option value="tel">{translations.config.fieldTypes.tel}</option>
                                                        <option value="date">{translations.config.fieldTypes.date}</option>
                                                        <option value="textarea">{translations.config.fieldTypes.textarea}</option>
                                                        <option value="select">{translations.config.fieldTypes.select}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Placeholder y Required en la misma fila */}
                                            <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-medium text-dark dark:text-white">
                                                        {translations.config.fieldPlaceholder}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.placeholder || ""}
                                                        onChange={(e) => updateCustomField(field.id, { placeholder: e.target.value })}
                                                        className="w-full rounded border border-stroke bg-gray-2 px-2 py-1.5 text-[11px] text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                                        placeholder="Texto de ayuda..."
                                                    />
                                                </div>
                                                <label className="flex cursor-pointer items-center gap-1.5 pb-0.5">
                                                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                                                            className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                                        />
                                                        <svg
                                                            className="pointer-events-none absolute hidden h-2 w-2 text-white peer-checked:block"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={3}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] text-dark-6 dark:text-dark-6 whitespace-nowrap">
                                                        {translations.config.required}
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Options for select type - más compacto */}
                                            {field.type === "select" && (
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-medium text-dark dark:text-white">
                                                        {translations.config.fieldOptions}
                                                    </label>
                                                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                                        {field.options?.map((option, index) => (
                                                            <div key={index} className="flex items-center gap-1.5">
                                                                <input
                                                                    type="text"
                                                                    value={option}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...(field.options || [])];
                                                                        newOptions[index] = e.target.value;
                                                                        updateCustomField(field.id, { options: newOptions });
                                                                    }}
                                                                    className="flex-1 rounded border border-stroke bg-gray-2 px-2 py-1 text-[11px] text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                                                    placeholder="Opción"
                                                                />
                                                                <button
                                                                    onClick={() => removeOptionFromField(field.id, index)}
                                                                    className="rounded border border-red-500 px-2 py-1 text-[11px] text-red-500 hover:bg-red-50 dark:border-red-500 dark:hover:bg-red-900/20"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {/* Input inline para agregar nueva opción */}
                                                        <div className="flex items-center gap-1.5">
                                                            <input
                                                                type="text"
                                                                value={newOptionInputs[field.id] || ""}
                                                                onChange={(e) => setNewOptionInputs({ ...newOptionInputs, [field.id]: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" && newOptionInputs[field.id]?.trim()) {
                                                                        addOptionToField(field.id, newOptionInputs[field.id].trim());
                                                                        setNewOptionInputs({ ...newOptionInputs, [field.id]: "" });
                                                                    }
                                                                }}
                                                                className="flex-1 rounded border border-stroke bg-gray-2 px-2 py-1 text-[11px] text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                                                placeholder="Escribe y presiona Enter..."
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    if (newOptionInputs[field.id]?.trim()) {
                                                                        addOptionToField(field.id, newOptionInputs[field.id].trim());
                                                                        setNewOptionInputs({ ...newOptionInputs, [field.id]: "" });
                                                                    }
                                                                }}
                                                                disabled={!newOptionInputs[field.id]?.trim()}
                                                                className="rounded border border-primary bg-primary px-2 py-1 text-[11px] font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed dark:border-primary dark:bg-primary"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {customRegistrationFields.length < 3 && (
                                    <button
                                        onClick={addCustomField}
                                        className="w-full rounded-lg border-2 border-dashed border-stroke bg-gray-2 px-3 py-2 text-xs font-medium text-dark transition hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:hover:border-primary"
                                    >
                                        {translations.config.addCustomField}
                                    </button>
                                )}

                                {customRegistrationFields.length >= 3 && (
                                    <p className="text-center text-[10px] text-dark-6 dark:text-dark-6">
                                        {translations.config.maxCustomFields}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Personalización de Marca */}
            <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
                <button
                    onClick={() => handleSectionToggle("branding")}
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
                                                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,.svg,image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(file);
                                                    }
                                                    // Reset input para permitir subir el mismo archivo nuevamente
                                                    e.target.value = '';
                                                }}
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">
                                            {translations.config.logoHint}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Color Theme */}
                            <div>
                                <h4 className="mb-4 text-sm font-medium text-dark dark:text-white">
                                    {colorPaletteLabel}
                                </h4>
                                <div className="relative">
                                    <label className="mb-2 block text-xs font-medium text-dark-6 dark:text-dark-6">
                                        {translations.config.customColorTheme}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setOpenColorPicker(openColorPicker === "customColorTheme" ? null : "customColorTheme")}
                                            className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3"
                                            style={{ backgroundColor: currentBranding.customColorTheme }}
                                        />
                                        <input
                                            type="text"
                                            value={currentBranding.customColorTheme}
                                            onChange={(e) => updateConfig({
                                                branding: {
                                                    ...branding,
                                                    [currentTheme]: {
                                                        ...branding[currentTheme],
                                                        customColorTheme: e.target.value
                                                    }
                                                }
                                            })}
                                            className="flex-1 rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-xs text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                    {openColorPicker === "customColorTheme" && (
                                        <div ref={(el) => { colorPickerRefs.current["customColorTheme"] = el; }} className="absolute bottom-full left-0 z-10 mb-2 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2">
                                            <HexColorPicker
                                                color={currentBranding.customColorTheme}
                                                onChange={(color) => updateConfig({
                                                    branding: {
                                                        ...branding,
                                                        [currentTheme]: {
                                                            ...branding[currentTheme],
                                                            customColorTheme: color
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
                )}
            </div>

            {/* Botón de Guardar */}
            {onSave && (
                <div className="sticky bottom-0 z-10 mt-6 rounded-lg border border-stroke bg-white p-4 shadow-lg dark:border-dark-3 dark:bg-dark-2">
                    <button
                        onClick={onSave}
                        disabled={!hasChanges || isSaving}
                        className={cn(
                            "w-full rounded-lg px-4 py-3 text-sm font-medium transition",
                            hasChanges && !isSaving
                                ? "bg-primary text-white hover:opacity-90"
                                : "bg-gray-2 text-dark-6 cursor-not-allowed dark:bg-dark-3 dark:text-dark-6"
                        )}
                    >
                        {isSaving ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {translations.config.saving}
                            </span>
                        ) : (
                            translations.config.saveButton
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
