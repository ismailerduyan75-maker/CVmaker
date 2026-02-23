"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/firebaseAuth";
import { Button } from "@/components/ui/Button";

export default function ProfilPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [email, setEmail] = useState(user.email ?? "");

  useEffect(() => {
    setDisplayName(user.displayName ?? "");
    setEmail(user.email ?? "");
  }, [user.displayName, user.email]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = displayName.trim();
    if (!name) {
      toast.error("Ad Soyad girin.");
      return;
    }
    setProfileLoading(true);
    try {
      await updateUserProfile(name);
      toast.success("Profil bilgileri kaydedildi.");
      setMessage({ type: "ok", text: "Profil bilgileri kaydedildi." });
    } catch {
      toast.error("Güncelleme yapılamadı.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "Yeni şifreler eşleşmiyor." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "err", text: "Şifre en az 6 karakter olmalı." });
      return;
    }
    setMessage({
      type: "ok",
      text: "Şifre güncelleme talebi alındı. (Demo: gerçek auth ile bağlanacak)",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-[var(--text)] mb-1">Profil</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Ad, e-posta ve şifre bilgilerinizi güncelleyin.
      </p>

      {message && (
        <div
          className={`rounded-lg px-3 py-2 mb-4 text-sm ${
            message.type === "ok"
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleProfileSubmit}
        className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 mb-6"
      >
        <h2 className="text-sm font-medium text-[var(--accent)] mb-3">
          Kişisel bilgiler
        </h2>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-slate-400 block mb-1">Ad Soyad</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-base"
              placeholder="Adınız Soyadınız"
            />
          </label>
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-1">E-posta</span>
            <input
              type="email"
              value={email}
              readOnly
              className="input-base opacity-80"
              placeholder="ornek@email.com"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">E-posta Firebase ile yönetilir, buradan değiştirilemez.</p>
          </label>
        </div>
        <Button type="submit" variant="primary" loading={profileLoading} className="mt-3">
          Kaydet
        </Button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4"
      >
        <h2 className="text-sm font-medium text-[var(--accent)] mb-3">
          Şifre güncelle
        </h2>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-slate-400 block mb-1">
              Mevcut şifre
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-400 block mb-1">Yeni şifre</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-400 block mb-1">
              Yeni şifre (tekrar)
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
            />
          </label>
        </div>
        <Button type="submit" variant="secondary" className="mt-3">
          Şifreyi güncelle
        </Button>
      </form>
    </div>
  );
}
