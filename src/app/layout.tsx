import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { AuthGuard } from "@/components/Auth/AuthGuard";
import { DashboardLayout } from "@/components/Layouts/DashboardLayout";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Zelify Dashboard Kit",
    default: "Zelify - Dashboard Kit",
  },
  description:
    "Zelify dashboard.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
