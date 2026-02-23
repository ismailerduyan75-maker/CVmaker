import { NextRequest, NextResponse } from "next/server";

/** Pro+ kullanıcılar için PDF'i Firebase Storage'a yükler. */
export async function POST(request: NextRequest) {
  try {
    const { uploadPdfBuffer } = await import("@/lib/firebase");
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "PDF dosyası gönderilmedi." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file instanceof File ? file.name : "cv.pdf";
    const url = await uploadPdfBuffer(buffer, name);
    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Yükleme başarısız.";
    return NextResponse.json(
      {
        error:
          "Firebase ayarlı değil veya PDF yüklenemedi. Pro+ için Storage gerekir.",
      },
      { status: 503 }
    );
  }
}
