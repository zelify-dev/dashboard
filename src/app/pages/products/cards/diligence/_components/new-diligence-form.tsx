"use client";

import { useState } from "react";
import { Diligence } from "./diligence-list";
import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../_components/cards-translations";

interface NewDiligenceFormProps {
  onSave: (diligence: Omit<Diligence, "id" | "submittedDate">) => void;
  onCancel: () => void;
}

export function NewDiligenceForm({ onSave, onCancel }: NewDiligenceFormProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].diligence.newForm;
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    riskLevel: "low" as Diligence["riskLevel"],
    documents: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: "pending",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative w-full max-w-2xl rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2"
        data-tour-id="tour-cards-diligence-create"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke p-6 dark:border-dark-3">
          <h2 className="text-2xl font-bold text-dark dark:text-white">{t.title}</h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-dark-6 hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.cardholderName}</label>
              <input
                type="text"
                required
                value={formData.cardholderName}
                onChange={(e) =>
                  setFormData({ ...formData, cardholderName: e.target.value })
                }
                className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                placeholder={t.placeholders.cardholderName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.cardNumber}</label>
              <input
                type="text"
                required
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
                className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                placeholder={t.placeholders.cardNumber}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.riskLevel}</label>
              <select
                value={formData.riskLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    riskLevel: e.target.value as Diligence["riskLevel"],
                  })
                }
                className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <option value="low">{cardsTranslations[language].diligence.risk.low}</option>
                <option value="medium">{cardsTranslations[language].diligence.risk.medium}</option>
                <option value="high">{cardsTranslations[language].diligence.risk.high}</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{t.numberOfDocuments}</label>
              <input
                type="number"
                min="0"
                required
                value={formData.documents}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              {t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


