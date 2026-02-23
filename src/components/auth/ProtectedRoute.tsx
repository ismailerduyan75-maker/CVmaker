"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Firebase Auth açıksa giriş yapılmamış kullanıcıyı /login'e yönlendirir.
 * Firebase yapılandırılmamışsa (demo) koruma uygulanmaz.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authLoading, isFirebaseAuth } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (isFirebaseAuth && !user.isLoggedIn) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      router.replace(`/login?redirect=${encodeURIComponent(pathname + search)}`);
    }
  }, [authLoading, isFirebaseAuth, user.isLoggedIn, router, pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (isFirebaseAuth && !user.isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
