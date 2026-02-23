"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { SavedCV } from "@/types/cv";
import { BrandLogo } from "@/components/BrandLogo";

const SITE_NAME = "CVcraft";

function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${baseUrl}/cv/${slug}`;
  const text = `${title} - ${SITE_NAME} ile oluşturuldu`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        LinkedIn
      </a>
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-elevated)]"
      >
        {copied ? "Kopyalandı!" : "Linki kopyala"}
      </button>
    </div>
  );
}

export default function PublicCVPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [cv, setCv] = useState<SavedCV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Geçersiz link.");
      return;
    }
    fetch(`/api/cv/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "CV bulunamadı." : "Yüklenemedi.");
        return res.json();
      })
      .then((data) => setCv(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Hata oluştu."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Yükleniyor…</p>
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-[var(--error)]">{error || "CV bulunamadı."}</p>
        <Link href="/" className="text-[var(--accent)] hover:underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/cv/${slug}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] py-3 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <BrandLogo href="/" size="sm" />
          <ShareButtons slug={slug} title={cv.title} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 md:p-8">
          <h1 className="text-lg font-semibold text-white mb-1">{cv.title}</h1>
          <div className="whitespace-pre-wrap text-[var(--text-muted)] leading-relaxed text-sm">
            {cv.cvText}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 text-center">
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Bu CV&apos;yi kendiniz de oluşturmak ister misiniz?
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-[var(--accent)] text-slate-950 px-6 py-3 text-sm font-medium hover:opacity-90"
          >
            Bu CV&apos;yi sen de oluştur
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
          <span>Paylaş:</span>
          <ShareButtons slug={slug} title={cv.title} />
        </div>
      </main>
    </div>
  );
}
