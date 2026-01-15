"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CardsConfig } from "./cards-config";

export function CardsPageContent() {
  return (
    <>
      <Breadcrumb pageName="Cards" />
      <CardsConfig />
    </>
  );
}
