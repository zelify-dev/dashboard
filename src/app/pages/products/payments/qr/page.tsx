import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { QRConfig } from "./_components/qr-config";

export const metadata: Metadata = {
  title: "QR",
};

export default function QRPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="QR" />
      <QRConfig />
    </div>
  );
}

