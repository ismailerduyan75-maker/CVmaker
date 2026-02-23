import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { nanoid } from "nanoid";
import type { SavedCV, CVFormData } from "@/types/cv";

const COLLECTION = "cvs";

/** Slug için geçerli karakterler (Pro özel slug: küçük harf, rakam, tire) */
export const SLUG_REGEX = /^[a-z0-9-]+$/;
export const SLUG_MIN = 3;
export const SLUG_MAX = 64;

function toSavedCV(id: string, data: Record<string, unknown>): SavedCV {
  return {
    id,
    title: (data.title as string) || "",
    formData: (data.formData as CVFormData) || {} as CVFormData,
    cvText: (data.cvText as string) || "",
    createdAt: (data.createdAt as Timestamp)?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    slug: data.slug as string | undefined,
    publicEnabled: data.publicEnabled === true,
    viewCount: typeof data.viewCount === "number" ? data.viewCount : 0,
    customSlug: data.customSlug === true,
  };
}

/** Benzersiz nanoid slug (kısa, URL dostu) */
export function generateSlug(): string {
  return nanoid(10);
}

/** Kullanıcının CV listesini getir */
export async function getCVsByUser(userId: string): Promise<SavedCV[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toSavedCV(d.id, d.data()));
}

/** Yeni CV ekle; slug üret (free: nanoid, Pro: customSlug verilmişse slug parametresi kullanılır) */
export async function createCV(
  userId: string,
  payload: { title: string; formData: CVFormData; cvText: string },
  options: { customSlug?: string } = {}
): Promise<SavedCV> {
  const db = getFirebaseDb();
  const cvId = crypto.randomUUID();
  const now = new Date();
  const slug = options.customSlug && SLUG_REGEX.test(options.customSlug) && options.customSlug.length >= SLUG_MIN && options.customSlug.length <= SLUG_MAX
    ? options.customSlug.toLowerCase().replace(/\s+/g, "-")
    : generateSlug();

  const docData = {
    userId,
    title: payload.title,
    formData: payload.formData,
    cvText: payload.cvText,
    slug,
    customSlug: !!options.customSlug,
    publicEnabled: true,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, COLLECTION, cvId), docData);
  return toSavedCV(cvId, { ...docData, createdAt: now, updatedAt: now });
}

/** CV güncelle */
export async function updateCVFirestore(
  cvId: string,
  userId: string,
  payload: { title?: string; formData?: CVFormData; cvText?: string; publicEnabled?: boolean; customSlug?: string }
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, cvId);
  const snap = await getDoc(ref);
  if (!snap.exists() || (snap.data()?.userId as string) !== userId) return;

  const updates: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  if (payload.title !== undefined) updates.title = payload.title;
  if (payload.formData !== undefined) updates.formData = payload.formData;
  if (payload.cvText !== undefined) updates.cvText = payload.cvText;
  if (payload.publicEnabled !== undefined) updates.publicEnabled = payload.publicEnabled;
  if (payload.customSlug !== undefined) {
    const slug = payload.customSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (SLUG_REGEX.test(slug) && slug.length >= SLUG_MIN && slug.length <= SLUG_MAX) {
      updates.slug = slug;
      updates.customSlug = true;
    }
  }
  await updateDoc(ref, updates);
}

/** Slug'un başka bir CV'de kullanılıp kullanılmadığını kontrol et (mevcut cvId hariç) */
export async function isSlugTaken(slug: string, excludeCvId?: string): Promise<boolean> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return false;
  return snap.docs[0].id !== excludeCvId;
}

/** CV sil */
export async function deleteCVFirestore(cvId: string, userId: string): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, cvId);
  const snap = await getDoc(ref);
  if (!snap.exists() || (snap.data()?.userId as string) !== userId) return;
  await deleteDoc(ref);
}

/** Slug ile public CV getir (viewCount artırmak için API kullanılacak) */
export async function getCVBySlug(slug: string): Promise<SavedCV | null> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    where("publicEnabled", "==", true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return toSavedCV(d.id, d.data());
}

/** Görüntülenme sayısını artır (server-side için ayrı API kullanılacak) */
export async function incrementCVViewCount(cvId: string): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, cvId);
  await updateDoc(ref, { viewCount: increment(1) });
}
