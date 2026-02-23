import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import type { SavedCV, CVFormData } from "@/types/cv";
import * as admin from "firebase-admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let db;
    try {
      db = getAdminDb();
    } catch {
      return NextResponse.json(
        { error: "Sunucu yapılandırması eksik." },
        { status: 503 }
      );
    }
    if (!slug?.trim()) {
      return NextResponse.json({ error: "Slug gerekli." }, { status: 400 });
    }

    const snap = await db
      .collection("cvs")
      .where("slug", "==", slug.trim())
      .where("publicEnabled", "==", true)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "CV bulunamadı veya yayında değil." }, { status: 404 });
    }

    const doc = snap.docs[0];
    const data = doc.data();
    const id = doc.id;

    await doc.ref.update({
      viewCount: admin.firestore.FieldValue.increment(1),
    });

    const cv: Omit<SavedCV, "userId"> & { id: string } = {
      id,
      title: (data.title as string) || "",
      formData: (data.formData as CVFormData) || ({} as CVFormData),
      cvText: (data.cvText as string) || "",
      createdAt:
        (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ??
        new Date().toISOString(),
      updatedAt:
        (data.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ??
        new Date().toISOString(),
      slug: data.slug as string,
      publicEnabled: true,
      viewCount: (typeof data.viewCount === "number" ? data.viewCount : 0) + 1,
    };

    return NextResponse.json(cv);
  } catch (err) {
    console.error("GET /api/cv/[slug]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "CV yüklenemedi." },
      { status: 500 }
    );
  }
}
