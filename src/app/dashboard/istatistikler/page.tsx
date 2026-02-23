"use client";

import { useCVList } from "@/contexts/CVListContext";
import { useAuth } from "@/contexts/AuthContext";

function getMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function IstatistiklerPage() {
  const { cvs } = useCVList();
  const { user, cvCountToday, cvLimitPerDay } = useAuth();

  const now = new Date();
  const thisMonthKey = getMonthKey(now);
  const createdThisMonth = cvs.filter((c) => getMonthKey(new Date(c.createdAt)) === thisMonthKey).length;
  const lastMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      key: getMonthKey(d),
      label: d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
      count: cvs.filter(
        (c) => getMonthKey(new Date(c.createdAt)) === getMonthKey(d)
      ).length,
    };
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-white mb-1">
        Kullanım istatistikleri
      </h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Bu ay ve geçmiş aylarda oluşturduğunuz CV sayıları.
      </p>

      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 mb-6">
        <div className="text-3xl font-semibold text-white mb-1">
          {createdThisMonth}
        </div>
        <div className="text-sm text-slate-400">
          Bu ay oluşturulan CV ({now.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })})
        </div>
      </div>

      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 mb-6">
        <h2 className="text-sm font-medium text-[var(--accent)] mb-3">
          CV oluşturma (günlük)
        </h2>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Kullanılan</span>
          <span className="text-white">
            {user.plan === "free" ? `${cvCountToday} / ${cvLimitPerDay} CV (günlük)` : "Sınırsız"}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
        <h2 className="text-sm font-medium text-[var(--accent)] mb-3">
          Son 6 ay – oluşturulan CV
        </h2>
        <ul className="space-y-2">
          {lastMonths.map(({ label, count }) => (
            <li
              key={label}
              className="flex justify-between text-sm text-slate-300"
            >
              <span className="capitalize">{label}</span>
              <span className="text-white font-medium">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
