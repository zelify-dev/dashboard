"use client";

import { useState } from "react";
import { PreviewPanel } from "./preview-panel";

export type ViewMode = "mobile" | "web";

export interface AlaizaConfig {
  viewMode: ViewMode;
  maxInputLength: number;
  maxOutputLength: number;
  maxConversations: number;
  maxChatAccess: number;
  maxFiles: number;
  maxFileSize: number; // in MB
}

export function AlaizaConfig() {
  const [config, setConfig] = useState<AlaizaConfig>({
    viewMode: "mobile",
    maxInputLength: 500,
    maxOutputLength: 1000,
    maxConversations: 10,
    maxChatAccess: 5,
    maxFiles: 3,
    maxFileSize: 200,
  });

  const updateConfig = (updates: Partial<AlaizaConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <PreviewPanel config={config} updateConfig={updateConfig} />
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">Configuration</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">Configure Alaiza AI assistant settings</p>
        </div>

        <div className="space-y-6">
          {/* Message Length Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark dark:text-white">Message Length</h3>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Maximum Input Length (characters)
              </label>
              <input
                type="number"
                min="1"
                max="5000"
                value={config.maxInputLength}
                onChange={(e) => updateConfig({ maxInputLength: parseInt(e.target.value) || 500 })}
                className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Maximum Output Length (characters)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={config.maxOutputLength}
                onChange={(e) => updateConfig({ maxOutputLength: parseInt(e.target.value) || 1000 })}
                className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          {/* Conversation Limits */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark dark:text-white">Conversation Limits</h3>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Max AI Conversations (before human handoff)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={config.maxConversations}
                onChange={(e) => updateConfig({ maxConversations: parseInt(e.target.value) || 10 })}
                className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
              <p className="mt-1 text-xs text-dark-6 dark:text-dark-6">
                Number of AI conversations allowed before transferring to a human agent
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Max Chat Access (times)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={config.maxChatAccess}
                onChange={(e) => updateConfig({ maxChatAccess: parseInt(e.target.value) || 5 })}
                className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
              <p className="mt-1 text-xs text-dark-6 dark:text-dark-6">
                Maximum number of times a user can access the chat
              </p>
            </div>
          </div>

          {/* File Upload Limits */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark dark:text-white">File Upload Limits</h3>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Maximum Files
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.maxFiles}
                onChange={(e) => updateConfig({ maxFiles: parseInt(e.target.value) || 3 })}
                className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={config.maxFileSize}
                onChange={(e) => updateConfig({ maxFileSize: parseInt(e.target.value) || 200 })}
                className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 underline">
                Files exceeding 200MB will trigger an additional charge warning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

