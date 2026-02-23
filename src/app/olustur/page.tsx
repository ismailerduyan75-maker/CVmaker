"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCVList } from "@/contexts/CVListContext";
import { getDefaultCVFormData } from "@/types/cv";
import type { CVFormData, CVTemplateId } from "@/types/cv";
import { CVFormEditor } from "@/components/cv/CVFormEditor";
import { CVPreviewPanel } from "@/components/cv/CVPreviewPanel";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const STORAGE_FORM_KEY = "cv-form-data";
const STORAGE_EDIT_ID_KEY = "cv-edit-id";

const TEMPLATES: {
  id: CVTemplateId;
  name: string;
  badge?: "FREE" | "PRO";
  description: string;
}[] = [
  {
    id: "classic",
    name: "Klasik",
    badge: "FREE",
    description: "Tek sütun, siyah-beyaz ve sade görünüm.",
  },
  {
    id: "modern",
    name: "Modern",
    badge: "PRO",
    description: "İki sütunlu düzen, mavi başlık ve ikonlar.",
  },
  {
    id: "minimal",
    name: "Minimal",
    badge: "PRO",
    description: "Bol beyaz alan, ince çizgiler, çok temiz görünüm.",
  },
  {
    id: "professional",
    name: "Profesyonel",
    badge: "PRO",
    description: "Koyu sol sidebar, açık içerik alanı.",
  },
  {
    id: "creative",
    name: "Yaratıcı",
    badge: "PRO",
    description: "Renkli accent çizgiler, modern font hissi.",
  },
  {
    id: "executive",
    name: "Executive",
    badge: "PRO",
    description: "Üstte altın çizgi, sağ üstte fotoğraf, lacivert başlıklar.",
  },
  {
    id: "academic",
    name: "Akademik",
    badge: "PRO",
    description: "Üniversite amblem alanı, yayınlar bölümü, akademik görünüm.",
  },
  {
    id: "technology",
    name: "Teknoloji",
    badge: "PRO",
    description: "Terminal estetiği, koyu tema, beceri badge'leri, GitHub/LinkedIn.",
  },
  {
    id: "designer",
    name: "Tasarımcı",
    badge: "PRO",
    description: "Asimetrik layout, bold tipografi, renkli şerit, portfolio vurgusu.",
  },
  {
    id: "europe",
    name: "Avrupa (Europass)",
    badge: "PRO",
    description: "Europass formatı, AB renkleri, yurt dışı başvurular.",
  },
  {
    id: "internationalPro",
    name: "International Pro",
    badge: "PRO",
    description: "İngilizce, ATS uyumlu, ABD/İngiltere başvuruları için tek sütun CV.",
  },
  {
    id: "europeanEnglish",
    name: "European English",
    badge: "PRO",
    description: "İngilizce Europass tarzı, AB ülkeleri için resmi mavi-beyaz CV.",
  },
];

/** Şablon kartında gösterilen küçük önizleme (görsel ipucu) */
function TemplateThumbnail({ templateId }: { templateId: CVTemplateId }) {
  const base = "w-full aspect-[3/4] max-h-20 rounded-lg border border-white/10 overflow-hidden bg-white flex flex-col";
  switch (templateId) {
    case "classic":
      return (
        <div className={`${base} p-1`}>
          <div className="h-1.5 bg-slate-800 rounded" />
          <div className="flex-1 mt-0.5 space-y-0.5">
            <div className="h-0.5 bg-slate-200 rounded w-full" />
            <div className="h-0.5 bg-slate-100 rounded w-4/5" />
          </div>
        </div>
      );
    case "modern":
      return (
        <div className={`${base}`}>
          <div className="h-3 bg-gradient-to-r from-sky-600 to-indigo-600" />
          <div className="flex-1 grid grid-cols-2 gap-0.5 p-0.5">
            <div className="bg-slate-100 rounded" />
            <div className="bg-slate-50 rounded border-l border-slate-200" />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className={`${base} p-1.5 border-2 border-slate-200`}>
          <div className="flex-1 rounded bg-slate-50" />
        </div>
      );
    case "professional":
      return (
        <div className={`${base} flex-row`}>
          <div className="w-1/3 bg-slate-800" />
          <div className="flex-1 bg-white" />
        </div>
      );
    case "creative":
      return (
        <div className={`${base} bg-gradient-to-br from-sky-50 to-violet-50`}>
          <div className="flex-1 m-0.5 rounded border-l-2 border-sky-400 bg-white/90" />
        </div>
      );
    case "executive":
      return (
        <div className={`${base}`}>
          <div className="h-0.5 bg-amber-500" />
          <div className="flex-1 flex p-0.5 gap-0.5">
            <div className="flex-1 p-0.5">
              <div className="h-1.5 bg-[#0f172a] rounded w-2/3" />
              <div className="h-0.5 bg-slate-200 rounded mt-0.5 w-full" />
            </div>
            <div className="w-5 h-5 rounded bg-slate-200 shrink-0" />
          </div>
        </div>
      );
    case "academic":
      return (
        <div className={`${base} flex-row`}>
          <div className="w-6 h-full bg-slate-100 border-r border-slate-200 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-slate-400" />
          </div>
          <div className="flex-1 p-0.5">
            <div className="h-0.5 bg-slate-300 rounded w-full" />
            <div className="h-0.5 bg-slate-200 rounded w-4/5 mt-0.5" />
          </div>
        </div>
      );
    case "technology":
      return (
        <div className={`${base} bg-[#0d1117]`}>
          <div className="px-1 py-0.5 text-[8px] text-emerald-400 font-mono">~/cv</div>
          <div className="flex-1 flex flex-wrap gap-0.5 p-0.5">
            <span className="px-0.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[6px]">skill</span>
            <span className="px-0.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[6px]">dev</span>
          </div>
        </div>
      );
    case "designer":
      return (
        <div className={`${base} flex-row`}>
          <div className="w-1.5 bg-gradient-to-b from-violet-500 to-fuchsia-500" />
          <div className="flex-1 p-0.5">
            <div className="h-1.5 bg-slate-900 rounded w-3/4 font-bold" />
            <div className="h-0.5 bg-slate-300 rounded mt-0.5 w-full" />
          </div>
        </div>
      );
    case "europe":
      return (
        <div className={`${base}`}>
          <div className="h-1.5 flex">
            <div className="flex-1 bg-[#003399]" />
            <div className="w-2 bg-[#FFCC00]" />
          </div>
          <div className="flex-1 p-0.5">
            <div className="h-0.5 bg-slate-200 rounded w-full" />
            <div className="h-0.5 bg-slate-100 rounded w-5/6 mt-0.5" />
          </div>
        </div>
      );
    case "internationalPro":
      return (
        <div className={`${base} p-1.5`}>
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <div className="h-1.5 bg-slate-900 rounded w-2/3" />
            <div className="flex gap-1 text-[8px] text-slate-400">
              <span>in</span>
              <span>{"{"}gh{"}"}</span>
            </div>
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 bg-slate-200 rounded w-full" />
            <div className="h-0.5 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
      );
    case "europeanEnglish":
      return (
        <div className={`${base}`}>
          <div className="h-2 bg-[#003399]" />
          <div className="flex-1 flex">
            <div className="w-5 bg-slate-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
            <div className="flex-1 p-0.5">
              <div className="h-0.5 bg-slate-200 rounded w-full" />
              <div className="h-0.5 bg-slate-100 rounded w-4/5 mt-0.5" />
            </div>
          </div>
        </div>
      );
    default:
      return <div className={`${base} bg-slate-100`} />;
  }
}

export default function OlusturPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? null;
  const { user, authLoading, isPaidPlan } = useAuth();
  const { addCV, updateCV, getCVById } = useCVList();

  const [formData, setFormData] = useState<CVFormData>(getDefaultCVFormData());
  const [cvText, setCvText] = useState<string | null>(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateId>("classic");
  const [showProModal, setShowProModal] = useState(false);

  // Load from edit or localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (editId) {
      const fromStorage = localStorage.getItem(STORAGE_FORM_KEY);
      if (fromStorage) {
        try {
          const parsed = JSON.parse(fromStorage) as CVFormData;
          setFormData(parsed);
        } catch {}
      }
      const cv = getCVById(editId);
      if (cv) {
        setFormData(cv.formData);
        setCvText(cv.cvText || null);
      }
    } else {
      const raw = localStorage.getItem(STORAGE_FORM_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CVFormData;
          setFormData(parsed);
        } catch {}
      }
    }
  }, [editId, getCVById]);

  // Persist form to localStorage (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_FORM_KEY, JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(t);
  }, [formData]);

  const handleGenerateCV = useCallback(async () => {
    if (!isPaidPlan) {
      setShowProModal(true);
      return;
    }
    setGenerateLoading(true);
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "CV metni oluşturulamadı.");
        return;
      }
      setCvText(json.cvText ?? null);
      toast.success("CV metni oluşturuldu.");
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setGenerateLoading(false);
    }
  }, [formData, isPaidPlan]);

  const handleGenerateSummary = useCallback(async () => {
    if (!isPaidPlan) {
      setShowProModal(true);
      return;
    }
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Özet oluşturulamadı.");
        return;
      }
      setFormData((prev) => ({ ...prev, about: json.summary ?? "" }));
      toast.success("Profil özeti oluşturuldu.");
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setSummaryLoading(false);
    }
  }, [formData, isPaidPlan]);

  const handleSave = useCallback(async () => {
    if (!isPaidPlan) {
      setShowProModal(true);
      return;
    }
    const title =
      formData.fullName?.trim() || "İsimsiz CV";
    if (editId) {
      setSaveLoading(true);
      try {
        await updateCV(editId, { formData, cvText: cvText ?? "" });
        toast.success("CV güncellendi.");
        localStorage.removeItem(STORAGE_EDIT_ID_KEY);
        window.location.href = "/dashboard/cvlerim";
      } catch {
        toast.error("Güncellenemedi.");
      } finally {
        setSaveLoading(false);
      }
      return;
    }
    setSaveLoading(true);
    try {
      await addCV({
        title,
        formData,
        cvText: cvText ?? "",
      });
      toast.success("CV kaydedildi.");
      localStorage.removeItem(STORAGE_EDIT_ID_KEY);
      window.location.href = "/dashboard/cvlerim";
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setSaveLoading(false);
    }
  }, [editId, formData, cvText, updateCV, addCV, isPaidPlan]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg)]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center"
        >
          <h1 className="text-xl font-semibold text-[var(--text)]">CV oluşturmak için giriş yapın</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Ücretsiz hesap oluşturup dakikalar içinde profesyonel CV hazırlayabilirsiniz.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?redirect=/olustur"
              className="rounded-xl px-5 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-hover)] transition"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register?redirect=/olustur"
              className="rounded-xl px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-slate-950 hover:opacity-90 transition"
            >
              Ücretsiz Kayıt Ol
            </Link>
          </div>
          <Link href="/" className="inline-block mt-4 text-sm text-[var(--accent)] hover:underline">
            ← Ana sayfaya dön
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSelectTemplate = (id: CVTemplateId) => {
    setSelectedTemplate(id);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/cvlerim"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              ← CV&apos;lerim
            </Link>
            <h1 className="text-xl font-semibold text-[var(--text)]">
              {editId ? "CV düzenle" : "Yeni CV oluştur"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleGenerateCV}
              disabled={generateLoading}
              loading={generateLoading}
            >
              CV metnini oluştur (AI)
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveLoading}
              loading={saveLoading}
            >
              {editId ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </div>

        {/* Şablon seçim alanı */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Şablon seç</h2>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Seçtiğiniz şablon, sayfadaki canlı önizlemenin görünümünü belirler.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`relative text-left rounded-xl border px-3 py-3 text-xs transition-all flex flex-col ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="mb-2">
                    <TemplateThumbnail templateId={tpl.id} />
                  </div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[11px] font-semibold text-[var(--text)] truncate">{tpl.name}</span>
                    {tpl.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${
                          tpl.badge === "FREE"
                            ? "border-emerald-400/50 text-emerald-300"
                            : "border-amber-400/60 text-amber-300"
                        }`}
                      >
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] leading-snug line-clamp-2 text-[var(--text-muted)]">{tpl.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,440px] gap-6">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="min-w-0"
          >
            <CVFormEditor
              data={formData}
              onChange={setFormData}
              onGenerateSummary={handleGenerateSummary}
              generateSummaryLoading={summaryLoading}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="lg:sticky lg:top-6 lg:self-start"
          >
            <CVPreviewPanel
              formData={formData}
              cvText={cvText}
              template={selectedTemplate}
              className="min-h-[480px]"
            />
          </motion.div>
        </div>

        {/* Pro modal */}
        {showProModal && !isPaidPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="max-w-sm w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 text-center">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Pro özelliği</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Bu özellik <strong>Pro</strong> plana özeldir. CV&apos;nizi kaydetmek, indirmek, paylaşmak ve AI ile geliştirmek için Pro&apos;ya geçebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <Link
                  href="/fiyatlandirma"
                  className="rounded-xl px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-slate-950 hover:opacity-90 transition"
                  onClick={() => setShowProModal(false)}
                >
                  Pro planları gör
                </Link>
                <button
                  type="button"
                  onClick={() => setShowProModal(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-hover)] transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
