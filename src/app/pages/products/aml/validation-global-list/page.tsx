"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui-elements/button";
import { AMLValidationsList, mockValidations, AMLValidation } from "./_components/aml-validations-list";
import { AMLValidationForm } from "./_components/aml-validation-form";
import { AMLValidationDetail } from "./_components/aml-validation-detail";
import { useLanguage } from "@/contexts/language-context";

export default function ValidationGlobalListPage() {
    const { language } = useLanguage();
  const [selectedValidationId, setSelectedValidationId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [validations, setValidations] = useState<AMLValidation[]>(mockValidations);

  const handleSelectValidation = (validationId: string) => {
    setSelectedValidationId(validationId);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedValidationId("new");
    setIsCreatingNew(true);
  };

  const handleBackToList = () => {
    setSelectedValidationId(null);
    setIsCreatingNew(false);
  };

  const handleStartVerification = (validation: AMLValidation) => {
    // Agregar con estado "pending"
    setValidations((prev) => [validation, ...prev]);
    setSelectedValidationId(null);
    setIsCreatingNew(false);

    // Después de 3-5 segundos, actualizar el estado aleatoriamente
    const delay = 3000 + Math.random() * 2000; // 3-5 segundos
    
    setTimeout(() => {
      setValidations((prev) => {
        const randomResult = Math.random();
        let updatedValidation: AMLValidation;

        if (randomResult < 0.4) {
          // 40% chance de encontrar en PEP u OFAC
          const lists = ["PEP", "OFAC"];
          const foundList = lists[Math.floor(Math.random() * lists.length)];
          updatedValidation = {
            ...validation,
            verification: foundList as any,
            foundIn: foundList,
            details: {
              listName: foundList,
              matchScore: Math.floor(Math.random() * 20) + 80,
              source: foundList === "PEP" ? "World-Check" : "US Treasury",
              dateFound: new Date().toISOString().split("T")[0],
            },
          };
        } else {
          // 60% chance de success
          updatedValidation = {
            ...validation,
            verification: "success",
          };
        }

        return prev.map((v) => (v.id === validation.id ? updatedValidation : v));
      });
    }, delay);
  };

  const selectedValidation = validations.find((v) => v.id === selectedValidationId);

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName={language === "es" ? "Validación de listas globales" : "Global List Validation"} />
      {selectedValidationId === "new" ? (
        <div>
          <div className="mb-4">
            <Button
              onClick={handleBackToList}
              label={language === "es" ? "Volver a validaciones" : "Back to Validations"}
              variant="outlineDark"
              shape="rounded"
              size="small"
              className="text-sm py-2 px-4"
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
            />
          </div>
          <AMLValidationForm onStartVerification={handleStartVerification} onCancel={handleBackToList} />
        </div>
      ) : selectedValidation ? (
        <div>
          <div className="mb-4">
            <Button
              onClick={handleBackToList}
              label={language === "es" ? "Volver a validaciones" : "Back to Validations"}
              variant="outlineDark"
              shape="rounded"
              size="small"
              className="text-sm py-2 px-4"
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
            />
          </div>
          <AMLValidationDetail validation={selectedValidation} />
        </div>
      ) : (
        <AMLValidationsList 
          validations={validations}
          onSelectValidation={handleSelectValidation} 
          onCreateNew={handleCreateNew}
        />
      )}
    </div>
  );
}

