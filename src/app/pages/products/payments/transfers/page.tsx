"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TransfersConfig } from "./_components/transfers-config";

export default function TransfersPage() {
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Payments / Transfers" />
      <TransfersConfig />
    </div>
  );
}
