"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  subscribeAuth,
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signInWithGoogle,
  handleRedirectResult,
  signOut as firebaseSignOut,
  resetPassword as firebaseResetPassword,
} from "@/lib/firebaseAuth";
import {
  subscribeUserPlanDoc,
  ensureUserDoc,
  incrementCvCountAndGetDoc,
  type UserPlanDoc,
} from "@/lib/firestoreUser";
import type { Plan } from "@/types/plans";
import {
  CV_PER_DAY,
  TEMPLATE_LIMIT,
  hasPdfWatermark,
  isPaidPlan,
} from "@/types/plans";

const CV_SAVE_LIMIT_FREE = 5;

export type { Plan };

export interface AppUser {
  isLoggedIn: boolean;
  plan: Plan;
  email?: string;
  displayName?: string;
  photoURL?: string;
  uid?: string;
  renewalDate?: string;
  subscriptionCancelled?: boolean;
  cvCount: number;
  resetDate: Date | null;
}

interface AuthContextValue {
  user: AppUser;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  userPlanLoading: boolean;
  setUser: (u: Partial<AppUser>) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  pdfLimit: number;
  canDownloadPdf: boolean;
  isPaidPlan: boolean;
  cvSaveLimit: number;
  canSaveNewCV: (currentCount: number) => boolean;
  cvCountToday: number;
  cvLimitPerDay: number;
  canCreateCvToday: boolean;
  templateLimit: number;
  withPdfWatermark: boolean;
  incrementCvCountAfterGenerate: () => Promise<boolean>;
  stripeSubscriptionId: string | undefined;
  isFirebaseAuth: boolean;
}

const defaultUser: AppUser = {
  isLoggedIn: false,
  plan: "free",
  cvCount: 0,
  resetDate: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function planDocToAppUser(
  firebaseUser: FirebaseUser | null,
  doc: UserPlanDoc | null
): AppUser {
  if (!firebaseUser)
    return { ...defaultUser, plan: doc?.plan ?? "free", cvCount: doc?.cvCount ?? 0, resetDate: doc?.resetDate ? new Date(doc.resetDate.toMillis()) : null };
  return {
    isLoggedIn: true,
    plan: doc?.plan ?? "free",
    email: firebaseUser.email ?? undefined,
    displayName: firebaseUser.displayName ?? undefined,
    photoURL: firebaseUser.photoURL ?? undefined,
    uid: firebaseUser.uid,
    renewalDate: doc?.renewalDate,
    subscriptionCancelled: doc?.subscriptionCancelled,
    cvCount: doc?.cvCount ?? 0,
    resetDate: doc?.resetDate ? new Date(doc.resetDate.toMillis()) : null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userPlanDoc, setUserPlanDoc] = useState<UserPlanDoc | null>(null);
  const [userPlanLoading, setUserPlanLoading] = useState(true);

  const isFirebaseAuth = isFirebaseConfigured();
  const plan = userPlanDoc?.plan ?? "free";

  useEffect(() => {
    if (!isFirebaseAuth) {
      setAuthLoading(false);
      setUserPlanLoading(false);
      return;
    }
    let unsubscribe: (() => void) | null = null;
    handleRedirectResult()
      .then(() => {
        unsubscribe = subscribeAuth((user) => {
          setFirebaseUser(user ?? null);
          setAuthLoading(false);
        });
      })
      .catch(() => {
        setAuthLoading(false);
      });
    return () => {
      unsubscribe?.();
    };
  }, [isFirebaseAuth]);

  useEffect(() => {
    if (!isFirebaseAuth || !firebaseUser?.uid) {
      setUserPlanLoading(false);
      return;
    }
    setUserPlanLoading(true);
    const unsub = subscribeUserPlanDoc(firebaseUser.uid, (doc) => {
      if (doc) {
        setUserPlanDoc(doc);
      } else {
        ensureUserDoc(firebaseUser.uid!).then((d) => {
          setUserPlanDoc(d);
        });
      }
      setUserPlanLoading(false);
    });
    return () => unsub();
  }, [isFirebaseAuth, firebaseUser?.uid]);

  const user: AppUser = firebaseUser
    ? planDocToAppUser(firebaseUser, userPlanDoc)
    : { ...defaultUser, plan };

  const setUser = useCallback((_u: Partial<AppUser>) => {
    // Plan artık Firestore'dan geliyor; yerel override kaldırıldı
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await firebaseSignIn(email, password);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      await firebaseSignUp(email, password, displayName);
    },
    []
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await firebaseResetPassword(email);
  }, []);

  const signInWithGoogleHandler = useCallback(async (): Promise<void> => {
    await signInWithGoogle();
  }, []);

  const pdfLimit = isPaidPlan(plan) ? 999 : 999;
  const canDownloadPdf = user.isLoggedIn;
  const cvSaveLimit = isPaidPlan(plan) ? 999 : CV_SAVE_LIMIT_FREE;
  const canSaveNewCV = useCallback(
    (currentCount: number) =>
      isPaidPlan(plan) || currentCount < CV_SAVE_LIMIT_FREE,
    [plan]
  );

  const cvCountToday = userPlanDoc?.cvCount ?? 0;
  const cvLimitPerDay = CV_PER_DAY[plan];
  const canCreateCvToday = cvCountToday < cvLimitPerDay;
  const templateLimit = TEMPLATE_LIMIT[plan];
  const withPdfWatermark = hasPdfWatermark(plan);

  const incrementCvCountAfterGenerate = useCallback(async (): Promise<boolean> => {
    if (!firebaseUser?.uid) return false;
    const { allowed, doc: newDoc } = await incrementCvCountAndGetDoc(
      firebaseUser.uid
    );
    setUserPlanDoc(newDoc);
    return allowed;
  }, [firebaseUser?.uid]);

  const value: AuthContextValue = {
    user,
    firebaseUser,
    authLoading,
    userPlanLoading,
    setUser,
    signIn,
    signUp,
    signInWithGoogle: signInWithGoogleHandler,
    signOut,
    resetPassword,
    pdfLimit,
    canDownloadPdf,
    isPaidPlan: isPaidPlan(plan),
    cvSaveLimit,
    canSaveNewCV,
    cvCountToday,
    cvLimitPerDay,
    canCreateCvToday,
    templateLimit,
    withPdfWatermark,
    incrementCvCountAfterGenerate,
    stripeSubscriptionId: userPlanDoc?.stripeSubscriptionId,
    isFirebaseAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
