import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { WebhooksPageContent } from "./_components/webhooks-content";

export const metadata: Metadata = {
  title: "Webhooks",
};

export default function WebhooksPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Webhooks" />
      <WebhooksPageContent />
    </div>
  );
}

