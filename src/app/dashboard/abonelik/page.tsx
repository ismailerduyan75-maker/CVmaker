"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { PLAN_LABELS } from "@/types/plans";
import { getAuth } from "firebase/auth";

export default function AbonelikPage() {
  const { user, isPaidPlan, stripeSubscriptionId } = useAuth();
  const [cancelling, setCancelling] = useState(false);
  const renewalDate =
    user.renewalDate ||
    (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().slice(0, 10);
    })();

  const isCancelled = user.subscriptionCancelled === true;

  const handleCancel = async () => {
    if (
      !confirm("Aboneliği iptal etmek istediğinize emin misiniz? Dönem sonuna kadar kullanmaya devam edebilirsiniz.")
    ) return;
    setCancelling(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Oturum bulunamadı.");
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İptal yapılamadı.");
      alert(data.message || "Abonelik dönem sonunda iptal edilecek.");
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "İptal işlemi başarısız.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-white mb-1">
        Abonelik yönetimi
      </h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Plan bilgisi ve yenileme tarihi.
      </p>

      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Mevcut plan</span>
          <span
            className={`font-medium ${
              isPaidPlan ? "text-[var(--accent)]" : "text-white"
            }`}
          >
            {PLAN_LABELS[user.plan]}
          </span>
        </div>
        {user.renewalDate && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Yenileme tarihi</span>
            <span className="text-white">
              {new Date(renewalDate).toLocaleDateString("tr-TR")}
            </span>
          </div>
        )}
        {user.plan === "free" && (
          <p className="text-sm text-slate-400">
            Pro veya Premium ile sınırsız CV, daha fazla şablon ve watermark&apos;sız PDF.
          </p>
        )}
      </div>

      {isPaidPlan && stripeSubscriptionId && !isCancelled && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-lg border border-red-500/50 text-red-400 px-4 py-2 text-sm hover:bg-red-500/10 disabled:opacity-50"
          >
            {cancelling ? "İşleniyor…" : "Aboneliği iptal et"}
          </button>
        </div>
      )}

      {isCancelled && (
        <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-sm text-amber-200">
          Abonelik iptal edildi. {renewalDate} tarihine kadar planınız
          kullanılabilir.
        </div>
      )}

      {user.plan === "free" && (
        <div className="mt-6">
          <Link
            href="/fiyatlandirma"
            className="inline-block rounded-lg bg-[var(--accent)] text-slate-950 px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Planı yükselt
          </Link>
        </div>
      )}
    </div>
  );
}
