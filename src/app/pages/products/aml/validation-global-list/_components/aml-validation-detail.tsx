"use client";

import { AMLValidation } from "./aml-validations-list";

interface AMLValidationDetailProps {
  validation: AMLValidation;
}

interface AMLListInfo {
  name: string;
  country: string;
  icon: React.ReactNode;
}

const GlobalIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const USIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

const allAMLlists: AMLListInfo[] = [
  { name: "PEP", country: "Global", icon: <GlobalIcon /> },
  { name: "OFAC", country: "United States", icon: <USIcon /> },
  { name: "Sanctions", country: "Global", icon: <GlobalIcon /> },
  { name: "Watchlist", country: "Global", icon: <GlobalIcon /> },
  { name: "Adverse Media", country: "Global", icon: <GlobalIcon /> },
];

export function AMLValidationDetail({ validation }: AMLValidationDetailProps) {
  const isSuccess = validation.verification === "success";
  const isPending = validation.verification === "pending";
  const hasMatch = !isSuccess && !isPending && (validation.verification === "PEP" || validation.verification === "OFAC");
  // Determinar el estado de cada lista
  const getListStatus = (listName: string): "checked" | "match" => {
    if (isPending) return "checked";
    if (hasMatch && (validation.foundIn === listName || validation.verification === listName)) {
      return "match";
    }
    return "checked";
  };
  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark dark:text-white">Detalle de Validación AML</h2>
      </div>
      <div className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">Nombre</label>
            <p className="text-sm text-dark-6 dark:text-dark-6">{validation.name}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">País</label>
            <p className="text-sm text-dark-6 dark:text-dark-6">{validation.country}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">Número de Documento</label>
            <p className="text-sm text-dark-6 dark:text-dark-6">{validation.documentNumber}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">Fecha de Creación</label>
            <p className="text-sm text-dark-6 dark:text-dark-6">{validation.createdAt}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">Estado</label>
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <svg className="h-3.5 w-3.5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Aprobado</span>
                </>
              ) : isPending ? (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                    <svg className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Pendiente</span>
                </>
              ) : (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <svg className="h-3.5 w-3.5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{validation.foundIn || validation.verification}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Lista de todas las listas AML verificadas */}
        <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Listas AML Verificadas</h3>
          <div className="space-y-3">
            {allAMLlists.map((list) => {
              const status = getListStatus(list.name);
              const isMatch = status === "match";
              return (
                <div
                  key={list.name}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    isMatch
                      ? "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10"
                      : "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-dark-3 text-primary dark:text-primary border border-stroke dark:border-dark-3">
                      {list.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark dark:text-white">{list.name}</p>
                      <p className="text-xs text-dark-6 dark:text-dark-6">{list.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMatch ? (
                      <>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                          <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Coincidencia encontrada</span>
                      </>
                    ) : (
                      <>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Aprobado</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Detalles del Match */}
        {hasMatch && validation.details && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
            <h3 className="mb-4 text-lg font-semibold text-red-800 dark:text-red-400">Información de la coincidencia en lista AML</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-red-700 dark:text-red-300">Lista AML</label>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">{validation.details.listName || validation.foundIn || validation.verification}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-red-700 dark:text-red-300">Puntaje de coincidencia</label>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">{validation.details.matchScore || 85}%</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-red-700 dark:text-red-300">Fuente</label>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">{validation.details.source || (validation.verification === "PEP" ? "World-Check" : "US Treasury")}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-red-700 dark:text-red-300">Fecha de encuentro</label>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">{validation.details.dateFound || validation.createdAt}</p>
              </div>
            </div>
          </div>
        )}
        {/* Mensaje de éxito */}
        {isSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-900/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">Validación exitosa</h3>
                <p className="text-sm text-green-700 dark:text-green-300">No se encontraron coincidencias en ninguna lista AML. El documento está limpio.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

