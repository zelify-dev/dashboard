"use client";

import { BehaviorCategory } from "./behavior-analysis-config";
import type { BehaviorAnalysisCategoryId } from "./use-behavior-analysis-translations";
import { useBehaviorAnalysisTranslations } from "./use-behavior-analysis-translations";

interface BehaviorAnalysisCategoriesProps {
    categories: BehaviorCategory[];
    selectedCategory: BehaviorAnalysisCategoryId | null;
    onCategoryClick: (categoryId: BehaviorAnalysisCategoryId) => void;
    onToggleCategory: (categoryId: BehaviorAnalysisCategoryId, enabled: boolean) => void;
    customIcon: string | null;
    onCustomIconChange: (icon: string | null) => void;
}

export function BehaviorAnalysisCategories({
    categories,
    selectedCategory,
    onCategoryClick,
    onToggleCategory,
    customIcon,
    onCustomIconChange,
}: BehaviorAnalysisCategoriesProps) {
    const t = useBehaviorAnalysisTranslations();

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
            <div data-tour-id="tour-behavior-categories">
                <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    {t.categories.title}
                </h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`flex items-center justify-between rounded-lg border p-4 transition-colors cursor-pointer ${selectedCategory === category.id
                                ? "border-primary bg-primary/5 dark:bg-primary/10"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                            onClick={() => onCategoryClick(category.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: '#F3F4F6', color: '#004492' }}
                                >
                                    {category.icon}
                                </div>
                                <div>
                                    <h4 className="font-medium text-dark dark:text-white">{category.name}</h4>
                                    <p className="text-sm text-dark-6 dark:text-dark-6">
                                        {t.categories.availableNotifications(category.notifications.length)}
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={category.enabled}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        onToggleCategory(category.id, e.target.checked);
                                    }}
                                    className="peer sr-only"
                                />
                                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:bg-dark-3 dark:after:border-dark-3 dark:peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de Personalización de Marca */}
            <div className="mt-6 border-t border-stroke pt-6 dark:border-dark-3" data-tour-id="tour-behavior-branding">
                <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    {t.branding.title}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                            {t.branding.notificationLogoLabel}
                        </label>
                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                            {t.branding.notificationLogoHelp}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                {customIcon ? (
                                    <img src={customIcon} alt={t.branding.customLogoAlt} className="h-12 w-12 object-contain" />
                                ) : (
                                    <img src="/images/iconAlaiza.svg" alt={t.branding.defaultLogoAlt} className="h-12 w-12 object-contain" />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                onCustomIconChange(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
                                />
                                {customIcon && (
                                    <button
                                        onClick={() => onCustomIconChange(null)}
                                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                                    >
                                        {t.branding.restoreDefaultIcon}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
