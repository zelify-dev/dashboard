import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { ClientIdSection } from "./_components/client-id";
import { ZelifySecretsSandbox } from "./_components/zelify-secrets-sandbox";
import { ProductionSection } from "./_components/production";
import { SecureKeysInfo } from "./_components/secure-keys-info";
import { DataSection } from "./_components/data";
export const metadata: Metadata = {
  title: "Claves de Zelify",
};

export default function ZelifyKeysPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          Claves
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ClientIdSection />
          <ZelifySecretsSandbox />
          <ProductionSection />
        </div>
        <div className="lg:col-span-1">
          <SecureKeysInfo />
          <hr className="my-4 border-t border-stroke dark:border-dark-3" />
          <DataSection />
        </div>
      </div>
    </div>
  );
}

