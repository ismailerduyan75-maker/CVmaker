"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const PUBLIC_PATHS = ["/", "/olustur", "/login", "/register", "/sifremi-unuttum", "/fiyatlandirma"];
const PUBLIC_PREFIXES = ["/cv/"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Tüm uygulamada giriş kontrolü: korumalı sayfada giriş yoksa /login'e yönlendirir.
 * Public: /login, /register, /sifremi-unuttum, /cv/*
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authLoading } = useAuth();

  const isPublic = pathname ? isPublicPath(pathname) : false;
  const shouldRedirect = !isPublic && !authLoading && !user.isLoggedIn;

  useEffect(() => {
    if (!shouldRedirect) return;
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`/login?redirect=${encodeURIComponent(pathname + search)}`);
  }, [shouldRedirect, pathname, router]);

  if (authLoading && !isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (shouldRedirect) {
    return null;
  }

  return <>{children}</>;
}
