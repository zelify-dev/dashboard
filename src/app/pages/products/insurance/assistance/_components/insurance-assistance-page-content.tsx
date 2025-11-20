"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InsuranceAssistanceConfig } from "./insurance-assistance-config";
import { useInsuranceAssistanceTranslations } from "./use-insurance-assistance-translations";

export function InsuranceAssistancePageContent() {
  const translations = useInsuranceAssistanceTranslations();

  return (
    <>
      <Breadcrumb pageName={translations.breadcrumb} />
      <InsuranceAssistanceConfig />
    </>
  );
}

