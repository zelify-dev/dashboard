"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipos de datos
type LogType = "API request" | "Webhook" | "Link event";
type Environment = "Production" | "Sandbox";
type ResponseCode = "200" | "400" | "401" | "404" | "500" | "200 OK" | "401 Unauthorized" | "404 Not Found" | "500 Server Error";

interface Log {
  id: string;
  type: LogType;
  description: string;
  institution: string;
  environment: Environment;
  timestamp: string;
  responseCode: ResponseCode;
  errorCodes?: string;
  response: string;
}

// Datos de ejemplo (en producción vendrían de una API)
const MOCK_LOGS: Log[] = [
  {
    id: "1",
    type: "API request",
    description: "Transaction completed successfully",
    institution: "Bank of America",
    environment: "Production",
    timestamp: "2024-10-15 14:30:25",
    responseCode: "200 OK",
    response: '{"status": "success", "transaction_id": "txn_123456789", "amount": 1500.00}',
  },
  {
    id: "2",
    type: "API request",
    description: "Authentication error - insufficient credentials",
    institution: "Chase Bank",
    environment: "Sandbox",
    timestamp: "2024-10-15 14:28:12",
    responseCode: "401 Unauthorized",
    errorCodes: "INSUFFICIENT_CREDENTIALS",
    response: '{"error": "Invalid credentials", "code": "INSUFFICIENT_CREDENTIALS", "message": "The provided credentials are not valid"}',
  },
  {
    id: "3",
    type: "Webhook",
    description: "Account update notification received",
    institution: "Wells Fargo",
    environment: "Production",
    timestamp: "2024-10-15 14:25:45",
    responseCode: "200",
    response: '{"event": "ACCOUNT_UPDATE", "account_id": "acc_987654321", "timestamp": "2024-10-15T14:25:45Z"}',
  },
  {
    id: "4",
    type: "Link event",
    description: "User successfully linked bank account",
    institution: "Citibank",
    environment: "Production",
    timestamp: "2024-10-15 14:20:33",
    responseCode: "200 OK",
    response: '{"status": "success", "link_id": "link_abc123", "institution": "Citibank", "accounts": 2}',
  },
  {
    id: "5",
    type: "API request",
    description: "Endpoint not found",
    institution: "Bank of America",
    environment: "Sandbox",
    timestamp: "2024-10-15 14:15:08",
    responseCode: "404 Not Found",
    errorCodes: "ENDPOINT_NOT_FOUND",
    response: '{"error": "Endpoint not found", "code": "ENDPOINT_NOT_FOUND", "path": "/api/v1/invalid-endpoint"}',
  },
  {
    id: "6",
    type: "Webhook",
    description: "Transaction failed - insufficient funds",
    institution: "Chase Bank",
    environment: "Production",
    timestamp: "2024-10-15 14:10:22",
    responseCode: "500 Server Error",
    errorCodes: "INSUFFICIENT_FUNDS",
    response: '{"error": "Transaction failed", "code": "INSUFFICIENT_FUNDS", "account_balance": 45.50, "requested_amount": 200.00}',
  },
  {
    id: "7",
    type: "Link event",
    description: "User exited link flow",
    institution: "Wells Fargo",
    environment: "Sandbox",
    timestamp: "2024-10-15 14:05:17",
    responseCode: "200 OK",
    response: '{"event": "EXIT", "link_session_id": "link_sess_xyz789", "exit_reason": "user_cancelled"}',
  },
  {
    id: "8",
    type: "API request",
    description: "Balance inquiry successful",
    institution: "Citibank",
    environment: "Production",
    timestamp: "2024-10-15 14:00:55",
    responseCode: "200 OK",
    response: '{"status": "success", "account_id": "acc_456789", "balance": {"available": 5000.00, "current": 5000.00}}',
  },
  {
    id: "9",
    type: "Webhook",
    description: "Identity verification completed",
    institution: "Bank of America",
    environment: "Production",
    timestamp: "2024-10-15 13:55:40",
    responseCode: "200",
    response: '{"event": "IDENTITY_VERIFIED", "user_id": "user_123", "verification_status": "verified", "timestamp": "2024-10-15T13:55:40Z"}',
  },
  {
    id: "10",
    type: "Link event",
    description: "Error during account linking - access not granted",
    institution: "Chase Bank",
    environment: "Production",
    timestamp: "2024-10-15 13:50:15",
    responseCode: "401 Unauthorized",
    errorCodes: "ACCESS_NOT_GRANTED",
    response: '{"error": "Access not granted", "code": "ACCESS_NOT_GRANTED", "message": "User did not grant necessary permissions"}',
  },
  {
    id: "11",
    type: "API request",
    description: "Transaction history retrieved",
    institution: "Wells Fargo",
    environment: "Sandbox",
    timestamp: "2024-10-15 13:45:30",
    responseCode: "200 OK",
    response: '{"status": "success", "transactions": [{"id": "txn_001", "amount": -50.00}, {"id": "txn_002", "amount": 100.00}], "count": 2}',
  },
  {
    id: "12",
    type: "Webhook",
    description: "Server error processing webhook",
    institution: "Citibank",
    environment: "Production",
    timestamp: "2024-10-15 13:40:18",
    responseCode: "500 Server Error",
    errorCodes: "INTERNAL_SERVER_ERROR",
    response: '{"error": "Internal server error", "code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred"}',
  },
  {
    id: "13",
    type: "API request",
    description: "Account information retrieved successfully",
    institution: "Bank of America",
    environment: "Production",
    timestamp: "2024-10-15 13:35:42",
    responseCode: "200 OK",
    response: '{"status": "success", "account": {"id": "acc_789", "name": "Checking Account", "type": "depository", "subtype": "checking"}}',
  },
  {
    id: "14",
    type: "Link event",
    description: "Handoff event - user redirected to institution",
    institution: "Chase Bank",
    environment: "Sandbox",
    timestamp: "2024-10-15 13:30:05",
    responseCode: "200 OK",
    response: '{"event": "HANDOFF", "link_session_id": "link_sess_handoff123", "institution_id": "ins_109508"}',
  },
  {
    id: "15",
    type: "API request",
    description: "Invalid request parameters",
    institution: "Wells Fargo",
    environment: "Production",
    timestamp: "2024-10-15 13:25:50",
    responseCode: "400",
    errorCodes: "INVALID_REQUEST",
    response: '{"error": "Invalid request parameters", "code": "INVALID_REQUEST", "details": "Missing required field: account_id"}',
  },
];

const LOG_TYPES: LogType[] = ["API request", "Webhook", "Link event"];
const ENVIRONMENTS: Environment[] = ["Production", "Sandbox"];
const RESPONSE_CODES: ResponseCode[] = ["200", "400", "401", "404", "500"];

export function LogsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    institution: "",
    environment: "",
    responseCode: "",
    errorCodes: "",
    date: "",
    timezone: "-05",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = MOCK_LOGS.filter((log) => {
    // Filtro por búsqueda
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        log.description.toLowerCase().includes(searchLower) ||
        log.institution.toLowerCase().includes(searchLower) ||
        log.type.toLowerCase().includes(searchLower) ||
        log.responseCode.toLowerCase().includes(searchLower) ||
        log.errorCodes?.toLowerCase().includes(searchLower) ||
        log.response.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por tipo
    if (filters.type && log.type !== filters.type) return false;

    // Filtro por institución
    if (filters.institution && log.institution !== filters.institution) return false;

    // Filtro por ambiente
    if (filters.environment && log.environment !== filters.environment) return false;

    // Filtro por código de respuesta
    if (filters.responseCode && !log.responseCode.includes(filters.responseCode)) return false;

    // Filtro por códigos de error
    if (filters.errorCodes && !log.errorCodes?.toLowerCase().includes(filters.errorCodes.toLowerCase())) return false;

    // Filtro por fecha
    if (filters.date) {
      const logDate = log.timestamp.split(" ")[0]; // Extraer solo la fecha
      if (logDate !== filters.date) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setFilters({
      type: "",
      institution: "",
      environment: "",
      responseCode: "",
      errorCodes: "",
      date: "",
      timezone: "-05",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getResponseCodeColor = (code: string) => {
    if (code.startsWith("2")) return "text-green-600 dark:text-green-400";
    if (code.startsWith("4")) return "text-yellow-600 dark:text-yellow-400";
    if (code.startsWith("5")) return "text-red-600 dark:text-red-400";
    return "text-dark-6 dark:text-dark-6";
  };

  const formatTimestampWithTimezone = (timestamp: string, timezone: string) => {
    try {
      // Parsear el timestamp (formato: "2024-10-15 14:30:25")
      const [datePart, timePart] = timestamp.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);

      // Crear fecha en UTC (asumiendo que el timestamp original está en UTC)
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

      // Obtener el offset del timezone (ej: "-05" = -5 horas)
      const offsetHours = parseInt(timezone.replace("+", ""), 10);

      // Aplicar el offset
      const adjustedDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);

      // Formatear la fecha ajustada
      const adjustedYear = adjustedDate.getUTCFullYear();
      const adjustedMonth = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
      const adjustedDay = String(adjustedDate.getUTCDate()).padStart(2, "0");
      const adjustedHours = String(adjustedDate.getUTCHours()).padStart(2, "0");
      const adjustedMinutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
      const adjustedSeconds = String(adjustedDate.getUTCSeconds()).padStart(2, "0");

      return `${adjustedYear}-${adjustedMonth}-${adjustedDay} ${adjustedHours}:${adjustedMinutes}:${adjustedSeconds} UTC${timezone}`;
    } catch (error) {
      // Si hay error, devolver el timestamp original
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute left-0 top-0 z-10 flex h-full items-center rounded-l-lg border border-r-0 border-stroke bg-gray-1 px-4 text-sm font-semibold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            Client User ID
          </div>
          <input
            type="text"
            placeholder="Search by the client_user_id configured on the link_token"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-[140px] pr-12 text-sm text-dark shadow-sm outline-none transition-all placeholder:text-dark-6 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:placeholder:text-dark-6 dark:focus:border-primary"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-dark-6 transition-colors hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <select
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setCurrentPage(1);
            }}
            className={`appearance-none rounded-lg border border-stroke bg-white px-4 py-2.5 pr-8 text-sm font-medium text-dark shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:hover:border-primary/50 ${
              filters.type ? "border-primary bg-primary/5 dark:bg-primary/10" : ""
            }`}
          >
            <option value="">Type</option>
            {LOG_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6 dark:text-dark-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <select
            value={filters.institution}
            onChange={(e) => {
              setFilters({ ...filters, institution: e.target.value });
              setCurrentPage(1);
            }}
            className={`appearance-none rounded-lg border border-stroke bg-white px-4 py-2.5 pr-8 text-sm font-medium text-dark shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:hover:border-primary/50 ${
              filters.institution ? "border-primary bg-primary/5 dark:bg-primary/10" : ""
            }`}
          >
            <option value="">Institution</option>
            <option value="Bank of America">Bank of America</option>
            <option value="Chase Bank">Chase Bank</option>
            <option value="Wells Fargo">Wells Fargo</option>
            <option value="Citibank">Citibank</option>
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6 dark:text-dark-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <select
            value={filters.environment}
            onChange={(e) => {
              setFilters({ ...filters, environment: e.target.value });
              setCurrentPage(1);
            }}
            className={`appearance-none rounded-lg border border-stroke bg-white px-4 py-2.5 pr-8 text-sm font-medium text-dark shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:hover:border-primary/50 ${
              filters.environment ? "border-primary bg-primary/5 dark:bg-primary/10" : ""
            }`}
          >
            <option value="">Environment</option>
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6 dark:text-dark-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <select
            value={filters.responseCode}
            onChange={(e) => {
              setFilters({ ...filters, responseCode: e.target.value });
              setCurrentPage(1);
            }}
            className={`appearance-none rounded-lg border border-stroke bg-white px-4 py-2.5 pr-8 text-sm font-medium text-dark shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:hover:border-primary/50 ${
              filters.responseCode ? "border-primary bg-primary/5 dark:bg-primary/10" : ""
            }`}
          >
            <option value="">Response Code</option>
            {RESPONSE_CODES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6 dark:text-dark-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Error Codes"
          value={filters.errorCodes}
          onChange={(e) => {
            setFilters({ ...filters, errorCodes: e.target.value });
            setCurrentPage(1);
          }}
          className={`rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm font-medium text-dark shadow-sm outline-none transition-all placeholder:text-dark-6 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:placeholder:text-dark-6 dark:hover:border-primary/50 ${
            filters.errorCodes ? "border-primary bg-primary/5 dark:bg-primary/10" : ""
          }`}
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) => {
            setFilters({ ...filters, date: e.target.value });
            setCurrentPage(1);
          }}
          className={`rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm font-medium text-dark shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:hover:border-primary/50 ${
            filters.date ? "border-primary bg-primary/5 dark:bg-primary/10" : ""
          }`}
        />

        <div className="relative">
          <select
            value={filters.timezone}
            onChange={(e) => setFilters({ ...filters, timezone: e.target.value })}
            className="appearance-none rounded-lg border border-stroke bg-white px-4 py-2.5 pr-8 text-sm font-medium text-dark shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark dark:text-white dark:hover:border-primary/50"
          >
            <option value="-05">-05</option>
            <option value="-06">-06</option>
            <option value="-07">-07</option>
            <option value="+00">+00</option>
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6 dark:text-dark-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <button
          onClick={handleResetFilters}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark-6 shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6 dark:hover:bg-primary/10 dark:hover:text-primary"
          aria-label="Reset filters"
          title="Reset all filters"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-gray-1 dark:bg-dark-3 [&>th]:py-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="cursor-pointer hover:text-primary">
                <div className="flex items-center gap-2">
                  Type
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary">
                <div className="flex items-center gap-2">
                  Description
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary">
                <div className="flex items-center gap-2">
                  Institution
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary">
                <div className="flex items-center gap-2">
                  Environment
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary">
                <div className="flex items-center gap-2">
                  Timestamp
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary">
                <div className="flex items-center gap-2">
                  Response
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="mx-auto max-w-md">
                    <p className="mb-2 text-base font-semibold text-dark dark:text-white">
                      No logs found, try another set of filters
                    </p>
                    <p className="text-sm text-dark-6 dark:text-dark-6">
                      We don't have logs stored for the filters you selected. Try
                      another set of options and filter again. Please note that we
                      only store logs for the last 14 days, and only support
                      handoff/exit/error events for link logs.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="text-sm text-dark dark:text-white"
                >
                  <TableCell className="font-medium">{log.type}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.institution}</TableCell>
                  <TableCell>{log.environment}</TableCell>
                  <TableCell>
                    {formatTimestampWithTimezone(log.timestamp, filters.timezone)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={getResponseCodeColor(log.responseCode)}>
                        {log.responseCode}
                      </span>
                      {log.errorCodes && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                          ({log.errorCodes})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-xs">
                    {log.response}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded border border-stroke bg-white text-dark-6 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark dark:text-dark-6 dark:hover:bg-dark-3"
            aria-label="First page"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded border border-stroke bg-white text-dark-6 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark dark:text-dark-6 dark:hover:bg-dark-3"
            aria-label="Previous page"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="px-4 text-sm text-dark dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded border border-stroke bg-white text-dark-6 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark dark:text-dark-6 dark:hover:bg-dark-3"
            aria-label="Next page"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded border border-stroke bg-white text-dark-6 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark dark:text-dark-6 dark:hover:bg-dark-3"
            aria-label="Last page"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

