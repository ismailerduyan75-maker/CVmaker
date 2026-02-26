"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("E-posta ve şifre girin.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Giriş başarılı.");
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Giriş yapılamadı.";
      if (message.includes("invalid-credential") || message.includes("wrong-password"))
        toast.error("E-posta veya şifre hatalı.");
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Giriş başarılı.");
      router.push(redirect);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google ile giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

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
            Giriş yap
          </h1>
        </div>

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
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-1">
              Şifre
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          <div className="flex justify-end">
            <Link
              href="/sifremi-unuttum"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Şifremi unuttum
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Giriş yap
          </Button>
        </form>

        <div className="relative my-6">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </span>
          <span className="relative flex justify-center text-xs text-[var(--text-muted)]">
            veya
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          loading={loading}
          onClick={handleGoogle}
          className="w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ile giriş yap
        </Button>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-[var(--accent)] hover:underline">
            Kayıt ol
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
