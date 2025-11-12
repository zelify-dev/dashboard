import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { WorkflowConfig } from "./_components/workflow-config";

export const metadata: Metadata = {
  title: "Workflow",
};

export default function WorkflowPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Workflow" />
      <WorkflowConfig />
    </div>
  );
}

