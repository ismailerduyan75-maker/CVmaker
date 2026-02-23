import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyIdToken } from "@/lib/firebaseAdmin";

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

    const body = await request.json().catch(() => ({}));
    const plan = (body.plan as string) || (body.priceId as string);
    const priceId =
      plan === "premium"
        ? process.env.STRIPE_PRICE_ID_PREMIUM
        : process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID_PRO veya STRIPE_PRICE_ID_PREMIUM tanımlayın." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/abonelik?success=1`,
      cancel_url: `${baseUrl}/fiyatlandirma?cancel=1`,
      client_reference_id: uid,
      subscription_data: {
        metadata: { userId: uid },
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ödeme oturumu oluşturulamadı." },
      { status: 500 }
    );
  }
}
