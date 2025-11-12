"use client";

import { useState, useEffect } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";

dayjs.extend(relativeTime);

// Importar el mapa dinámicamente para evitar problemas de SSR
const LocationMap = dynamic(
  () => import("./location-map").then((mod) => ({ default: mod.LocationMap })),
  { ssr: false }
);

interface IdentificationEvent {
  id: string;
  visitorId: string;
  ipAddress: string;
  countryCode?: string;
  country?: string;
  city?: string;
  requestId: string;
  date: string;
  timestamp: number;
  // Datos completos del dispositivo
  fullData?: any;
}

const STORAGE_KEY = "fpjs_identification_events";

// Función para obtener bandera del país (emoji)
function getCountryFlag(countryCode?: string): string {
  if (!countryCode) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Función para cargar eventos desde localStorage
function loadEvents(): IdentificationEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Función para guardar eventos en localStorage
function saveEvents(events: IdentificationEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Failed to save events:", error);
  }
}


// Componente Modal de Detalles
function DeviceDetailsModal({
  event,
  onClose,
  allEvents,
}: {
  event: IdentificationEvent;
  onClose: () => void;
  allEvents: IdentificationEvent[];
}) {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [showJSON, setShowJSON] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Encontrar eventos relacionados con el mismo visitorId
  const relatedEvents = allEvents.filter((e) => e.visitorId === event.visitorId);
  const firstSeen = relatedEvents.length > 0
    ? Math.min(...relatedEvents.map((e) => e.timestamp))
    : event.timestamp;
  const lastSeen = event.timestamp;

  // Calcular tiempo relativo
  const lastSeenAgo = dayjs(lastSeen).fromNow();
  const firstSeenAgo = dayjs(firstSeen).fromNow();

  // Calcular estadísticas para Smart Signals
  const uniqueIPs = new Set(relatedEvents.map((e) => e.ipAddress)).size;
  const uniqueCountries = new Set(relatedEvents.filter((e) => e.countryCode).map((e) => e.countryCode)).size;
  const eventsPerIP = uniqueIPs > 0 ? (relatedEvents.length / uniqueIPs) : 0;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(event.fullData || {}, null, 2));
      // Mostrar feedback visual (puedes mejorar esto con un toast)
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Obtener información del dispositivo desde la estructura anidada
  const fullData = event.fullData || {};
  const identification = fullData.identification?.data || {};
  const browserDetails = identification.browserDetails || {};
  const ipInfo = fullData.ipInfo?.data?.v4 || {};
  const geolocation = ipInfo.geolocation || {};
  const vpn = fullData.vpn?.data || {};
  const proxy = fullData.proxy?.data || {};
  const suspectScoreData = fullData.suspectScore?.data || {};
  const velocity = fullData.velocity?.data || {};
  const highActivity = fullData.highActivity?.data || {};
  
  // Función helper para convertir valores a string de forma segura
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (typeof value === "object") {
      if (value.name) return String(value.name);
      if (value.value) return String(value.value);
      if (value.score) return String(value.score);
      return JSON.stringify(value);
    }
    return String(value);
  };
  
  // Extraer información del navegador
  const browserName = safeString(browserDetails.browserName) || "Unknown";
  const browserVersion = safeString(browserDetails.browserFullVersion || browserDetails.browserMajorVersion);
  const os = safeString(browserDetails.os) || "Unknown";
  const osVersion = safeString(browserDetails.osVersion);
  const device = safeString(browserDetails.device) || "Unknown";
  const userAgent = safeString(browserDetails.userAgent);
  
  // Extraer confidence correctamente
  let confidence = 100;
  if (identification.confidence) {
    if (typeof identification.confidence === "number") {
      confidence = identification.confidence;
    } else if (typeof identification.confidence === "object" && identification.confidence.score !== undefined) {
      confidence = typeof identification.confidence.score === "number" ? identification.confidence.score * 100 : 100;
    }
  }
  
  // Detectar VPN/Proxy basado en datos reales
  const hasVPN = vpn.result === true;
  const hasProxy = proxy.result === true;
  const hasHighActivity = highActivity.result === true;
  
  // Extraer información de ubicación
  const latitude = geolocation.latitude;
  const longitude = geolocation.longitude;
  const timezone = geolocation.timezone;
  const continent = geolocation.continent;
  const subdivisions = geolocation.subdivisions || [];
  
  // Extraer información de velocity
  const distinctIPs24h = velocity.distinctIp?.intervals?.["24h"] || uniqueIPs;
  const distinctCountries24h = velocity.distinctCountry?.intervals?.["24h"] || uniqueCountries;
  const events24h = velocity.events?.intervals?.["24h"] || relatedEvents.length;
  const ipEvents24h = velocity.ipEvents?.intervals?.["24h"] || 0;
  
  // Extraer suspect score real
  // Calcular un score de respaldo basado en estadísticas si no está disponible
  const calculatedFallbackScore = Math.min(100, Math.round((uniqueIPs * 10) + (uniqueCountries * 8) + (eventsPerIP * 3)));
  const realSuspectScore = suspectScoreData.result !== undefined ? suspectScoreData.result : calculatedFallbackScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-dark-2">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-stroke bg-white px-6 py-4 dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-dark dark:text-white">{event.requestId}</span>
                  <span className="text-sm text-dark-6 dark:text-dark-6">
                    {dayjs(event.timestamp).format("DD MMM YYYY HH:mm")}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {hasVPN && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      VPN
                    </span>
                  )}
                  {hasProxy && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      Proxy
                    </span>
                  )}
                  {hasHighActivity && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      High activity
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowJSON(!showJSON)}
                className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                Show JSON
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-4 border-b border-stroke dark:border-dark-3">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === "details"
                  ? "border-b-2 border-primary text-primary"
                  : "text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === "history"
                  ? "border-b-2 border-primary text-primary"
                  : "text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              Visitor history {relatedEvents.length}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "details" ? (
            <div className="space-y-6">
              {/* Device Information Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Identification */}
                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Identification</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        Visitor ID
                      </p>
                      <p className="mt-1 font-mono text-sm font-semibold text-dark dark:text-white">
                        {event.visitorId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        Last seen
                      </p>
                      <p className="mt-1 text-sm text-dark dark:text-white">{lastSeenAgo}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        First seen
                      </p>
                      <p className="mt-1 text-sm text-dark dark:text-white">
                        {identification.firstSeenAt?.global 
                          ? dayjs(identification.firstSeenAt.global).fromNow()
                          : firstSeenAgo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        Confidence
                      </p>
                      <p className="mt-1 text-sm font-semibold text-dark dark:text-white">{confidence}%</p>
                      {identification.confidence?.revision && (
                        <p className="mt-0.5 text-xs text-dark-6 dark:text-dark-6">
                          Revision: {identification.confidence.revision}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        Replayed
                      </p>
                      <p className="mt-1 text-sm text-dark dark:text-white">
                        {identification.replayed ? "Yes" : "No"}
                      </p>
                    </div>
                    {identification.visitorFound !== undefined && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                          Visitor Found
                        </p>
                        <p className="mt-1 text-sm text-dark dark:text-white">
                          {identification.visitorFound ? "Yes" : "No"}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        Client
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span className="text-sm text-dark dark:text-white">
                            Browser: {browserName} {browserVersion}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-dark dark:text-white">
                            Operating system: {os} {osVersion}
                          </span>
                        </div>
                        {device && device !== "Unknown" && (
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-dark dark:text-white">
                              Device: {device}
                            </span>
                          </div>
                        )}
                        {userAgent && (
                          <div className="mt-2">
                            <p className="text-xs text-dark-6 dark:text-dark-6">User Agent:</p>
                            <p className="mt-0.5 break-all text-xs text-dark dark:text-white">{userAgent}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Location</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
                        IP address
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(event.countryCode)}</span>
                        <span className="font-mono text-sm font-semibold text-dark dark:text-white">
                          {event.ipAddress}
                        </span>
                      </div>
                    </div>
                    <div className="h-64 rounded-lg border border-stroke bg-gray-100 dark:border-dark-3 dark:bg-dark-3 overflow-hidden">
                      <LocationMap
                        latitude={latitude}
                        longitude={longitude}
                        city={event.city}
                        country={event.country}
                        ipAddress={event.ipAddress}
                      />
                    </div>
                    <div className="space-y-1 text-xs text-dark-6 dark:text-dark-6">
                      {geolocation.city?.name && (
                        <div>City: {geolocation.city.name}</div>
                      )}
                      {subdivisions.length > 0 && (
                        <div>Region: {subdivisions.map((s: any) => s.name).join(", ")}</div>
                      )}
                      {geolocation.country?.name && (
                        <div>Country: {geolocation.country.name} ({geolocation.country.code})</div>
                      )}
                      {continent?.name && (
                        <div>Continent: {continent.name} ({continent.code})</div>
                      )}
                      {timezone && (
                        <div>Timezone: {timezone}</div>
                      )}
                      {geolocation.accuracyRadius && (
                        <div>Accuracy: {geolocation.accuracyRadius} km</div>
                      )}
                    </div>
                    {ipInfo.asn && (
                      <div className="mt-2 text-xs text-dark-6 dark:text-dark-6">
                        <div>ASN: {ipInfo.asn.asn} - {ipInfo.asn.name}</div>
                        {ipInfo.asn.network && (
                          <div>Network: {ipInfo.asn.network}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Smart Signals */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Suspect Score */}
                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Suspect Score</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-dark dark:text-white">{realSuspectScore}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        realSuspectScore >= 50 
                          ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                          : realSuspectScore >= 25
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}>
                        {realSuspectScore >= 50 ? "High" : realSuspectScore >= 25 ? "Medium" : "Low"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-dark-3">
                        <div
                          className={`h-2 rounded-full ${
                            realSuspectScore >= 50 ? "bg-red-500" : realSuspectScore >= 25 ? "bg-orange-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(realSuspectScore, 100)}%` }}
                        />
                      </div>
                      {realSuspectScore >= 50 && (
                        <p className="text-xs text-dark-6 dark:text-dark-6">
                          &gt; P95
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-dark-6 dark:text-dark-6">
                      A score of {realSuspectScore} is {realSuspectScore >= 50 ? "greater than" : realSuspectScore >= 25 ? "similar to" : "lower than"} the scores of {realSuspectScore >= 50 ? "95%" : realSuspectScore >= 25 ? "50%" : "25%"} of recent visitors.
                    </p>
                  </div>
                </div>

                {/* Velocity Signals */}
                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Velocity Signals</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {ipEvents24h > 10 ? (
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        <span className="text-sm text-dark dark:text-white">Events per IP (24h)</span>
                      </div>
                      <span className="font-semibold text-dark dark:text-white">{ipEvents24h}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {distinctIPs24h > 2 ? (
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        <span className="text-sm text-dark dark:text-white">IP addresses (24h)</span>
                      </div>
                      <span className="font-semibold text-dark dark:text-white">{distinctIPs24h}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {distinctCountries24h > 1 ? (
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        <span className="text-sm text-dark dark:text-white">Countries (24h)</span>
                      </div>
                      <span className="font-semibold text-dark dark:text-white">{distinctCountries24h}</span>
                    </div>
                    {events24h > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-sm text-dark dark:text-white">Total Events (24h)</span>
                        </div>
                        <span className="font-semibold text-dark dark:text-white">{events24h}</span>
                      </div>
                    )}
                    {highActivity.dailyRequests && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-sm text-dark dark:text-white">Daily Requests</span>
                        </div>
                        <span className="font-semibold text-dark dark:text-white">{highActivity.dailyRequests}</span>
                      </div>
                    )}
                    <p className="mt-4 text-xs text-dark-6 dark:text-dark-6">
                      Distinct values seen for this visitor in the 24h before this event.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information Sections */}
              <div className="space-y-4">
                {/* VPN Details */}
                <div className="rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                  <button
                    onClick={() => toggleSection("vpn")}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-semibold text-dark dark:text-white">
                        VPN {vpn.result !== undefined && `(${vpn.result ? "Detected" : "Not Detected"})`}
                      </span>
                    </div>
                    <svg
                      className={`h-5 w-5 transition-transform ${expandedSections.vpn ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.vpn && (
                    <div className="border-t border-stroke p-4 dark:border-dark-3">
                      <div className="relative rounded-lg bg-gray-50 p-4 dark:bg-dark-3">
                        <button
                          onClick={copyJSON}
                          className="absolute right-2 top-2 rounded p-1 hover:bg-gray-200 dark:hover:bg-dark-2"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <pre className="overflow-auto text-xs">
                          <code>{JSON.stringify(fullData.vpn || {}, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proxy Details */}
                <div className="rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                  <button
                    onClick={() => toggleSection("proxy")}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span className="font-semibold text-dark dark:text-white">
                        Proxy {proxy.result !== undefined && `(${proxy.result ? "Detected" : "Not Detected"})`}
                      </span>
                    </div>
                    <svg
                      className={`h-5 w-5 transition-transform ${expandedSections.proxy ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.proxy && (
                    <div className="border-t border-stroke p-4 dark:border-dark-3">
                      <div className="relative rounded-lg bg-gray-50 p-4 dark:bg-dark-3">
                        <button
                          onClick={copyJSON}
                          className="absolute right-2 top-2 rounded p-1 hover:bg-gray-200 dark:hover:bg-dark-2"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <pre className="overflow-auto text-xs">
                          <code>{JSON.stringify(fullData.proxy || {}, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bot Detection */}
                {fullData.botd && (
                  <div className="rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                    <button
                      onClick={() => toggleSection("botd")}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold text-dark dark:text-white">
                          Bot Detection
                        </span>
                      </div>
                      <svg
                        className={`h-5 w-5 transition-transform ${expandedSections.botd ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.botd && (
                      <div className="border-t border-stroke p-4 dark:border-dark-3">
                        <div className="relative rounded-lg bg-gray-50 p-4 dark:bg-dark-3">
                          <button
                            onClick={copyJSON}
                            className="absolute right-2 top-2 rounded p-1 hover:bg-gray-200 dark:hover:bg-dark-2"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <pre className="overflow-auto text-xs">
                            <code>{JSON.stringify(fullData.botd || {}, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SDK Information */}
                {identification.sdk && (
                  <div className="rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                    <button
                      onClick={() => toggleSection("sdk")}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-dark-6 dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="font-semibold text-dark dark:text-white">
                          SDK Information
                        </span>
                      </div>
                      <svg
                        className={`h-5 w-5 transition-transform ${expandedSections.sdk ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.sdk && (
                      <div className="border-t border-stroke p-4 dark:border-dark-3">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-dark-6 dark:text-dark-6">Platform: </span>
                            <span className="font-medium text-dark dark:text-white">{identification.sdk.platform}</span>
                          </div>
                          <div>
                            <span className="text-dark-6 dark:text-dark-6">Version: </span>
                            <span className="font-medium text-dark dark:text-white">{identification.sdk.version}</span>
                          </div>
                          {identification.sdk.integrations && identification.sdk.integrations.length > 0 && (
                            <div>
                              <span className="text-dark-6 dark:text-dark-6">Integrations: </span>
                              <div className="mt-1 space-y-1">
                                {identification.sdk.integrations.map((integration: any, idx: number) => (
                                  <div key={idx} className="text-xs text-dark dark:text-white">
                                    {integration.name} v{integration.version}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Visitor History</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2">
                      <TableHead>VISITOR ID</TableHead>
                      <TableHead>IP ADDRESS</TableHead>
                      <TableHead>REQUEST ID</TableHead>
                      <TableHead>DATE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-dark-6 dark:text-dark-6">
                          No history found for this visitor.
                        </TableCell>
                      </TableRow>
                    ) : (
                      relatedEvents.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium text-dark dark:text-white">
                            {e.visitorId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getCountryFlag(e.countryCode)}</span>
                              <span className="text-dark dark:text-white">{e.ipAddress}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-dark dark:text-white">{e.requestId}</TableCell>
                          <TableCell className="text-dark dark:text-white">{e.date}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* JSON View */}
        {showJSON && (
          <div className="border-t border-stroke p-6 dark:border-dark-3">
            <div className="relative rounded-lg bg-gray-50 p-4 dark:bg-dark-3">
              <button
                onClick={copyJSON}
                className="absolute right-2 top-2 rounded p-1 hover:bg-gray-200 dark:hover:bg-dark-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <pre className="overflow-auto text-xs" style={{ maxHeight: "400px" }}>
                <code>{JSON.stringify(event.fullData || {}, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DeviceInformationContent() {
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );
  
  const [events, setEvents] = useState<IdentificationEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IdentificationEvent | null>(null);

  // Cargar eventos al montar el componente
  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  // Agregar evento cuando se obtiene nuevo data
  useEffect(() => {
    if (data) {
      // Extraer datos de la estructura anidada de FingerprintJS Pro
      const identification = data.identification?.data || {};
      const ipInfo = data.ipInfo?.data?.v4 || {};
      const geolocation = ipInfo.geolocation || {};
      
      const visitorId = identification.visitorId;
      const requestId = identification.requestId || data.requestId;
      
      if (visitorId && requestId) {
        const newEvent: IdentificationEvent = {
          id: `${requestId}-${Date.now()}`,
          visitorId: visitorId,
          ipAddress: ipInfo.address || identification.ip || "Unknown",
          countryCode: geolocation.country?.code,
          country: geolocation.country?.name,
          city: geolocation.city?.name,
          requestId: requestId,
          date: dayjs().format("MM/DD/YYYY HH:mm:ss"),
          timestamp: Date.now(),
          fullData: data, // Guardar todos los datos completos
        };

        setEvents((prevEvents) => {
          // Evitar duplicados basados en requestId
          const exists = prevEvents.some((e) => e.requestId === newEvent.requestId);
          if (exists) return prevEvents;

          const updated = [newEvent, ...prevEvents].slice(0, 100); // Limitar a 100 eventos
          saveEvents(updated);
          return updated;
        });
      }
    }
  }, [data]);

  // Filtrar eventos por fecha
  const filteredEvents = events.filter((event) => {
    if (selectedDate === "all") return true;
    if (selectedDate === "today") {
      return dayjs(event.timestamp).isSame(dayjs(), "day");
    }
    return true;
  });

  // Función para exportar eventos
  const handleExport = () => {
    const csv = [
      ["Visitor ID", "IP Address", "Request ID", "Date"].join(","),
      ...filteredEvents.map((event) =>
        [
          event.visitorId,
          event.ipAddress,
          event.requestId,
          event.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `identification-events-${dayjs().format("YYYY-MM-DD")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Función para copiar link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Identification events
              </h2>
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
                Select a row for details. Events data is also available by{" "}
                <span className="text-orange-500">server API</span>.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copy link
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
            <button
              onClick={() => setSelectedDate(selectedDate === "today" ? "all" : "today")}
              className={`flex items-center gap-2 rounded-lg border border-stroke px-4 py-2 text-sm font-medium transition ${
                selectedDate === "today"
                  ? "bg-primary text-white"
                  : "bg-white text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Today
            </button>
            <button
              onClick={() => {
                getData({ ignoreCache: true });
              }}
              disabled={isLoading}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Reload data"}
            </button>
          </div>

          <p className="mt-4 text-sm text-dark-6 dark:text-dark-6">
            {filteredEvents.length} events matching
          </p>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:font-semibold [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead className="min-w-[200px]">VISITOR ID</TableHead>
                <TableHead className="min-w-[180px]">IP ADDRESS</TableHead>
                <TableHead className="min-w-[200px]">REQUEST ID</TableHead>
                <TableHead className="min-w-[180px]">DATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-dark-6 dark:text-dark-6">
                    No events found. Click "Reload data" to generate an identification event.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="cursor-pointer transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
                  >
                    <TableCell className="font-medium text-dark dark:text-white">
                      {event.visitorId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl" title={event.country || "Unknown country"}>
                          {getCountryFlag(event.countryCode)}
                        </span>
                        <span className="font-mono text-sm text-dark dark:text-white">{event.ipAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-dark dark:text-white">
                      {event.requestId}
                    </TableCell>
                    <TableCell className="text-dark dark:text-white">
                      {event.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <DeviceDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          allEvents={events}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
