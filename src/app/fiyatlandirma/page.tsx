"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";
import { PLAN_LABELS, PRICE_PRO_MONTHLY_TRY, PRICE_PREMIUM_MONTHLY_TRY } from "@/types/plans";
import { CV_PER_DAY, TEMPLATE_LIMIT } from "@/types/plans";
import { getAuth } from "firebase/auth";

export default function FiyatlandirmaPage() {
  const { user, isFirebaseAuth } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<"pro" | "premium" | null>(null);

  const handleCheckout = async (plan: "pro" | "premium") => {
    if (!isFirebaseAuth || !user.isLoggedIn) {
      window.location.href = "/login?redirect=/fiyatlandirma";
      return;
    }
    setLoadingPlan(plan);
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Oturum bulunamadı.");
      }
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Oturum oluşturulamadı.");
      if (data.url) window.location.href = data.url;
      else throw new Error("Yönlendirme URL'si alınamadı.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ödeme sayfası açılamadı.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <BrandLogo href="/" size="lg" />
          {user.isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium bg-[var(--accent)] text-slate-950"
            >
              Giriş yap
            </Link>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Fiyatlandırma
        </h1>
        <p className="text-center text-[var(--text-muted)] mb-10">
          İhtiyacınıza uygun planı seçin.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Ücretsiz */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-1">
              {PLAN_LABELS.free}
            </h2>
            <p className="text-3xl font-bold text-[var(--accent)] mb-4">
              ₺0<span className="text-sm font-normal text-[var(--text-muted)]">/ay</span>
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)] mb-6 flex-1">
              <li>Günde {CV_PER_DAY.free} CV oluşturma</li>
              <li>{TEMPLATE_LIMIT.free} şablon</li>
              <li>Watermark&apos;lı PDF</li>
            </ul>
            {user.plan === "free" ? (
              <span className="block text-center text-sm text-[var(--text-muted)] py-2">
                Mevcut planınız
              </span>
            ) : (
              <Link
                href="/"
                className="block text-center rounded-lg border border-[var(--border)] py-2.5 text-sm font-medium hover:bg-[var(--bg-elevated)]"
              >
                Kullanmaya devam et
              </Link>
            )}
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--card)] p-6 flex flex-col relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-slate-950 text-xs font-medium px-2 py-0.5 rounded">
              Popüler
            </span>
            <h2 className="text-xl font-semibold text-white mb-1">
              {PLAN_LABELS.pro}
            </h2>
            <p className="text-3xl font-bold text-white mb-4">
              ₺{PRICE_PRO_MONTHLY_TRY}
              <span className="text-sm font-normal text-[var(--text-muted)]">/ay</span>
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)] mb-6 flex-1">
              <li>Sınırsız CV oluşturma</li>
              <li>{TEMPLATE_LIMIT.pro} şablon</li>
              <li>Watermark&apos;sız PDF</li>
              <li>AI optimizasyon</li>
            </ul>
            {user.plan === "pro" ? (
              <span className="block text-center text-sm text-[var(--accent)] py-2">
                Mevcut planınız
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleCheckout("pro")}
                disabled={loadingPlan !== null}
                className="w-full rounded-lg bg-[var(--accent)] text-slate-950 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loadingPlan === "pro" ? "Yönlendiriliyor…" : "Pro'ya geç"}
              </button>
            )}
          </div>

          {/* Premium */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-1">
              {PLAN_LABELS.premium}
            </h2>
            <p className="text-3xl font-bold text-white mb-4">
              ₺{PRICE_PREMIUM_MONTHLY_TRY}
              <span className="text-sm font-normal text-[var(--text-muted)]">/ay</span>
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)] mb-6 flex-1">
              <li>Pro özelliklerinin hepsi</li>
              <li>Özel şablonlar</li>
              <li>Öncelikli destek</li>
              <li>CV skoru</li>
            </ul>
            {user.plan === "premium" ? (
              <span className="block text-center text-sm text-[var(--accent)] py-2">
                Mevcut planınız
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleCheckout("premium")}
                disabled={loadingPlan !== null}
                className="w-full rounded-lg border-2 border-[var(--accent)] text-[var(--accent)] py-2.5 text-sm font-medium hover:bg-[var(--accent-soft)] disabled:opacity-50"
              >
                {loadingPlan === "premium" ? "Yönlendiriliyor…" : "Premium'a geç"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          Ödemeler Stripe ile güvenle işlenir. İstediğiniz zaman iptal edebilirsiniz.
        </p>
      </main>
    </div>
  );
}
