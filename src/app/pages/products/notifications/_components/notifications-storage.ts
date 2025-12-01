"use client";

import type { NotificationTemplate } from "./notifications-data";
import type { Language } from "@/contexts/language-context";

const STORAGE_KEY = "notifications-active-templates";
export const ACTIVE_MAP_EVENT = "notifications-active-update";
const TEMPLATE_OVERRIDES_KEY = "notifications-template-overrides";
export const TEMPLATE_OVERRIDES_EVENT = "notifications-template-overrides-update";

export type ActiveTemplateMap = Record<string, string>;
export type TemplateOverrides = Record<
  string,
  {
    html?: Partial<Record<Language, string>>;
    updatedAt?: string;
    name?: string;
    subject?: string;
    description?: string;
  }
>;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDefaultActiveMap(templates: NotificationTemplate[]): ActiveTemplateMap {
  return templates.reduce((acc, template) => {
    if (template.status === "active" && !acc[template.groupId]) {
      acc[template.groupId] = template.id;
    }
    return acc;
  }, {} as ActiveTemplateMap);
}

export function readActiveMap(): ActiveTemplateMap | null {
  if (!isBrowser()) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ActiveTemplateMap) : null;
  } catch {
    return null;
  }
}

export function writeActiveMap(map: ActiveTemplateMap) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  notifyActiveMapUpdated();
}

export function setActiveTemplateInStorage(groupId: string, templateId: string) {
  if (!isBrowser()) return;
  const current = readActiveMap() ?? {};
  const next = { ...current, [groupId]: templateId };
  writeActiveMap(next);
}

export function notifyActiveMapUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(ACTIVE_MAP_EVENT));
}

export function readTemplateOverrides(): TemplateOverrides | null {
  if (!isBrowser()) return null;
  try {
    const stored = window.localStorage.getItem(TEMPLATE_OVERRIDES_KEY);
    return stored ? (JSON.parse(stored) as TemplateOverrides) : null;
  } catch {
    return null;
  }
}

export function writeTemplateOverrides(overrides: TemplateOverrides) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TEMPLATE_OVERRIDES_KEY, JSON.stringify(overrides));
  notifyTemplateOverridesUpdated();
}

export function saveTemplateOverride(templateId: string, data: TemplateOverrides[string]) {
  if (!isBrowser()) return;
  const current = readTemplateOverrides() ?? {};
  const next = {
    ...current,
    [templateId]: {
      ...(current[templateId] ?? {}),
      ...data,
      html: {
        ...(current[templateId]?.html ?? {}),
        ...(data.html ?? {}),
      },
    },
  };
  writeTemplateOverrides(next);
}

export function notifyTemplateOverridesUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(TEMPLATE_OVERRIDES_EVENT));
}
