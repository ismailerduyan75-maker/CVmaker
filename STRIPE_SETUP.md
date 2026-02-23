# Stripe ve Abonelik Kurulumu

## 1. Stripe Dashboard

- [Stripe Dashboard](https://dashboard.stripe.com) → Products → iki ürün oluştur:
  - **Pro**: Tekrarlayan fiyat ₺99/ay (TRY)
  - **Premium**: Tekrarlayan fiyat ₺199/ay (TRY)
- Her ürünün **Price ID** değerini al (örn. `price_xxx`).

## 2. Ortam değişkenleri

### Next.js (`.env.local`)

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
```

### Firebase Cloud Functions (webhook)

Stripe webhook için Functions ortam değişkenleri:

```bash
firebase functions:config:set stripe.secret_key="sk_test_..." stripe.webhook_secret="whsec_..." stripe.price_id_pro="price_..." stripe.price_id_premium="price_..."
```

Veya Firebase Console → Project Settings → Service accounts / Functions → Environment variables.

**Not:** Functions kodunda şu an `process.env.STRIPE_*` kullanılıyor. Firebase’de bu isimlerle env tanımlayın veya `functions/src/index.ts` içinde `functions.config().stripe` kullanacak şekilde güncelleyin.

## 3. Webhook (Stripe → Firebase)

1. Firebase’e deploy: `cd functions && npm run deploy`
2. Webhook URL: `https://REGION-PROJECT.cloudfunctions.net/stripeWebhook`
3. Stripe Dashboard → Developers → Webhooks → Add endpoint:
   - URL: yukarıdaki adres
   - Dinlenecek olaylar: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Signing secret’ı (`whsec_...`) alıp `STRIPE_WEBHOOK_SECRET` olarak kaydedin.

## 4. Firebase Admin (Next.js API)

`/api/create-checkout-session` ve `/api/cancel-subscription` Firebase ID token doğrulaması yapar. Bunun için:

- Firebase Console → Project Settings → Service accounts → Generate new private key
- İndirilen JSON’dan `client_email` ve `private_key` değerlerini alın.
- `.env.local`:
  - `FIREBASE_CLIENT_EMAIL=...`
  - `FIREBASE_PRIVATE_KEY="..."` (tırnak içinde, satır sonları `\n` olarak)

## 5. Akış özeti

- Kullanıcı **Fiyatlandırma** sayfasından Pro/Premium seçer → Checkout Session oluşturulur → Stripe Checkout’a yönlendirilir.
- Ödeme tamamlanınca Stripe, Firebase Functions webhook’unu çağırır → `users/{userId}` güncellenir (`plan`, `stripeSubscriptionId`, `renewalDate`).
- İptal: Dashboard → Abonelik → “Aboneliği iptal et” → Stripe’da `cancel_at_period_end` işaretlenir; dönem bitince `customer.subscription.deleted` ile Firestore’da plan tekrar `free` yapılır.
