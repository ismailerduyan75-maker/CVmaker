import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { uploadPhotoBuffer } = await import("@/lib/firebase");
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Dosya gönderilmedi." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file instanceof File ? file.name : "photo.jpg";
    const url = await uploadPhotoBuffer(buffer, name);
    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Yükleme başarısız.";
    const isConfig =
      msg.includes("projectId") ||
      msg.includes("storage") ||
      msg.includes("Cannot find module");
    return NextResponse.json(
      {
        error: isConfig
          ? "Firebase ayarlı değil veya firebase paketi yüklü değil. .env.local ve npm install firebase kontrol edin."
          : msg,
      },
      { status: 503 }
    );
  }
}
