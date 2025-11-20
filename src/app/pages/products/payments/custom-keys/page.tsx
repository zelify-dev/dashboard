import type { Metadata } from "next";
import { CustomKeysPageContent } from "./_components/custom-keys-page-content";

export const metadata: Metadata = {
  title: "Custom Keys",
};

export default function CustomKeysPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <CustomKeysPageContent />
    </div>
  );
}

