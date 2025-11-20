"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InsuranceQuoteConfig } from "./insurance-quote-config";
import { useInsuranceQuoteTranslations } from "./use-insurance-quote-translations";

export function InsuranceQuotePageContent() {
  const translations = useInsuranceQuoteTranslations();

  return (
    <>
      <Breadcrumb pageName={translations.breadcrumb} />
      <InsuranceQuoteConfig />
    </>
  );
}

