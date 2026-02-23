"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCVList } from "@/contexts/CVListContext";
import { useAuth } from "@/contexts/AuthContext";
import { downloadCVAsPdf } from "@/lib/pdfDownload";
import { isSlugTaken, SLUG_REGEX, SLUG_MIN, SLUG_MAX } from "@/lib/cvFirestore";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { SavedCV } from "@/types/cv";

export default function CVlerimPage() {
  const { cvs, deleteCV, duplicateCV, updateCV, loading } = useCVList();
  const { user, isPaidPlan } = useAuth();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);
  const [editTitleId, setEditTitleId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");
  const [editSlugId, setEditSlugId] = useState<string | null>(null);
  const [editSlugValue, setEditSlugValue] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  const handleDelete = async (cv: SavedCV) => {
    if (!confirm(`"${cv.title}" silinsin mi?`)) return;
    setDeletingId(cv.id);
    try {
      await deleteCV(cv.id);
      toast.success("CV silindi.");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (cv: SavedCV) => {
    try {
      await duplicateCV(cv.id);
      toast.success("CV kopyalandı.");
    } catch {
      toast.error("Kopyalanamadı.");
    }
  };

  const handleDownloadPdf = async (cv: SavedCV) => {
    if (!isPaidPlan) {
      setShowProModal(true);
      return;
    }
    setPdfLoadingId(cv.id);
    try {
      await downloadCVAsPdf(cv.cvText, cv.formData, {
        withWatermark: user.plan === "free",
        filename: `CV_${cv.title.replace(/\s+/g, "_")}.pdf`,
      });
      toast.success("PDF indirildi.");
    } catch {
      toast.error("PDF oluşturulamadı.");
    } finally {
      setPdfLoadingId(null);
    }
  };

  const startEditTitle = (cv: SavedCV) => {
    setEditTitleId(cv.id);
    setEditTitleValue(cv.title);
  };

  const saveEditTitle = async (id: string) => {
    if (!editTitleValue.trim()) return;
    try {
      await updateCV(id, { title: editTitleValue.trim() });
      setEditTitleId(null);
      setEditTitleValue("");
    } catch {
      toast.error("Başlık güncellenemedi.");
    }
  };

  const openEdit = (cv: SavedCV) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cv-edit-id", cv.id);
    localStorage.setItem("cv-form-data", JSON.stringify(cv.formData));
    router.push("/olustur?edit=" + cv.id);
  };

  const togglePublic = async (cv: SavedCV) => {
    if (!isPaidPlan) {
      setShowProModal(true);
      return;
    }
    try {
      await updateCV(cv.id, { publicEnabled: !cv.publicEnabled });
      toast.success(cv.publicEnabled ? "Link kapatıldı." : "Link açıldı.");
    } catch {
      toast.error("Güncellenemedi.");
    }
  };

  const copyPublicLink = (cv: SavedCV) => {
    if (!isPaidPlan) {
      setShowProModal(true);
      return;
    }
    if (!cv.slug) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/cv/${cv.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link kopyalandı.");
  };

  const startEditSlug = (cv: SavedCV) => {
    setEditSlugId(cv.id);
    setEditSlugValue(cv.slug || "");
  };

  const saveEditSlug = async (id: string) => {
    const slug = editSlugValue.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug || slug.length < SLUG_MIN || slug.length > SLUG_MAX) {
      toast.error(`Slug ${SLUG_MIN}-${SLUG_MAX} karakter olmalı.`);
      return;
    }
    if (!SLUG_REGEX.test(slug)) {
      toast.error("Sadece küçük harf, rakam ve tire kullanın.");
      return;
    }
    setSlugSaving(true);
    try {
      const taken = await isSlugTaken(slug, id);
      if (taken) {
        toast.error("Bu link başka bir CV tarafından kullanılıyor.");
        setSlugSaving(false);
        return;
      }
      await updateCV(id, { customSlug: slug });
      setEditSlugId(null);
      setEditSlugValue("");
      toast.success("Özel link kaydedildi.");
    } catch {
      toast.error("Güncellenemedi.");
    } finally {
      setSlugSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-white">CV&apos;lerim</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/olustur"
            className="rounded-lg px-4 py-2 text-sm font-medium bg-[var(--accent)] text-slate-950 hover:opacity-90"
          >
            Yeni CV oluştur
          </Link>
        </div>
      </div>

      {cvs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-12 text-center text-[var(--text-muted)]"
        >
          Henüz kayıtlı CV yok. &quot;Yeni CV oluştur&quot; ile ilk CV&apos;nizi
          oluşturup kaydedin.
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {cvs.map((cv, i) => (
              <motion.div
                key={cv.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-[var(--card)] border border-[var(--border)] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-[var(--border)] min-h-[72px]">
                  {editTitleId === cv.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditTitle(cv.id);
                          if (e.key === "Escape") setEditTitleId(null);
                        }}
                        className="flex-1 rounded bg-slate-850 border border-[var(--border)] px-2 py-1 text-sm text-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => saveEditTitle(cv.id)}
                        className="text-[var(--accent)] text-sm"
                      >
                        Kaydet
                      </button>
                    </div>
                  ) : (
                    <h2
                      className="font-medium text-white cursor-pointer hover:text-[var(--accent)] truncate"
                      onClick={() => startEditTitle(cv)}
                      title="Başlığı düzenlemek için tıklayın"
                    >
                      {cv.title}
                    </h2>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(cv.updatedAt).toLocaleDateString("tr-TR")}
                    {typeof cv.viewCount === "number" && (
                      <span className="ml-2">· {cv.viewCount} görüntülenme</span>
                    )}
                  </p>
                </div>

                {cv.slug && (
                  <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]/50 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">Paylaşım linki</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!cv.publicEnabled}
                          onChange={() => togglePublic(cv)}
                          className="rounded border-[var(--border)]"
                        />
                        <span className="text-xs text-slate-400">Açık</span>
                      </label>
                    </div>
                    {editSlugId === cv.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editSlugValue}
                          onChange={(e) => setEditSlugValue(e.target.value)}
                          placeholder="ozel-link"
                          className="flex-1 rounded bg-slate-850 border border-[var(--border)] px-2 py-1 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => saveEditSlug(cv.id)}
                          disabled={slugSaving}
                          className="text-[var(--accent)] text-xs"
                        >
                          {slugSaving ? "…" : "Kaydet"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditSlugId(null); setEditSlugValue(""); }}
                          className="text-slate-400 text-xs"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-slate-400 truncate flex-1">
                          /cv/{cv.slug}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyPublicLink(cv)}
                          className="text-xs text-[var(--accent)] hover:underline"
                        >
                          Kopyala
                        </button>
                        {isPaidPlan && (
                          <button
                            type="button"
                            onClick={() => startEditSlug(cv)}
                            className="text-xs text-slate-400 hover:text-white"
                            title="Özel link (Pro)"
                          >
                            Özel link
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 flex flex-wrap gap-2">
                  <Button variant="secondary" className="text-xs px-2 py-1.5" onClick={() => openEdit(cv)}>
                    Düzenle
                  </Button>
                  <Button variant="secondary" className="text-xs px-2 py-1.5" onClick={() => handleDuplicate(cv)}>
                    Kopyala
                  </Button>
                  <Button variant="secondary" loading={pdfLoadingId === cv.id} className="text-xs px-2 py-1.5" onClick={() => handleDownloadPdf(cv)}>
                    PDF İndir
                  </Button>
                  <Button variant="danger" className="text-xs px-2 py-1.5" onClick={() => handleDelete(cv)} disabled={deletingId === cv.id}>
                    Sil
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showProModal && !isPaidPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-w-sm w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 text-center">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Pro özelliği</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Bu özellik <strong>Pro</strong> plana özeldir. CV&apos;nizi kaydetmek, indirmek ve paylaşmak için Pro&apos;ya geçebilirsiniz.
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
  );
}
