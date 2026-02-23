"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/BrandLogo";

export default function KayitPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, isFirebaseAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("E-posta girin.");
      return;
    }
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
      toast.success("Hesap oluşturuldu.");
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Kayıt oluşturulamadı.";
      if (message.includes("email-already-in-use"))
        toast.error("Bu e-posta adresi zaten kullanılıyor.");
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
            Kayıt için Firebase Authentication yapılandırmanız gerekir.
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
            Kayıt ol
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-1">
              Ad Soyad
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-base"
              placeholder="Adınız Soyadınız"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-1">
              E-posta *
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
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-1">
              Şifre * (en az 6 karakter)
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </label>
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-1">
              Şifre tekrar
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </label>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Kayıt ol
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Giriş yap
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
