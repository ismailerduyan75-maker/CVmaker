import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  runTransaction,
  type Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { Plan } from "@/types/plans";
import { CV_PER_DAY } from "@/types/plans";

export interface UserPlanDoc {
  plan: Plan;
  cvCount: number;
  resetDate: Timestamp | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionCancelled?: boolean;
  renewalDate?: string; // ISO date
}

const COLLECTION = "users";

function startOfTodaySeconds(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

export function getResetDateTimestamp(): Timestamp {
  return Timestamp.fromMillis(startOfTodaySeconds() * 1000);
}

export async function getUserPlanDoc(
  userId: string
): Promise<UserPlanDoc | null> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    plan: (d.plan as Plan) || "free",
    cvCount: typeof d.cvCount === "number" ? d.cvCount : 0,
    resetDate: d.resetDate ?? null,
    stripeCustomerId: d.stripeCustomerId,
    stripeSubscriptionId: d.stripeSubscriptionId,
    subscriptionCancelled: d.subscriptionCancelled,
    renewalDate: d.renewalDate,
  };
}

export function subscribeUserPlanDoc(
  userId: string,
  onData: (data: UserPlanDoc | null) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, userId);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        plan: (d.plan as Plan) || "free",
        cvCount: typeof d.cvCount === "number" ? d.cvCount : 0,
        resetDate: d.resetDate ?? null,
        stripeCustomerId: d.stripeCustomerId,
        stripeSubscriptionId: d.stripeSubscriptionId,
        subscriptionCancelled: d.subscriptionCancelled,
        renewalDate: d.renewalDate,
      });
    },
    (err) => {
      console.error("subscribeUserPlanDoc error:", err);
      onData(null);
    }
  );
}

/** İlk kayıt: users/{userId} yoksa free plan ile oluştur */
export async function ensureUserDoc(userId: string): Promise<UserPlanDoc> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const d = snap.data();
    return {
      plan: (d.plan as Plan) || "free",
      cvCount: typeof d.cvCount === "number" ? d.cvCount : 0,
      resetDate: d.resetDate ?? null,
      stripeCustomerId: d.stripeCustomerId,
      stripeSubscriptionId: d.stripeSubscriptionId,
      subscriptionCancelled: d.subscriptionCancelled,
      renewalDate: d.renewalDate,
    };
  }
  const now = getResetDateTimestamp();
  await setDoc(ref, {
    plan: "free",
    cvCount: 0,
    resetDate: now,
  });
  return { plan: "free", cvCount: 0, resetDate: now };
}

/** Günlük limiti kontrol et: resetDate bugünden eskiyse sayacı sıfırla, sonra artır */
export async function incrementCvCountAndGetDoc(
  userId: string
): Promise<{ doc: UserPlanDoc; allowed: boolean }> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, userId);
  const todayStart = startOfTodaySeconds();

  const result = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists()
      ? snap.data()
      : { plan: "free", cvCount: 0, resetDate: null };
    const plan: Plan = (data.plan as Plan) || "free";
    let cvCount = typeof data.cvCount === "number" ? data.cvCount : 0;
    const resetDate = data.resetDate
      ? (data.resetDate as { seconds: number }).seconds
      : 0;

    const limit = CV_PER_DAY[plan];
    if (resetDate < todayStart) {
      cvCount = 0;
    }
    if (cvCount >= limit) {
      return {
        allowed: false,
        doc: {
          plan,
          cvCount,
          resetDate: data.resetDate ? (data.resetDate as Timestamp) : null,
          stripeCustomerId: data.stripeCustomerId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          subscriptionCancelled: data.subscriptionCancelled,
          renewalDate: data.renewalDate,
        } as UserPlanDoc,
      };
    }

    const newCount = cvCount + 1;
    const newReset = resetDate < todayStart ? todayStart : resetDate;
    tx.set(ref, {
      ...data,
      cvCount: newCount,
      resetDate: Timestamp.fromMillis(newReset * 1000),
    });

    return {
      allowed: true,
      doc: {
        plan,
        cvCount: newCount,
        resetDate: Timestamp.fromMillis(newReset * 1000),
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        subscriptionCancelled: data.subscriptionCancelled,
        renewalDate: data.renewalDate,
      } as UserPlanDoc,
    };
  });

  return result;
}
