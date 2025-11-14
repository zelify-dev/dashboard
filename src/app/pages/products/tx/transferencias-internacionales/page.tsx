"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InternationalTransfersConfig } from "./_components/international-transfers-config";

export default function InternationalTransfersPage() {
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Tx / International transfers" />
      <InternationalTransfersConfig />
    </div>
  );
}
