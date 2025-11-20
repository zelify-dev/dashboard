"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InternationalTransfersConfig } from "./international-transfers-config";
import { useInternationalTransfersTranslations } from "./use-international-transfers-translations";

export function InternationalTransfersPageContent() {
  const translations = useInternationalTransfersTranslations();

  return (
    <>
      <Breadcrumb pageName={translations.breadcrumb} />
      <InternationalTransfersConfig />
    </>
  );
}

