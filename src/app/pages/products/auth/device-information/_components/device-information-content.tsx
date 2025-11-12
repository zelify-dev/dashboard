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

export function DeviceInformationContent() {
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );
  
  const [events, setEvents] = useState<IdentificationEvent[]>([]);

  // Cargar eventos al montar el componente
  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  // Agregar evento cuando se obtiene nuevo data
  useEffect(() => {
    if (data) {
      // ===== CONSOLE LOG: Datos completos del cliente =====
      console.log("=".repeat(80));
      console.log("📦 DATOS COMPLETOS DEL CLIENTE (useVisitorData):");
      console.log("=".repeat(80));
      console.log(JSON.stringify(data, null, 2));
      console.log("=".repeat(80));

      // Extraer datos directamente del objeto data (estructura plana)
      const visitorId = data.visitorId;
      const requestId = data.requestId;
      
      // Intentar obtener información de IP y geolocalización
      // Puede venir en diferentes estructuras dependiendo de la configuración
      let ipAddress = data.ip || "Unknown";
      let countryCode: string | undefined;
      let country: string | undefined;
      let city: string | undefined;

      // Si hay datos de ipInfo (estructura extendida)
      if (data.ipInfo?.data?.v4) {
        const ipInfo = data.ipInfo.data.v4;
        ipAddress = ipInfo.address || ipAddress;
        const geolocation = ipInfo.geolocation || {};
        countryCode = geolocation.country?.code;
        country = geolocation.country?.name;
        city = geolocation.city?.name;
      } else if (data.ipLocation) {
        // Estructura alternativa
        ipAddress = data.ipLocation?.address || ipAddress;
        countryCode = data.ipLocation?.country?.code;
        country = data.ipLocation?.country?.name;
        city = data.ipLocation?.city?.name;
      }
      
      if (visitorId && requestId) {
        const newEvent: IdentificationEvent = {
          id: `${requestId}-${Date.now()}`,
          visitorId: visitorId,
          ipAddress: ipAddress,
          countryCode: countryCode,
          country: country,
          city: city,
          requestId: requestId,
          date: dayjs().format("MM/DD/YYYY HH:mm:ss"),
          timestamp: Date.now(),
          fullData: data,
        };

        setEvents((prevEvents) => {
          // Evitar duplicados basados en requestId
          const exists = prevEvents.some((e) => e.requestId === newEvent.requestId);
          if (exists) return prevEvents;

          const updated = [newEvent, ...prevEvents].slice(0, 100);
          saveEvents(updated);
          return updated;
        });

        // Consultar Server API para obtener datos completos
        const fetchServerData = async () => {
          try {
            // Consultar por requestId
            console.log("\n" + "=".repeat(80));
            console.log("🔍 CONSULTANDO SERVER API - Evento por requestId:", requestId);
            console.log("=".repeat(80));
            
            const eventResponse = await fetch(`/api/fingerprint/events?request_id=${requestId}`);
            const eventResult = await eventResponse.json();
            
            if (eventResult.success) {
              console.log("✅ RESPUESTA DEL SERVER API (por requestId):");
              console.log(JSON.stringify(eventResult.data, null, 2));
            } else {
              console.error("❌ Error en Server API:", eventResult.error);
            }

            // Consultar por visitorId para obtener historial
            console.log("\n" + "=".repeat(80));
            console.log("🔍 CONSULTANDO SERVER API - Historial por visitorId:", visitorId);
            console.log("=".repeat(80));
            
            const historyResponse = await fetch(`/api/fingerprint/events?visitor_id=${visitorId}&limit=10`);
            const historyResult = await historyResponse.json();
            
            if (historyResult.success) {
              console.log("✅ RESPUESTA DEL SERVER API (historial por visitorId):");
              console.log(JSON.stringify(historyResult.data, null, 2));
            } else {
              console.error("❌ Error en Server API:", historyResult.error);
            }

            console.log("=".repeat(80) + "\n");
          } catch (err) {
            console.error("❌ Error al consultar Server API:", err);
          }
        };

        fetchServerData();
      }
    }
  }, [data]);

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Identification events
            </h2>
            <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
              {events.length} events matching
            </p>
          </div>
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
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-dark-6 dark:text-dark-6">
                    No events found. Click "Reload data" to generate an identification event.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
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
    </div>
  );
}
