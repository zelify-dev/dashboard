"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui-elements/button";
import { AMLValidation } from "./aml-validations-list";
import { useLanguage } from "@/contexts/language-context";

interface AMLValidationFormProps {
  onStartVerification: (validation: AMLValidation) => void;
  onCancel: () => void;
}

const countries = [
  "Ecuador",
  "Mexico",
  "Brazil",
  "Colombia",
  "United States",
  "Argentina",
  "Chile",
  "Peru",
];

const searchSteps = [
  "Buscando en lista PEP...",
  "Verificando lista OFAC...",
  "Consultando Sanctions List...",
  "Revisando Watchlist...",
  "Analizando Adverse Media...",
  "Verificando bases de datos globales...",
  "Finalizando verificación...",
];

const firstNames = [
  "Carlos", "María", "Juan", "Ana", "Luis", "Laura", "Pedro", "Carmen",
  "José", "Patricia", "Miguel", "Sandra", "Roberto", "Andrea", "Fernando", "Monica",
  "Ricardo", "Gabriela", "Daniel", "Isabel", "Alejandro", "Lucía", "Francisco", "Elena",
  "Andrés", "Claudia", "Javier", "Natalia", "Diego", "Valentina", "Sergio", "Camila",
  "Manuel", "Sofía", "Antonio", "Paula", "Rafael", "Daniela", "Eduardo", "Mariana",
  "David", "Carolina", "Jorge", "Alejandra", "Pablo", "Fernanda", "Gustavo", "Adriana",
  "Alberto", "Cristina", "Mario", "Verónica", "Oscar", "Tatiana", "Hector", "Diana"
];

const lastNames = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez",
  "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Álvarez",
  "Muñoz", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez",
  "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Suárez", "Molina", "Morales",
  "Ortega", "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Iglesias",
  "Nuñez", "Medina", "Garrido", "Cortés", "Castillo", "Santos", "Lozano", "Guerrero"
];

function generateRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

export function AMLValidationForm({ onStartVerification, onCancel }: AMLValidationFormProps) {
    const { language } = useLanguage();
  const [country, setCountry] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isSearching) return;

    const duration = 3000 + Math.random() * 2000; // 3-5 segundos
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      
      // Actualizar step
      const stepIndex = Math.min(
        searchSteps.length - 1,
        Math.floor((elapsed / duration) * searchSteps.length)
      );
      
      setProgress(currentProgress);
      setCurrentStep(stepIndex);

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Crear validación con estado "pending" y agregar a la tabla
        const pendingValidation: AMLValidation = {
          id: Date.now().toString(),
          name: generateRandomName(),
          documentNumber,
          country,
          verification: "pending",
          createdAt: new Date().toISOString().split("T")[0],
        };

        // Agregar a la lista con estado pending
        onStartVerification(pendingValidation);
        
        // Resetear el formulario
        setIsSearching(false);
        setProgress(0);
        setCurrentStep(0);
        setCountry("");
        setDocumentNumber("");
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isSearching, country, documentNumber, onStartVerification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!country || !documentNumber.trim()) return;
    setIsSearching(true);
    setProgress(0);
    setCurrentStep(0);
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark dark:text-white">{language === "es" ? "Nueva validación AML" : "New AML Validation"}</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">
          {language === "es"
            ? "Ingrese el número de documento de identificación para realizar la búsqueda"
            : "Enter the identification document number to perform the search"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="country" className="mb-2 block text-sm font-semibold text-dark dark:text-white">
            {language === "es" ? "País" : "Country"}
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isSearching}
            className="block w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:opacity-50"
            required
          >
            <option value="">{language === "es" ? "Seleccione un país" : "Select a country"}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="documentNumber" className="mb-2 block text-sm font-semibold text-dark dark:text-white">
            {language === "es" ? "Número de documento de identificación" : "Identification Document Number"}
          </label>
          <input
            id="documentNumber"
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            disabled={isSearching}
            placeholder={language === "es" ? "Ingrese el número de documento" : "Enter document number"}
            className="block w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6 disabled:opacity-50"
            required
          />
        </div>

        {isSearching && (
          <div className="space-y-4">
            {/* Barra de progreso */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-dark-6 dark:text-dark-6">
                  {language === "es"
                    ? searchSteps[currentStep] || "Verificando..."
                    : [
                        "Searching in PEP list...",
                        "Checking OFAC list...",
                        "Consulting Sanctions List...",
                        "Reviewing Watchlist...",
                        "Analyzing Adverse Media...",
                        "Checking global databases...",
                        "Finishing verification...",
                      ][currentStep] || "Verifying..."}
                </span>
                <span className="font-medium text-dark dark:text-white">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {!isSearching && (
          <div className="flex gap-3">
            <Button
              type="submit"
              label={language === "es" ? "Verificar" : "Verify"}
              variant="primary"
              shape="rounded"
              size="small"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={onCancel}
              label={language === "es" ? "Cancelar" : "Cancel"}
              variant="outlineDark"
              shape="rounded"
              size="small"
            />
          </div>
        )}
      </form>
    </div>
  );
}

