"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BasicServicesConfig } from "./_components/basic-services-config";

export default function BasicServicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Payments / Servicios básicos" />
      <BasicServicesConfig />
    </div>
  );
}
