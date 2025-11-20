"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { WorkflowsList } from "./_components/workflows-list";
import { WorkflowConfig } from "./_components/workflow-config";
import { useIdentityWorkflowTranslations } from "./_components/use-identity-translations";

export default function WorkflowPage() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { page } = useIdentityWorkflowTranslations();

  const handleSelectWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedWorkflowId("new");
    setIsCreatingNew(true);
  };

  const handleBackToList = () => {
    setSelectedWorkflowId(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName={page.breadcrumb} />
      {selectedWorkflowId ? (
        <div>
          <div className="mb-4">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-sm text-dark-6 transition hover:text-primary dark:text-dark-6"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {page.backToList}
            </button>
          </div>
          <WorkflowConfig workflowId={selectedWorkflowId} isNew={isCreatingNew} />
        </div>
      ) : (
        <WorkflowsList onSelectWorkflow={handleSelectWorkflow} onCreateNew={handleCreateNew} />
      )}
    </div>
  );
}
