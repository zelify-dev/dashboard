import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { GeolocalizationContent } from "./_components/geolocalization-content";

export const metadata: Metadata = {
  title: "Geolocalization",
};

export default function GeolocalizationPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Geolocalization" />
      <GeolocalizationContent />
    </div>
  );
}
