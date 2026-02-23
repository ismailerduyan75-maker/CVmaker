"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserMenu } from "@/components/auth/UserMenu";
import { BrandLogo } from "@/components/BrandLogo";

const nav = [
  { href: "/dashboard", label: "Özet" },
  { href: "/dashboard/cvlerim", label: "CV'lerim" },
  { href: "/dashboard/profil", label: "Profil" },
  { href: "/dashboard/abonelik", label: "Abonelik" },
  { href: "/dashboard/istatistikler", label: "İstatistikler" },
];

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <motion.div
        className="min-h-screen flex flex-col md:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--card)]">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-2">
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1">
              ← <BrandLogo href="" size="sm" className="!text-sm" />
            </Link>
            <UserMenu />
          </div>
        <nav className="p-2 space-y-0.5">
          {nav.map(({ href, label }, i) => {
            const isActive =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <motion.div key={href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={href}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
                  }`}
                >
                  {label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </motion.div>
    </ProtectedRoute>
  );
}
