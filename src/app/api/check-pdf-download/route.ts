import { NextRequest, NextResponse } from "next/server";

/** İstek başlığı veya body ile plan gönderilir; giriş ve limit kontrolü (örnek). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const plan = (body.plan as string) || request.headers.get("x-plan") || "free";
    const paid = plan === "pro" || plan === "premium";
    const allowed = paid;
    return NextResponse.json({
      allowed,
      plan,
      message: allowed ? undefined : "PDF indirmek için Pro veya Premium plan gerekir.",
    });
  } catch {
    return NextResponse.json(
      { allowed: false, message: "Kontrol başarısız." },
      { status: 500 }
    );
  }
}
