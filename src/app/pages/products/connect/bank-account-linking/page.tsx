"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BankAccountConfig } from "./_components/bank-account-config";

export default function BankAccountLinkingPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Connect / Bank account linking" />
      <BankAccountConfig />
    </div>
  );
}

