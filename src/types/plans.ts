/** Abonelik planı: Firestore users/{userId}.plan ile senkron */
export type Plan = "free" | "pro" | "premium";

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Ücretsiz",
  pro: "Pro",
  premium: "Premium",
};

/** Günlük CV oluşturma limiti (AI ile üretim) */
export const CV_PER_DAY: Record<Plan, number> = {
  free: 2,
  pro: 999,
  premium: 999,
};

/** Kullanılabilir şablon sayısı */
export const TEMPLATE_LIMIT: Record<Plan, number> = {
  free: 1,
  pro: 5,
  premium: 10,
};

/** PDF'de watermark olsun mu */
export function hasPdfWatermark(plan: Plan): boolean {
  return plan === "free";
}

/** Ücretli plan mı (Pro veya Premium) */
export function isPaidPlan(plan: Plan): boolean {
  return plan === "pro" || plan === "premium";
}

export const PRICE_PRO_MONTHLY_TRY = 99;
export const PRICE_PREMIUM_MONTHLY_TRY = 199;
