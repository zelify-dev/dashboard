"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InsuranceQuoteConfig } from "./_components/insurance-quote-config";

export default function InsuranceQuotePage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Insurance / Quote" />
      <InsuranceQuoteConfig />
    </div>
  );
}


