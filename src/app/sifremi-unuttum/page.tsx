"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/BrandLogo";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword, isFirebaseAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("E-posta adresinizi girin.");
      return;
    }
    setLoading(true);
    setSent(false);
    try {
      await resetPassword(email.trim());
      setSent(true);
      toast.success("Şifre sıfırlama bağlantısı e-posta ile gönderildi.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gönderilemedi.";
      if (message.includes("user-not-found"))
        toast.error("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isFirebaseAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 max-w-md text-center"
        >
          <p className="text-[var(--text-muted)] mb-4">
            Şifre sıfırlama için Firebase Authentication yapılandırmanız gerekir.
          </p>
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Ana sayfaya dön
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 card-style"
      >
        <div className="text-center mb-6">
          <BrandLogo href="/" size="lg" />
          <h1 className="text-xl font-semibold text-[var(--text)] mt-2">
            Şifremi unuttum
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-[var(--success)] text-sm mb-4">
              E-postanızı kontrol edin. Bağlantıya tıklayıp yeni şifre belirleyebilirsiniz.
            </p>
            <Link href="/login" className="text-[var(--accent)] hover:underline text-sm">
              Giriş sayfasına dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-[var(--text-muted)] block mb-1">
                E-posta
              </span>
              <input
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="ornek@email.com"
                autoComplete="email"
              />
            </label>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Sıfırlama bağlantısı gönder
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
