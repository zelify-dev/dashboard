"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FinancialEducationConfig } from "./financial-education-config";

export function FinancialEducationPageContent() {
  return (
    <>
      <Breadcrumb pageName="Educación Financiera" />
      <FinancialEducationConfig />
    </>
  );
}
