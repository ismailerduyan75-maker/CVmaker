import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  type User,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

export function getAuthInstance() {
  return getFirebaseAuth();
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName?.trim() && cred.user) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  return cred;
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

/** Google ile giriş: sayfayı Google’a yönlendirir; dönüşte getRedirectResult ile tamamlanır. */
export async function signInWithGoogle(): Promise<void> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
}

/** Yönlendirme sonrası dönüşte çağrılmalı (örn. AuthContext mount). */
export async function handleRedirectResult(): Promise<UserCredential | null> {
  const auth = getFirebaseAuth();
  return getRedirectResult(auth);
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  return firebaseSignOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  return sendPasswordResetEmail(auth, email);
}

export async function updateUserProfile(displayName: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: displayName.trim() });
  }
}
