import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/sifremi-unuttum"];
const PUBLIC_PREFIXES = ["/cv/"]; // /cv/[slug] public

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Middleware: Sunucu tarafında oturum bilgisi yok (Firebase client-side).
 * İleride cookie ile session kullanılırsa burada /login yönlendirmesi eklenebilir.
 * Şu an auth kontrolü layout içindeki AuthGuard (client) ile yapılıyor.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
