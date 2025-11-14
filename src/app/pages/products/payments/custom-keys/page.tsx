import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { CustomKeysConfig } from "./_components/custom-keys-config";

export const metadata: Metadata = {
  title: "Custom Keys",
};

export default function CustomKeysPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Custom Keys" />
      <CustomKeysConfig />
    </div>
  );
}

