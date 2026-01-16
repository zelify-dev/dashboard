"use client";

import React, { useState, useEffect } from "react";
import { BehaviorAnalysisPreview } from "./behavior-analysis-preview";
import { BehaviorAnalysisCategories } from "./behavior-analysis-categories";

export interface BehaviorCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    enabled: boolean;
    notifications: NotificationTemplate[];
}

export interface NotificationTemplate {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    badge?: number;
}

export function BehaviorAnalysisConfig() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [notificationIndex, setNotificationIndex] = useState(0);
    const [customIcon, setCustomIcon] = useState<string | null>(null);
    const [categories, setCategories] = useState<BehaviorCategory[]>([
        {
            id: "expenses",
            name: "Gastos",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            color: "#10B981",
            enabled: true,
            notifications: [
                {
                    id: "expenses-1",
                    title: "Ojo con tus gastos",
                    message: "Tu gasto de comida subió 43%. Puedes ahorrar $65 al mes.",
                    timestamp: "10:24",
                    badge: 1,
                },
                {
                    id: "expenses-2",
                    title: "Gasto inusual",
                    message: "$250 en restaurantes esta semana, 60% más que tu promedio.",
                    timestamp: "14:30",
                    badge: 1,
                },
                {
                    id: "expenses-3",
                    title: "Ahorro potencial",
                    message: "Reduce entretenimiento 20% y ahorra $120 este mes.",
                    timestamp: "09:15",
                },
            ],
        },
        {
            id: "income",
            name: "Ingresos",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    <path d="M7 12h10" />
                </svg>
            ),
            color: "#3B82F6",
            enabled: true,
            notifications: [
                {
                    id: "income-1",
                    title: "Ingreso recibido",
                    message: "Has recibido $1,500 este mes. Saldo actual: $3,200.",
                    timestamp: "08:00",
                },
                {
                    id: "income-2",
                    title: "Tendencia positiva",
                    message: "Ingresos aumentaron 15% este trimestre.",
                    timestamp: "11:45",
                    badge: 1,
                },
            ],
        },
        {
            id: "savings",
            name: "Ahorros",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M8 4v6" />
                    <path d="M16 4v6" />
                </svg>
            ),
            color: "#8B5CF6",
            enabled: true,
            notifications: [
                {
                    id: "savings-1",
                    title: "Meta alcanzada",
                    message: "Has alcanzado tu meta de ahorro mensual de $500.",
                    timestamp: "16:20",
                    badge: 1,
                },
                {
                    id: "savings-2",
                    title: "Oportunidad de ahorro",
                    message: "Mantén tu ritmo y ahorra $6,000 este año.",
                    timestamp: "13:10",
                },
            ],
        },
        {
            id: "budget",
            name: "Presupuesto",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
            color: "#F59E0B",
            enabled: true,
            notifications: [
                {
                    id: "budget-1",
                    title: "Presupuesto excedido",
                    message: "Transporte excedido 25%. Considera ajustar tus gastos.",
                    timestamp: "15:45",
                    badge: 1,
                },
                {
                    id: "budget-2",
                    title: "Presupuesto en orden",
                    message: "Estás dentro de tu presupuesto este mes.",
                    timestamp: "12:00",
                },
            ],
        },
        {
            id: "investments",
            name: "Inversiones",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
            ),
            color: "#EF4444",
            enabled: true,
            notifications: [
                {
                    id: "investments-1",
                    title: "Rendimiento positivo",
                    message: "Tus inversiones generaron 8.5% este mes.",
                    timestamp: "09:30",
                    badge: 1,
                },
                {
                    id: "investments-2",
                    title: "Oportunidad",
                    message: "Considera diversificar con fondos indexados.",
                    timestamp: "17:00",
                },
            ],
        },
        {
            id: "bills",
            name: "Facturas",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            color: "#06B6D4",
            enabled: true,
            notifications: [
                {
                    id: "bills-1",
                    title: "Factura pendiente",
                    message: "3 facturas por vencer esta semana. Total: $450.",
                    timestamp: "07:30",
                    badge: 3,
                },
                {
                    id: "bills-2",
                    title: "Pago exitoso",
                    message: "Factura de servicios públicos de $85 pagada.",
                    timestamp: "10:00",
                },
            ],
        },
    ]);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    // Reset notification index when category changes
    useEffect(() => {
        setNotificationIndex(0);
    }, [selectedCategory]);

    const handleNextNotification = () => {
        if (selectedCategoryData) {
            setNotificationIndex((prev) => (prev + 1) % selectedCategoryData.notifications.length);
        }
    };

    const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
    const currentNotification = selectedCategoryData?.notifications[notificationIndex] || null;
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Notificación por defecto
    const defaultNotification: NotificationTemplate = {
        id: "default-1",
        title: "Análisis de comportamiento",
        message: "Selecciona una categoría para ver notificaciones personalizadas.",
        timestamp: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    return (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
                <div>
                    <BehaviorAnalysisPreview
                        selectedCategory={selectedCategory}
                        notification={currentNotification}
                        categoryColor={selectedCategoryData?.color || "#10B981"}
                        onNextNotification={handleNextNotification}
                        notificationIndex={notificationIndex}
                        totalNotifications={selectedCategoryData?.notifications.length || 0}
                        defaultNotification={defaultNotification}
                        customIcon={customIcon}
                    />
                </div>
                <div>
                    <BehaviorAnalysisCategories
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryClick={handleCategoryClick}
                        onToggleCategory={(categoryId, enabled) => {
                            setCategories((prev) =>
                                prev.map((cat) => (cat.id === categoryId ? { ...cat, enabled } : cat))
                            );
                        }}
                        customIcon={customIcon}
                        onCustomIconChange={setCustomIcon}
                    />
                </div>
            </div>
        </div>
    );
}
