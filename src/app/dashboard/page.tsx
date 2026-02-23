"use client";

import Link from "next/link";
import { useCVList } from "@/contexts/CVListContext";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { cvs } = useCVList();
  const { user } = useAuth();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const createdThisMonth = cvs.filter((c) => {
    const d = new Date(c.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Hoş geldiniz{user.displayName ? `, ${user.displayName}` : ""}.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/cvlerim"
          className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 hover:border-[var(--accent)] transition"
        >
          <div className="text-2xl font-semibold text-white">{cvs.length}</div>
          <div className="text-sm text-slate-400">Kayıtlı CV</div>
        </Link>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
          <div className="text-2xl font-semibold text-white">
            {createdThisMonth}
          </div>
          <div className="text-sm text-slate-400">Bu ay oluşturulan CV</div>
        </div>
      </div>
      <div className="mt-6">
        <Link
          href="/dashboard/cvlerim"
          className="text-[var(--accent)] hover:underline text-sm"
        >
          CV'lerim sayfasına git →
        </Link>
      </div>
    </div>
  );
}
