"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function CardsTransactionsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Cards / Transactions" />
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <h2 className="text-xl font-bold text-dark dark:text-white">Transactions</h2>
        <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
          Gestión y procesamiento de transacciones con tarjetas
        </p>
      </div>
    </div>
  );
}


