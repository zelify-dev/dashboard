"use client";

import { useState } from "react";
import { PreviewPanel } from "./preview-panel";
import { ConfigPanel } from "./config-panel";

export type ViewMode = "mobile" | "web";
export type Country = "ecuador" | "mexico" | "colombia";
export type DocumentType = "drivers_license" | "id_card" | "passport";
export type LivenessType = "photo" | "video" | "selfie_photo" | "selfie_video";
export type ScreenStep = "welcome" | "document_selection" | "document_capture" | "liveness_check" | "result";

export interface BrandingConfig {
  logo?: string;
  customColorTheme: string;
}

export interface ThemeBranding {
  light: BrandingConfig;
  dark: BrandingConfig;
}

export interface WorkflowConfig {
  viewMode: ViewMode;
  country: Country;
  currentScreen: ScreenStep;
  enabledScreens: {
    welcome: boolean;
    document_selection: boolean;
    document_capture: boolean;
    liveness_check: boolean;
    result: boolean;
  };
  documentTypes: {
    drivers_license: boolean;
    id_card: boolean;
    passport: boolean;
  };
  livenessTypes: {
    photo: boolean;
    video: boolean;
    selfie_photo: boolean;
    selfie_video: boolean;
  };
  selectedDocumentType?: DocumentType;
  selectedLivenessType?: LivenessType;
  result: "approved" | "rejected" | null;
  branding: ThemeBranding;
}

interface WorkflowConfigProps {
  workflowId?: string;
  isNew?: boolean;
}

export function WorkflowConfig({ workflowId, isNew }: WorkflowConfigProps) {
  const [config, setConfig] = useState<WorkflowConfig>({
    viewMode: "mobile",
    country: "ecuador",
    currentScreen: "welcome",
    enabledScreens: {
      welcome: true,
      document_selection: true,
      document_capture: true,
      liveness_check: true,
      result: true,
    },
    documentTypes: {
      drivers_license: true,
      id_card: true,
      passport: true,
    },
    livenessTypes: {
      photo: true,
      video: true,
      selfie_photo: true,
      selfie_video: true,
    },
    result: null,
    branding: {
      light: {
        customColorTheme: "#004492",
      },
      dark: {
        customColorTheme: "#004492",
      },
    },
  });

  const updateConfig = (updates: Partial<WorkflowConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <PreviewPanel config={config} updateConfig={updateConfig} />
      <div data-tour-id="tour-identity-workflow-config">
        <ConfigPanel config={config} updateConfig={updateConfig} />
      </div>
    </div>
  );
}

