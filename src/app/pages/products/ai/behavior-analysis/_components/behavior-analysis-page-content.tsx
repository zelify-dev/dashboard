"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BehaviorAnalysisConfig } from "./behavior-analysis-config";

export function BehaviorAnalysisPageContent() {
  return (
    <>
      <Breadcrumb pageName="Análisis de Comportamiento" />
      <BehaviorAnalysisConfig />
    </>
  );
}
