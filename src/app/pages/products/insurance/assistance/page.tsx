"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InsuranceAssistanceConfig } from "./_components/insurance-assistance-config";

export default function InsuranceAssistancePage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Insurance / Assistance" />
      <InsuranceAssistanceConfig />
    </div>
  );
}


