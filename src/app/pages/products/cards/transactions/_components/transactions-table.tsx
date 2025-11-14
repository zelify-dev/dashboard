"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

export type Transaction = {
  id: string;
  cardNumber: string;
  cardholderName: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  status: "completed" | "pending" | "declined" | "refunded";
  date: string;
  type: "purchase" | "withdrawal" | "refund";
};

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    cardNumber: "**** 4532",
    cardholderName: "John Doe",
    amount: 125.50,
    currency: "USD",
    merchant: "Amazon",
    category: "Shopping",
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    type: "purchase",
  },
  {
    id: "txn_002",
    cardNumber: "**** 7890",
    cardholderName: "Jane Smith",
    amount: 45.00,
    currency: "USD",
    merchant: "Starbucks",
    category: "Food & Beverage",
    status: "completed",
    date: "2024-01-15T08:15:00Z",
    type: "purchase",
  },
  {
    id: "txn_003",
    cardNumber: "**** 4532",
    cardholderName: "John Doe",
    amount: 250.00,
    currency: "USD",
    merchant: "Shell Gas Station",
    category: "Transportation",
    status: "pending",
    date: "2024-01-15T14:20:00Z",
    type: "purchase",
  },
  {
    id: "txn_004",
    cardNumber: "**** 1234",
    cardholderName: "Robert Johnson",
    amount: 89.99,
    currency: "USD",
    merchant: "Best Buy",
    category: "Electronics",
    status: "declined",
    date: "2024-01-14T16:45:00Z",
    type: "purchase",
  },
  {
    id: "txn_005",
    cardNumber: "**** 7890",
    cardholderName: "Jane Smith",
    amount: 125.50,
    currency: "USD",
    merchant: "Amazon",
    category: "Shopping",
    status: "refunded",
    date: "2024-01-13T11:00:00Z",
    type: "refund",
  },
  {
    id: "txn_006",
    cardNumber: "**** 4532",
    cardholderName: "John Doe",
    amount: 500.00,
    currency: "USD",
    merchant: "ATM Withdrawal",
    category: "Cash",
    status: "completed",
    date: "2024-01-12T09:30:00Z",
    type: "withdrawal",
  },
];

interface TransactionsTableProps {
  onTransactionClick: (transaction: Transaction) => void;
}

export function TransactionsTable({ onTransactionClick }: TransactionsTableProps) {
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
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[120px] xl:pl-7.5">Card</TableHead>
            <TableHead className="min-w-[150px]">Merchant</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right xl:pr-7.5">Type</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mockTransactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="cursor-pointer border-[#eee] dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-2"
              onClick={() => onTransactionClick(transaction)}
            >
              <TableCell className="min-w-[120px] xl:pl-7.5">
                <h5 className="text-dark dark:text-white">{transaction.cardNumber}</h5>
                <p className="mt-[3px] text-body-sm font-medium text-dark-6 dark:text-dark-6">
                  {transaction.cardholderName}
                </p>
              </TableCell>

              <TableCell className="min-w-[150px]">
                <p className="text-dark dark:text-white">{transaction.merchant}</p>
              </TableCell>

              <TableCell>
                <p className="text-dark-6 dark:text-dark-6">{transaction.category}</p>
              </TableCell>

              <TableCell>
                <p className="font-medium text-dark dark:text-white">
                  {formatAmount(transaction.amount, transaction.currency)}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {dayjs(transaction.date).format("MMM DD, YYYY")}
                </p>
                <p className="mt-[3px] text-body-sm text-dark-6 dark:text-dark-6">
                  {dayjs(transaction.date).format("HH:mm")}
                </p>
              </TableCell>

              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium capitalize",
                    getStatusColor(transaction.status)
                  )}
                >
                  {transaction.status}
                </div>
              </TableCell>

              <TableCell className="text-right xl:pr-7.5">
                <span className="text-sm capitalize text-dark-6 dark:text-dark-6">
                  {transaction.type}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { mockTransactions };


