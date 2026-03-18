"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface KybOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "en" | "es";
}

const TRANSLATIONS = {
  en: {
    title: "Technology Equipment Order Detail",
    subtitle: "KYB - Know Your Business",
    orderId: "Order ID",
    orderDate: "Order date",
    contactEmail: "Contact email",
    company: "Company",
    items: "Items",
    status: "Progress status",
    step1: "Request received",
    step2: "Documentation in review",
    step3: "Equipment assigned",
    step4: "Delivery in progress",
    step5: "Completed",
    detailTitle: "Order details",
    item1: "Laptop workstation (x1)",
    item2: "Monitor 27\" (x2)",
    item3: "Keyboard and mouse set (x1)",
    item4: "Docking station (x1)",
    close: "Close",
  },
  es: {
    title: "Detalle de pedido de equipos de tecnología",
    subtitle: "KYB - Conoce tu negocio",
    orderId: "ID de pedido",
    orderDate: "Fecha de pedido",
    contactEmail: "Email de contacto",
    company: "Empresa",
    items: "Artículos",
    status: "Estado de progreso",
    step1: "Solicitud recibida",
    step2: "Documentación en revisión",
    step3: "Equipos asignados",
    step4: "Entrega en curso",
    step5: "Completado",
    detailTitle: "Detalle del pedido",
    item1: "Estación de trabajo portátil (x1)",
    item2: "Monitor 27\" (x2)",
    item3: "Set teclado y ratón (x1)",
    item4: "Base de conexión (x1)",
    close: "Cerrar",
  },
};

const PROGRESS_STEPS = [
  { key: "step1", completed: true },
  { key: "step2", completed: true },
  { key: "step3", completed: true },
  { key: "step4", completed: true },
  { key: "step5", completed: false },
] as const;

export default function KybOrderDetailModal({
  isOpen,
  onClose,
  language = "es",
}: KybOrderDetailModalProps) {
  const t = TRANSLATIONS[language];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] rounded-2xl bg-white dark:bg-boxdark p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] border border-stroke dark:border-strokedark"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-body-color hover:text-primary dark:text-white p-1 rounded hover:bg-meta-4"
          aria-label={t.close}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <p className="text-sm font-medium text-primary dark:text-primary mb-1">
            {t.subtitle}
          </p>
          <h2 className="text-xl font-bold text-dark dark:text-white">
            {t.title}
          </h2>
        </div>

        {/* Detalle del pedido */}
        <div className="mb-6 rounded-lg border border-stroke dark:border-strokedark bg-gray-2 dark:bg-meta-4/30 p-4">
          <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">
            {t.detailTitle}
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-body-color dark:text-body-color-dark">
                {t.orderId}
              </dt>
              <dd className="font-medium text-dark dark:text-white">
                KYB-2026-0042
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body-color dark:text-body-color-dark">
                {t.orderDate}
              </dt>
              <dd className="font-medium text-dark dark:text-white">
                12/03/2026
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body-color dark:text-body-color-dark">
                {t.contactEmail}
              </dt>
              <dd className="font-medium text-dark dark:text-white break-all">
                felipe.prodmus@gmail.com
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body-color dark:text-body-color-dark">
                {t.company}
              </dt>
              <dd className="font-medium text-dark dark:text-white">
                Prodmus
              </dd>
            </div>
          </dl>
          <div className="mt-3 pt-3 border-t border-stroke dark:border-strokedark">
            <p className="text-xs font-semibold text-body-color dark:text-body-color-dark mb-2">
              {t.items}
            </p>
            <ul className="text-sm text-dark dark:text-white space-y-1">
              <li>• {t.item1}</li>
              <li>• {t.item2}</li>
              <li>• {t.item3}</li>
              <li>• {t.item4}</li>
            </ul>
          </div>
        </div>

        {/* Estado de progreso */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">
            {t.status}
          </h3>
          <div className="relative">
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-stroke dark:bg-strokedark" />
            <ul className="space-y-4 relative">
              {PROGRESS_STEPS.map((step, index) => (
                <li key={step.key} className="flex items-start gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      step.completed
                        ? "bg-primary text-white"
                        : "bg-stroke dark:bg-strokedark text-body-color dark:text-body-color-dark"
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={
                      step.completed
                        ? "text-dark dark:text-white font-medium"
                        : "text-body-color dark:text-body-color-dark"
                    }
                  >
                    {t[step.key]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-opacity-90 dark:bg-primary"
        >
          {t.close}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
