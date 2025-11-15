"use client";

import { useState } from "react";
import { PreviewPanel } from "./preview-panel";
import { ConfigPanel } from "./config-panel";

export type ViewMode = "mobile" | "web";

export type WebhookEvent = 
  | "payment.succeeded" 
  | "payment.failed" 
  | "payment.pending" 
  | "charge.refunded";

export interface QRConfig {
  viewMode: ViewMode;
  webhookUrl: string;
  webhookEvents: WebhookEvent[];
}

export function QRConfig() {
  const [config, setConfig] = useState<QRConfig>({
    viewMode: "mobile",
    webhookUrl: "",
    webhookEvents: [],
  });

  const updateConfig = (updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      <PreviewPanel config={config} updateConfig={updateConfig} />
      <ConfigPanel config={config} updateConfig={updateConfig} />
    </div>
  );
}

