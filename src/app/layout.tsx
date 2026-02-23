import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "CVcraft - Profesyonel CV Oluşturucu",
  description: "Dakikalar içinde profesyonel CV oluşturun",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
