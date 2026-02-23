import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyIdToken } from "@/lib/firebaseAdmin";
import { getAdminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const idToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (!idToken) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor." },
        { status: 401 }
      );
    }
    let uid: string;
    try {
      ({ uid } = await verifyIdToken(idToken));
    } catch {
      return NextResponse.json(
        { error: "Geçersiz oturum. Lütfen tekrar giriş yapın." },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const subscriptionId = userSnap.data()?.stripeSubscriptionId;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Aktif abonelik bulunamadı." },
        { status: 400 }
      );
    }

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    await userRef.update({ subscriptionCancelled: true });

    return NextResponse.json({
      success: true,
      message: "Abonelik dönem sonunda iptal edilecek.",
    });
  } catch (err) {
    console.error("cancel-subscription error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "İptal işlemi yapılamadı.",
      },
      { status: 500 }
    );
  }
}
