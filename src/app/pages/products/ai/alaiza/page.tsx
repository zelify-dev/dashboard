import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { AlaizaConfig } from "./_components/alaiza-config";

export const metadata: Metadata = {
  title: "Alaiza",
};

export default function AlaizaPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Alaiza" />
      <AlaizaConfig />
    </div>
  );
}

