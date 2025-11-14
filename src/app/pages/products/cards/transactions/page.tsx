"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TransactionsTable, Transaction } from "./_components/transactions-table";
import { TransactionDetail } from "./_components/transaction-detail";

export default function CardsTransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Cards / Transactions" />
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Card Transactions</h2>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            View and manage all card transactions issued through your platform
          </p>
        </div>
        <TransactionsTable onTransactionClick={setSelectedTransaction} />
      </div>
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}


