"use client";

import { useState } from "react";
import { PreviewPanel } from "./preview-panel";
import { ConfigPanel } from "./config-panel";

export type LoginMethod = "phone" | "username" | "email" | "oauth";
export type OAuthProvider = "google" | "facebook" | "apple";
export type ViewMode = "mobile" | "web";

export interface RegistrationField {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean;
}

export interface BrandingConfig {
  logo?: string;
  buttonColor: string;
  buttonLabelColor: string;
  labelColor: string;
}

export interface ThemeBranding {
  light: BrandingConfig;
  dark: BrandingConfig;
}

export interface AuthConfig {
  viewMode: ViewMode;
  serviceType: "login" | "register";
  loginMethod: LoginMethod;
  oauthProviders: OAuthProvider[];
  registrationFields: RegistrationField[];
  branding: ThemeBranding;
}

const defaultRegistrationFields: RegistrationField[] = [
  { id: "fullName", label: "Full Name", enabled: true, required: true },
  { id: "phone", label: "Mobile Phone", enabled: true, required: false },
  { id: "address", label: "Address", enabled: false, required: false },
  { id: "email", label: "Email", enabled: true, required: true },
  { id: "idNumber", label: "ID Number", enabled: false, required: false },
  { id: "birthDate", label: "Date of Birth", enabled: false, required: false },
];

export function AuthenticationConfig() {
  const [config, setConfig] = useState<AuthConfig>({
    viewMode: "mobile",
    serviceType: "login",
    loginMethod: "email",
    oauthProviders: [],
    registrationFields: defaultRegistrationFields,
    branding: {
      light: {
        buttonColor: "#3C50E0",
        buttonLabelColor: "#FFFFFF",
        labelColor: "#1F2937",
      },
      dark: {
        buttonColor: "#3C50E0",
        buttonLabelColor: "#FFFFFF",
        labelColor: "#F9FAFB",
      },
    },
  });

  const updateConfig = (updates: Partial<AuthConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <PreviewPanel config={config} updateConfig={updateConfig} />
      <ConfigPanel config={config} updateConfig={updateConfig} />
    </div>
  );
}

