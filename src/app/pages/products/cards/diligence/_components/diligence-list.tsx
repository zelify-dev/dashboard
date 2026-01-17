"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../_components/cards-translations";
import dayjs from "dayjs";

export type Diligence = {
  id: string;
  cardholderName: string;
  cardNumber: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  submittedDate: string;
  reviewedDate?: string;
  reviewer?: string;
  riskLevel: "low" | "medium" | "high";
  documents: number;
};

const mockDiligences: Diligence[] = [
  {
    id: "dil_001",
    cardholderName: "John Doe",
    cardNumber: "**** 4532",
    status: "approved",
    submittedDate: "2024-01-10T09:00:00Z",
    reviewedDate: "2024-01-12T14:30:00Z",
    reviewer: "Sarah Johnson",
    riskLevel: "low",
    documents: 5,
  },
  {
    id: "dil_002",
    cardholderName: "Jane Smith",
    cardNumber: "**** 7890",
    status: "in_review",
    submittedDate: "2024-01-14T11:20:00Z",
    riskLevel: "medium",
    documents: 7,
  },
  {
    id: "dil_003",
    cardholderName: "Robert Johnson",
    cardNumber: "**** 1234",
    status: "rejected",
    submittedDate: "2024-01-08T15:45:00Z",
    reviewedDate: "2024-01-09T10:15:00Z",
    reviewer: "Michael Brown",
    riskLevel: "high",
    documents: 3,
  },
  {
    id: "dil_004",
    cardholderName: "Emily Davis",
    cardNumber: "**** 5678",
    status: "pending",
    submittedDate: "2024-01-15T08:30:00Z",
    riskLevel: "low",
    documents: 6,
  },
];

interface DiligenceListProps {
  diligences: Diligence[];
  onDiligenceClick: (diligence: Diligence) => void;
}

export function DiligenceList({ diligences, onDiligenceClick }: DiligenceListProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].diligence;
  const getStatusColor = (status: Diligence["status"]) => {
    switch (status) {
      case "approved":
        return "bg-[#219653]/[0.08] text-[#219653]";
      case "in_review":
        return "bg-[#FFA70B]/[0.08] text-[#FFA70B]";
      case "rejected":
        return "bg-[#D34053]/[0.08] text-[#D34053]";
      case "pending":
        return "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-dark-6";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRiskLevelColor = (riskLevel: Diligence["riskLevel"]) => {
    switch (riskLevel) {
      case "low":
        return "bg-[#219653]/[0.08] text-[#219653]";
      case "medium":
        return "bg-[#FFA70B]/[0.08] text-[#FFA70B]";
      case "high":
        return "bg-[#D34053]/[0.08] text-[#D34053]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-4" data-tour-id="tour-cards-diligence-list">
      {diligences.map((diligence) => (
        <div
          key={diligence.id}
          onClick={() => onDiligenceClick(diligence)}
          className="cursor-pointer rounded-lg border border-stroke bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-dark-3 dark:bg-dark-2"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-dark dark:text-white">
                    {diligence.cardholderName}
                  </h3>
                  <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
                    Card: {diligence.cardNumber}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize",
                    getStatusColor(diligence.status)
                  )}
                >
                  {t.status[diligence.status] ?? diligence.status}
                </div>
                <div
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize",
                    getRiskLevelColor(diligence.riskLevel)
                  )}
                >
                  {t.risk[diligence.riskLevel]} {t.risk.suffix}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-dark-6 dark:text-dark-6">{t.submitted}</p>
                  <p className="mt-1 text-sm font-medium text-dark dark:text-white">
                    {dayjs(diligence.submittedDate).format("MMM DD, YYYY")}
                  </p>
                </div>
                {diligence.reviewedDate && (
                  <div>
                    <p className="text-xs text-dark-6 dark:text-dark-6">{t.reviewed}</p>
                    <p className="mt-1 text-sm font-medium text-dark dark:text-white">
                      {dayjs(diligence.reviewedDate).format("MMM DD, YYYY")}
                    </p>
                  </div>
                )}
                {diligence.reviewer && (
                  <div>
                    <p className="text-xs text-dark-6 dark:text-dark-6">{t.reviewer}</p>
                    <p className="mt-1 text-sm font-medium text-dark dark:text-white">
                      {diligence.reviewer}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-dark-6 dark:text-dark-6">{t.documents}</p>
                  <p className="mt-1 text-sm font-medium text-dark dark:text-white">
                    {diligence.documents} {t.filesSuffix}
                  </p>
                </div>
              </div>
            </div>
            <svg
              className="h-5 w-5 text-dark-6 dark:text-dark-6"
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
          </div>
        </div>
      ))}
    </div>
  );
}

export { mockDiligences };


