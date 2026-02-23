"use client";

import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { CVListProvider } from "@/contexts/CVListContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

/** Tüm client-only provider'lar (Firebase, auth, theme, toaster). Layout bu bileşeni kullanır. */
export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGuard>
          <CVListProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                },
                success: { iconTheme: { primary: "var(--success)", secondary: "var(--card)" } },
                error: { iconTheme: { primary: "var(--error)", secondary: "var(--card)" } },
              }}
            />
          </CVListProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
