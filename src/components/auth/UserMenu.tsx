"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PLAN_LABELS } from "@/types/plans";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user, signOut, isFirebaseAuth } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await signOut();
      toast.success("Çıkış yapıldı.");
      router.push("/login");
    } catch {
      toast.error("Çıkış yapılamadı.");
    }
  };

  if (!isFirebaseAuth) {
    return <ThemeToggle />;
  }
  if (!user.isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/login"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
        >
          Giriş yap
        </Link>
        <Link
          href="/register"
          className="rounded-lg px-3 py-1.5 text-sm font-medium bg-[var(--accent)] text-slate-950"
        >
          Kayıt ol
        </Link>
      </div>
    );
  }

  const initial = user.displayName?.slice(0, 1).toUpperCase() || user.email?.slice(0, 1).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <ThemeToggle />
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] p-1 pr-2 hover:bg-[var(--card-hover)]"
          aria-label="Hesap menüsü"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-medium text-[var(--accent)]">
              {initial}
            </span>
          )}
        </button>
        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 shadow-lg">
            <div className="px-4 py-2 border-b border-[var(--border)]">
              <p className="truncate text-sm font-medium text-[var(--text)]">
                {user.displayName || "Kullanıcı"}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">
                {user.email}
              </p>
              <p className="text-xs text-[var(--accent)] mt-0.5">
                {PLAN_LABELS[user.plan]}
              </p>
            </div>
            <Link
              href="/fiyatlandirma"
              className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)]"
              onClick={() => setOpen(false)}
            >
              Fiyatlandırma
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)]"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-[var(--error)] hover:bg-[var(--bg-elevated)]"
            >
              Çıkış yap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
