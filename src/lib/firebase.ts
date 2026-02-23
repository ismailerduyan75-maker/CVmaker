import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
} from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

let analytics: Analytics | null = null;

/** Tarayıcıda Analytics (SSR'da çağırma) */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported || !firebaseConfig.measurementId) return null;
  if (!analytics) {
    analytics = getAnalytics(getFirebaseApp());
  }
  return analytics;
}

export { getFirebaseApp, getFirebaseAuth, getFirebaseDb };

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
}

export async function uploadPhoto(file: File): Promise<string> {
  const app = getFirebaseApp();
  const storage = getStorage(app);
  const name = `cv-photos/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const storageRef = ref(storage, name);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Sunucu tarafı: Buffer ile yükleme (API route için) */
export async function uploadPhotoBuffer(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const app = getFirebaseApp();
  const storage = getStorage(app);
  const name = `cv-photos/${Date.now()}-${filename.replace(/\s/g, "_")}`;
  const storageRef = ref(storage, name);
  const blob = new Blob([new Uint8Array(buffer)], { type: "image/jpeg" });
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

/** PDF dosyasını Storage'a yükle (Premium / Pro+) */
export async function uploadPdfBuffer(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const app = getFirebaseApp();
  const storage = getStorage(app);
  const name = `cv-pdfs/${Date.now()}-${filename.replace(/\s/g, "_")}`;
  const storageRef = ref(storage, name);
  const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}
