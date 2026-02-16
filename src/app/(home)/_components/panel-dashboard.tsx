"use client";

import { useState, useEffect } from "react";
import { useLanguageTranslations } from "@/hooks/use-language-translations";
import { type Language } from "@/contexts/language-context";

type PanelTranslations = {
    title: string;
    tokenConsumption: string;
    totalTokens: string;
    tokensUsed: string;
    tokensRemaining: string;
    byUser: string;
    byService: string;
    activeServices: string;
    logs: string;
    time: string;
    user: string;
    service: string;
    tokens: string;
    status: string;
    success: string;
    error: string;
    viewAll: string;
    noLogs: string;
    noServices: string;
};

const translations: Record<Language, PanelTranslations> = {
    en: {
        title: "Panel",
        tokenConsumption: "Zcoin Consumption",
        totalTokens: "Total Zcoins",
        tokensUsed: "Zcoins Used",
        tokensRemaining: "Zcoins Remaining",
        byUser: "By User",
        byService: "By Service",
        activeServices: "Active Services",
        logs: "Logs",
        time: "Time",
        user: "User",
        service: "Service",
        tokens: "Zcoins",
        status: "Status",
        success: "Success",
        error: "Error",
        viewAll: "View All",
        noLogs: "No logs available",
        noServices: "No active services",
    },
    es: {
        title: "Panel",
        tokenConsumption: "Consumo de Zcoins",
        totalTokens: "Total de Zcoins",
        tokensUsed: "Zcoins usados",
        tokensRemaining: "Zcoins restantes",
        byUser: "Por Usuario",
        byService: "Por Servicio",
        activeServices: "Servicios Activos",
        logs: "Registros",
        time: "Hora",
        user: "Usuario",
        service: "Servicio",
        tokens: "Zcoins",
        status: "Estado",
        success: "Éxito",
        error: "Error",
        viewAll: "Ver Todos",
        noLogs: "No hay registros disponibles",
        noServices: "No hay servicios activos",
    },
};

// Función para generar timestamps realistas
const generateRecentTime = (minutesAgo: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - minutesAgo);
    return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// Mock data - En producción esto vendría de una API
const mockTokenData = {
    total: 5000000,
    used: 3247850,
    remaining: 1752150,
    byUser: [
        { user: "maria.gonzalez@empresa.com", tokens: 1245800, percentage: 38.4 },
        { user: "carlos.rodriguez@empresa.com", tokens: 892450, percentage: 27.5 },
        { user: "ana.martinez@empresa.com", tokens: 567320, percentage: 17.5 },
        { user: "juan.perez@empresa.com", tokens: 342180, percentage: 10.5 },
        { user: "laura.sanchez@empresa.com", tokens: 201100, percentage: 6.2 },
    ],
    byService: [
        { service: "Auth", tokens: 1245800, percentage: 38.4 },
        { service: "Identity", tokens: 987650, percentage: 30.4 },
        { service: "AML", tokens: 456780, percentage: 14.1 },
        { service: "Connect", tokens: 324560, percentage: 10.0 },
        { service: "Cards", tokens: 211060, percentage: 6.5 },
        { service: "Transfers", tokens: 45000, percentage: 1.4 },
    ],
};

const mockLogs = [
    { id: 1, time: generateRecentTime(2), user: "maria.gonzalez@empresa.com", service: "Auth", tokens: 2450, status: "success" },
    { id: 2, time: generateRecentTime(5), user: "carlos.rodriguez@empresa.com", service: "Identity", tokens: 1890, status: "success" },
    { id: 3, time: generateRecentTime(8), user: "ana.martinez@empresa.com", service: "AML", tokens: 3200, status: "success" },
    { id: 4, time: generateRecentTime(12), user: "juan.perez@empresa.com", service: "Connect", tokens: 1250, status: "error" },
    { id: 5, time: generateRecentTime(15), user: "laura.sanchez@empresa.com", service: "Cards", tokens: 980, status: "success" },
    { id: 6, time: generateRecentTime(18), user: "maria.gonzalez@empresa.com", service: "Auth", tokens: 2100, status: "success" },
    { id: 7, time: generateRecentTime(22), user: "carlos.rodriguez@empresa.com", service: "Identity", tokens: 3450, status: "success" },
    { id: 8, time: generateRecentTime(25), user: "ana.martinez@empresa.com", service: "Transfers", tokens: 560, status: "success" },
    { id: 9, time: generateRecentTime(28), user: "juan.perez@empresa.com", service: "AML", tokens: 1780, status: "error" },
    { id: 10, time: generateRecentTime(32), user: "laura.sanchez@empresa.com", service: "Connect", tokens: 2340, status: "success" },
];

const mockActiveServices = [
    { id: 1, name: "Auth", status: "active", requests: 12458, tokens: 1245800 },
    { id: 2, name: "Identity", status: "active", requests: 9876, tokens: 987650 },
    { id: 3, name: "AML", status: "active", requests: 4567, tokens: 456780 },
    { id: 4, name: "Connect", status: "active", requests: 3245, tokens: 324560 },
    { id: 5, name: "Cards", status: "active", requests: 2110, tokens: 211060 },
    { id: 6, name: "Transfers", status: "active", requests: 450, tokens: 45000 },
];

export function PanelDashboard() {
    const t = useLanguageTranslations(translations);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        return () => observer.disconnect();
    }, []);

    const usagePercentage = (mockTokenData.used / mockTokenData.total) * 100;

    return (
        <div className="space-y-6">
            {/* Token Consumption Overview */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t.totalTokens}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mockTokenData.total.toLocaleString()}
                    </div>
                </div>
                <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t.tokensUsed}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mockTokenData.used.toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {usagePercentage.toFixed(1)}% {t.tokensUsed.toLowerCase()}
                    </div>
                </div>
                <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t.tokensRemaining}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mockTokenData.remaining.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Token Consumption by User */}
                <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        {t.tokenConsumption} - {t.byUser}
                    </h3>
                    <div className="space-y-4">
                        {mockTokenData.byUser.map((item, index) => (
                            <div key={index}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.user}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.tokens.toLocaleString()} ({item.percentage}%)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${item.percentage}%`,
                                            backgroundColor: "#004492",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Token Consumption by Service */}
                <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        {t.tokenConsumption} - {t.byService}
                    </h3>
                    <div className="space-y-4">
                        {mockTokenData.byService.map((item, index) => (
                            <div key={index}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.service}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.tokens.toLocaleString()} ({item.percentage}%)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${item.percentage}%`,
                                            backgroundColor: "#10B981",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Active Services */}
                <div className="lg:col-span-1 rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        {t.activeServices}
                    </h3>
                    <div className="space-y-3">
                        {mockActiveServices.length > 0 ? (
                            mockActiveServices.map((service) => (
                                <div
                                    key={service.id}
                                    className="rounded-lg border border-stroke bg-gray-50 p-3 dark:border-stroke-dark dark:bg-gray-800"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {service.name}
                                        </span>
                                        <span
                                            className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                                            style={{ backgroundColor: "#10B981" }}
                                        >
                                            {t.success}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {service.requests.toLocaleString()} requests • {service.tokens.toLocaleString()} {t.tokens.toLowerCase()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t.noServices}</p>
                        )}
                    </div>
                </div>

                {/* Logs */}
                <div className="lg:col-span-2 rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t.logs}
                        </h3>
                        <button
                            className="text-sm font-medium"
                            style={{ color: "#004492" }}
                        >
                            {t.viewAll}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        {mockLogs.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-stroke dark:border-stroke-dark">
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {t.time}
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {t.user}
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {t.service}
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {t.tokens}
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {t.status}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-stroke dark:border-stroke-dark"
                                        >
                                            <td className="px-3 py-2 text-xs text-gray-900 dark:text-white">
                                                {log.time}
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-900 dark:text-white">
                                                {log.user}
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-900 dark:text-white">
                                                {log.service}
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-900 dark:text-white">
                                                {log.tokens.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${log.status === "success"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        }`}
                                                >
                                                    {log.status === "success" ? t.success : t.error}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                {t.noLogs}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
