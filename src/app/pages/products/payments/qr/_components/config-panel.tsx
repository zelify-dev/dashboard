"use client";

import { QRConfig, WebhookEvent } from "./qr-config";
import { cn } from "@/lib/utils";

interface ConfigPanelProps {
  config: QRConfig;
  updateConfig: (updates: Partial<QRConfig>) => void;
}

const WEBHOOK_EVENTS: { value: WebhookEvent; label: string; description: string }[] = [
  {
    value: "payment.succeeded",
    label: "Pago exitoso (payment.succeeded)",
    description: "El evento principal. Usado para confirmar una orden y liberar un producto.",
  },
  {
    value: "payment.failed",
    label: "Pago fallido (payment.failed)",
    description: "Usado para notificar al cliente que su pago no se procesó.",
  },
  {
    value: "payment.pending",
    label: "Pago pendiente (payment.pending)",
    description: "Útil para pagos que no son instantáneos (como transferencias bancarias).",
  },
  {
    value: "charge.refunded",
    label: "Reembolso (charge.refunded)",
    description: "Usado para actualizar el estado de una orden como \"reembolsada\".",
  },
];

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
  const { webhookUrl, webhookEvents } = config;

  const handleWebhookUrlChange = (value: string) => {
    updateConfig({ webhookUrl: value });
  };

  const handleEventToggle = (event: WebhookEvent) => {
    const newEvents = webhookEvents.includes(event)
      ? webhookEvents.filter((e) => e !== event)
      : [...webhookEvents, event];
    updateConfig({ webhookEvents: newEvents });
  };

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">Configuration</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">Configure QR settings</p>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Configuración de Webhooks */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
              Configuración de Webhooks
            </h3>
            <p className="text-sm text-dark-6 dark:text-dark-6">
              Configura los webhooks para recibir notificaciones de eventos de pago
            </p>
          </div>

          {/* URL del Webhook */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              URL del Webhook de Pagos
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => handleWebhookUrlChange(e.target.value)}
              placeholder="https://tu-dominio.com/webhook/pagos"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
            />
            <p className="mt-1.5 text-xs text-dark-6 dark:text-dark-6">
              La URL donde recibirás las notificaciones de eventos de pago
            </p>
          </div>

          {/* Eventos a Notificar */}
          <div>
            <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
              Eventos a Notificar
            </label>
            <p className="mb-3 text-xs text-dark-6 dark:text-dark-6">
              Selecciona los eventos para los que deseas recibir notificaciones
            </p>
            
            <div className="space-y-3">
              {WEBHOOK_EVENTS.map((event) => {
                const isChecked = webhookEvents.includes(event.value);
                return (
                  <div
                    key={event.value}
                    className={cn(
                      "rounded-lg border p-4 transition",
                      isChecked
                        ? "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                        : "border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-3"
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleEventToggle(event.value)}
                        className="mt-0.5 h-4 w-4 rounded border-stroke text-primary focus:ring-1 focus:ring-primary dark:border-dark-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {event.label}
                        </p>
                        <p className="mt-1 text-xs text-dark-6 dark:text-dark-6">
                          {event.description}
                        </p>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

