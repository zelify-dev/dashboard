"use client";

import { Transaction } from "./transactions-table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useLanguage } from "@/contexts/language-context";
import { cardsTranslations } from "../../_components/cards-translations";

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  const { language } = useLanguage();
  const t = cardsTranslations[language].transactions.detail;
  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[#219653]/[0.08] text-[#219653]";
      case "pending":
        return "bg-[#FFA70B]/[0.08] text-[#FFA70B]";
      case "declined":
        return "bg-[#D34053]/[0.08] text-[#D34053]";
      case "refunded":
        return "bg-[#3B82F6]/[0.08] text-[#3B82F6]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke p-6 dark:border-dark-3">
          <h2 className="text-2xl font-bold text-dark dark:text-white">{t.title}</h2>
          <button
            onClick={onClose}
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

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Amount and Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-6 dark:text-dark-6">{t.amount}</p>
                <p className="mt-1 text-3xl font-bold text-dark dark:text-white">
                  {formatAmount(transaction.amount, transaction.currency)}
                </p>
              </div>
              <div
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium capitalize",
                  getStatusColor(transaction.status)
                )}
              >
                {transaction.status}
              </div>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-dark-6 dark:text-dark-6">{t.transactionId}</p>
                <p className="mt-1 text-dark dark:text-white">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-6 dark:text-dark-6">{t.type}</p>
                <p className="mt-1 capitalize text-dark dark:text-white">{transaction.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-6 dark:text-dark-6">{t.dateTime}</p>
                <p className="mt-1 text-dark dark:text-white">
                  {dayjs(transaction.date).format("MMM DD, YYYY")}
                </p>
                <p className="text-sm text-dark-6 dark:text-dark-6">
                  {dayjs(transaction.date).format("HH:mm:ss")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-6 dark:text-dark-6">Category</p>
                <p className="mt-1 text-dark dark:text-white">{transaction.category}</p>
              </div>
            </div>

            {/* Card Info */}
            <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
              <p className="mb-3 text-sm font-medium text-dark-6 dark:text-dark-6">Card Information</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-dark-6 dark:text-dark-6">Card Number</p>
                  <p className="text-dark dark:text-white">{transaction.cardNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-6 dark:text-dark-6">Cardholder</p>
                  <p className="text-dark dark:text-white">{transaction.cardholderName}</p>
                </div>
              </div>
            </div>

            {/* Merchant Info */}
            <div>
                <p className="mb-2 text-sm font-medium text-dark-6 dark:text-dark-6">{t.merchant}</p>
              <p className="text-lg text-dark dark:text-white">{transaction.merchant}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-stroke p-6 dark:border-dark-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


