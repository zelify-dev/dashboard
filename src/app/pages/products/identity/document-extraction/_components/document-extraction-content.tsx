"use client";

import { useState, useRef, useCallback } from "react";

interface ExtractedData {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  address: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
}

// Datos mockeados controlados
const MOCK_DATA: ExtractedData = {
  documentType: "Cédula de Identidad",
  documentNumber: "1712345678",
  firstName: "Juan",
  lastName: "Pérez",
  fullName: "Juan Carlos Pérez González",
  nationality: "Ecuatoriana",
  dateOfBirth: "15/03/1990",
  placeOfBirth: "Quito, Pichincha",
  gender: "Masculino",
  address: "Av. Amazonas N12-34 y Roca, Quito",
  issueDate: "10/05/2015",
  expiryDate: "10/05/2025",
  issuingAuthority: "Registro Civil del Ecuador",
};

// Componente para generar la cédula mockeada
function MockCedulaCard({ data }: { data: ExtractedData }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border-2 border-gray-300 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg dark:border-gray-600 dark:from-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="mb-4 border-b-2 border-blue-600 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              REPÚBLICA DEL ECUADOR
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              REGISTRO CIVIL
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              CÉDULA DE IDENTIDAD
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              No. {data.documentNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Photo placeholder */}
      <div className="mb-4 flex gap-4">
        <div className="h-24 w-20 rounded border-2 border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-700">
          <div className="flex h-full items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            FOTO
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">APELLIDOS:</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{data.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">NOMBRES:</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{data.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">NACIONALIDAD:</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.nationality}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-gray-300 pb-1 dark:border-gray-600">
          <span className="font-semibold text-gray-600 dark:text-gray-400">FECHA DE NACIMIENTO:</span>
          <span className="text-gray-900 dark:text-white">{data.dateOfBirth}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1 dark:border-gray-600">
          <span className="font-semibold text-gray-600 dark:text-gray-400">LUGAR DE NACIMIENTO:</span>
          <span className="text-gray-900 dark:text-white">{data.placeOfBirth}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1 dark:border-gray-600">
          <span className="font-semibold text-gray-600 dark:text-gray-400">SEXO:</span>
          <span className="text-gray-900 dark:text-white">{data.gender}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1 dark:border-gray-600">
          <span className="font-semibold text-gray-600 dark:text-gray-400">DOMICILIO:</span>
          <span className="text-right text-gray-900 dark:text-white">{data.address}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1 dark:border-gray-600">
          <span className="font-semibold text-gray-600 dark:text-gray-400">FECHA DE EXPEDICIÓN:</span>
          <span className="text-gray-900 dark:text-white">{data.issueDate}</span>
        </div>
        <div className="flex justify-between pb-1">
          <span className="font-semibold text-gray-600 dark:text-gray-400">VÁLIDA HASTA:</span>
          <span className="text-gray-900 dark:text-white">{data.expiryDate}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t-2 border-blue-600 pt-2 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.issuingAuthority}
        </p>
      </div>
    </div>
  );
}

export function DocumentExtractionContent() {
  const [isDragging, setIsDragging] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona una imagen válida");
      return;
    }

    // Simular procesamiento OCR (no importa qué archivo se suba)
    setIsProcessing(true);
    setExtractedData(null);
    setShowDocument(false);
    setProcessingStep("Cargando imagen...");

    // Simular pasos del procesamiento
    const steps = [
      "Analizando imagen...",
      "Detectando tipo de documento...",
      "Extrayendo texto con OCR...",
      "Validando campos...",
      "Verificando con bases de datos...",
      "Procesamiento completado",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingStep(steps[i]);
    }

    // Mostrar cédula mockeada y datos extraídos (siempre los mismos datos controlados)
    setTimeout(() => {
      setExtractedData(MOCK_DATA);
      setShowDocument(true);
      setIsProcessing(false);
      setProcessingStep("");
    }, 500);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleReset = () => {
    setShowDocument(false);
    setExtractedData(null);
    setIsProcessing(false);
    setProcessingStep("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Upload Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Subir Documento
        </h2>
        <p className="mb-6 text-sm text-dark-6 dark:text-dark-6">
          Arrastra una imagen de tu documento (cédula, pasaporte o licencia) o haz clic para seleccionar
        </p>

        {!showDocument && !isProcessing && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-stroke hover:border-primary dark:border-dark-3"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <svg
                className="h-16 w-16 text-dark-6 dark:text-dark-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <p className="text-lg font-medium text-dark dark:text-white">
                  Arrastra y suelta tu documento aquí
                </p>
                <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
                  o haz clic para seleccionar un archivo
                </p>
                <p className="mt-1 text-xs text-dark-6 dark:text-dark-6">
                  Formatos soportados: JPG, PNG, PDF (máx. 10MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="mt-6 rounded-lg border border-stroke bg-gray-2 p-6 dark:border-dark-3 dark:bg-dark-3">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Procesando documento...
                </p>
                <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
                  {processingStep}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mock Cédula Preview */}
        {showDocument && extractedData && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Documento Procesado
              </h3>
              <button
                onClick={handleReset}
                className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                Procesar otro documento
              </button>
            </div>
            <div className="rounded-lg border border-stroke bg-gray-2 p-6 dark:border-dark-3 dark:bg-dark-3">
              <MockCedulaCard data={extractedData} />
            </div>
          </div>
        )}
      </div>

      {/* Extracted Data Section */}
      {extractedData && (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Datos Extraídos
              </h2>
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
                Información extraída del documento mediante OCR
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                ✓ Verificado
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Información Personal
              </h3>
              <div className="space-y-3">
                <DataField label="Tipo de Documento" value={extractedData.documentType} />
                <DataField label="Número de Documento" value={extractedData.documentNumber} />
                <DataField label="Nombres" value={extractedData.firstName} />
                <DataField label="Apellidos" value={extractedData.lastName} />
                <DataField label="Nombre Completo" value={extractedData.fullName} />
                <DataField label="Nacionalidad" value={extractedData.nationality} />
                <DataField label="Fecha de Nacimiento" value={extractedData.dateOfBirth} />
                <DataField label="Lugar de Nacimiento" value={extractedData.placeOfBirth} />
                <DataField label="Género" value={extractedData.gender} />
              </div>
            </div>

            {/* Información del Documento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Información del Documento
              </h3>
              <div className="space-y-3">
                <DataField label="Dirección" value={extractedData.address} />
                <DataField label="Fecha de Emisión" value={extractedData.issueDate} />
                <DataField label="Fecha de Expiración" value={extractedData.expiryDate} />
                <DataField label="Autoridad Emisora" value={extractedData.issuingAuthority} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4 border-t border-stroke pt-6 dark:border-dark-3">
            <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition hover:opacity-90">
              Validar con Base de Datos
            </button>
            <button className="rounded-lg border border-stroke bg-white px-6 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3">
              Exportar Datos
            </button>
            <button className="rounded-lg border border-stroke bg-white px-6 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3">
              Ver JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar campos de datos
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stroke bg-gray-2 p-3 dark:border-dark-3 dark:bg-dark-3">
      <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-dark dark:text-white">
        {value}
      </p>
    </div>
  );
}

