"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <FpjsProvider
        loadOptions={{
          apiKey: "htyqZnBwhhKF5YcYflXK",
        }}
      >
        <SidebarProvider>{children}</SidebarProvider>
      </FpjsProvider>
    </ThemeProvider>
  );
}
