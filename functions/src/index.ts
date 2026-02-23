import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import express from "express";

admin.initializeApp();

function getStripeConfig() {
  const c = functions.config();
  const stripeConfig = (c as { stripe?: Record<string, string> }).stripe;
  return {
    secretKey: stripeConfig?.secret_key || process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: stripeConfig?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET || "",
    priceIdPro: stripeConfig?.price_id_pro || process.env.STRIPE_PRICE_ID_PRO || "",
    priceIdPremium: stripeConfig?.price_id_premium || process.env.STRIPE_PRICE_ID_PREMIUM || "",
  };
}

const stripe = new Stripe(getStripeConfig().secretKey);
const PRICE_ID_PRO = getStripeConfig().priceIdPro;
const PRICE_ID_PREMIUM = getStripeConfig().priceIdPremium;
const db = admin.firestore();

type Plan = "free" | "pro" | "premium";

function planFromPriceId(priceId: string): Plan {
  if (priceId === PRICE_ID_PREMIUM) return "premium";
  if (priceId === PRICE_ID_PRO) return "pro";
  return "pro";
}

const app = express();
app.use(express.raw({ type: "application/json" }));
app.post("/", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const sig = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = getStripeConfig().webhookSecret;
  if (!webhookSecret || !sig) {
    console.error("STRIPE_WEBHOOK_SECRET veya signature yok");
    res.status(400).end();
    return;
  }
  const payload = req.body as Buffer;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload.toString("utf8"),
      sig,
      webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown";
    console.error("Webhook signature verification failed:", message);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || (session.metadata && session.metadata.userId);
        if (!userId || !session.subscription) {
          console.error("checkout.session.completed: userId veya subscription yok");
          res.status(200).end();
          return;
        }
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
          { expand: ["items.data.price"] }
        );
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = priceId ? planFromPriceId(priceId) : "pro";
        const currentPeriodEnd = subscription.current_period_end;
        const renewalDate = new Date(currentPeriodEnd * 1000).toISOString().slice(0, 10);

        await db.collection("users").doc(userId).set(
          {
            plan,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            subscriptionCancelled: false,
            renewalDate,
            cvCount: 0,
            resetDate: admin.firestore.Timestamp.fromMillis(
              Math.floor(Date.now() / 86400000) * 86400000
            ),
          },
          { merge: true }
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const snap = await db.collection("users")
          .where("stripeSubscriptionId", "==", subscription.id)
          .limit(1)
          .get();
        if (snap.empty) break;
        await snap.docs[0].ref.update({
          subscriptionCancelled: subscription.cancel_at_period_end === true,
          renewalDate: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString().slice(0, 10)
            : undefined,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const snap = await db.collection("users")
          .where("stripeSubscriptionId", "==", subscription.id)
          .limit(1)
          .get();
        if (snap.empty) break;
        await snap.docs[0].ref.update({
          plan: "free",
          stripeSubscriptionId: admin.firestore.FieldValue.delete(),
          subscriptionCancelled: false,
          renewalDate: admin.firestore.FieldValue.delete(),
        });
        break;
      }

      default:
        break;
    }
    res.status(200).end();
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).end();
  }
});

export const stripeWebhook = functions.https.onRequest(app);
