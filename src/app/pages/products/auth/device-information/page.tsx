import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { DeviceInformationContent } from "./_components/device-information-content";

export const metadata: Metadata = {
  title: "Device information",
};

export default function DeviceInformationPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Device information" />
      <DeviceInformationContent />
    </div>
  );
}

