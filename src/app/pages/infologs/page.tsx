import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { LogsPageContent } from "./_components/logs-content";

export const metadata: Metadata = {
  title: "Logs",
};

export default function LogsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Logs" />
      <LogsPageContent />
    </div>
  );
}

