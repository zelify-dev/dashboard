"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useLanguage } from "@/contexts/language-context";
import { useTour } from "@/contexts/tour-context";
import { cardsTranslations } from "../../_components/cards-translations";
import { CardDesign } from "../_components/card-design";
import { CardEditor, CardDesignConfig } from "./_components/card-editor";

const CARD_DESIGNS = [
  {
    id: "classic-blue",
    name: "Classic Blue",
    description: "Diseño clásico con gradiente azul",
    gradient: "from-blue-600 to-blue-800",
    textColor: "text-white",
    previewImage: "/images/card1.svg",
    cardNetwork: "visa" as const,
  },
  {
    id: "premium-black",
    name: "Premium Black",
    description: "Diseño elegante en negro premium",
    gradient: "from-gray-900 to-black",
    textColor: "text-white",
    previewImage: "/images/card2.svg",
    cardNetwork: "mastercard" as const,
  },
];

export default function CardsIssuingDesignPage() {
  const { language } = useLanguage();
  const t = cardsTranslations[language].issuing;
  const { isTourActive, currentStep, steps } = useTour();
  const [showEditor, setShowEditor] = useState(false);
  // TODO: Obtener el nombre del usuario desde la sesión
  const currentUserName = "Carlos Mendoza";

  // Manejar el tour para abrir/cerrar el editor según el paso
  useEffect(() => {
    if (isTourActive && steps.length > 0 && currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      // Abrir el editor solo cuando se muestre el paso "Crear Nuevo Diseño"
      if (currentStepData?.target === "tour-cards-create-design" && !showEditor) {
        setShowEditor(true);
      }
      // Cerrar el editor cuando se muestre el paso "Diseño de Tarjetas" para que el elemento sea visible
      if (currentStepData?.target === "tour-cards-issuing-design" && showEditor) {
        setShowEditor(false);
      }
    }
  }, [isTourActive, currentStep, steps, showEditor]);

  const handleAddNewDesign = () => {
    setShowEditor(true);
  };

  const handleSaveDesign = (config: CardDesignConfig) => {
    // TODO: Guardar el diseño en la base de datos
    console.log("Saving design:", config);
    setShowEditor(false);
  };

  if (showEditor) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <CardEditor
          onClose={() => setShowEditor(false)}
          onSave={handleSaveDesign}
          defaultUserName={currentUserName}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName={t.pageTitle} />

      <div className="mt-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">{t.designsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-tour-id="tour-cards-issuing-design">
          {CARD_DESIGNS.map((design) => (
            <CardDesign key={design.id} design={design} />
          ))}

          {/* Add New Design Button */}
          <button
            onClick={handleAddNewDesign}
            data-tour-id="tour-cards-create-design"
            className="group flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-stroke bg-white p-6 transition-all hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary dark:hover:bg-primary/10"
          >
            <div className="mb-4 flex items-center justify-center">
              <div className="relative h-20 w-32">
                <img
                  src="/images/card1.svg"
                  alt={t.addNewDesign}
                  className="absolute left-0 top-0 h-20 w-32 rounded-md object-contain shadow-sm transition-transform duration-200 group-hover:-translate-y-1"
                />
                <img
                  src="/images/card2.svg"
                  alt={t.addNewDesign}
                  className="absolute left-2 top-2 h-20 w-32 rounded-md object-contain shadow-md transition-transform duration-200 group-hover:-translate-y-2"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-dark dark:text-white">{t.addNewDesign}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
