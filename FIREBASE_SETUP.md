# Firebase Projesi Kurulumu

Bu rehber, [Firebase Console](https://console.firebase.google.com) üzerinden proje oluşturup uygulamaya entegre etmeniz için adımları içerir.

---

## 1. Yeni proje oluşturma

1. [console.firebase.google.com](https://console.firebase.google.com) adresine gidin.
2. **Proje Ekle** (veya **Create a project**) tıklayın.
3. Proje adı girin (örn: `cv-olusturucu`) ve **Devam** deyin.
4. Google Analytics’i isteğe bağlı bırakıp **Proje oluştur** ile bitirin.

---

## 2. Authentication’ı etkinleştirme

1. Sol menüden **Build → Authentication** seçin.
2. **Başlayın** / **Get started** tıklayın.
3. **Sign-in method** sekmesine gidin:
   - **E-posta/Parola**: Etkinleştir, **Kaydet**.
   - **Google**: Etkinleştir, proje destek e-postası seçin, **Kaydet**.

---

## 3. Firestore Database oluşturma

1. Sol menüden **Build → Firestore Database** seçin.
2. **Veritabanı oluştur** tıklayın.
3. **Üretim modunda başlat** (Production mode) seçin, **İleri**.
4. Konum seçin (örn: `europe-west1`), **Etkinleştir** deyin.

Sonradan kuralları düzenlemek için: **Kurallar** sekmesinden erişebilirsiniz.

---

## 4. Storage’ı etkinleştirme (PDF / fotoğraf)

1. Sol menüden **Build → Storage** seçin.
2. **Başlayın** tıklayın.
3. Varsayılan güvenlik kurallarını kabul edip **İleri** → **Tamam** ile bitirin.

---

## 5. Web uygulaması ekleme ve config değerleri

1. Proje ayarlarına gidin: dişli ikonu → **Proje ayarları**.
2. **Genel** sekmesinde aşağı kaydırıp **Uygulamalar** bölümüne gidin.
3. **</>** (Web) ikonuna tıklayın.
4. Uygulama adı girin (örn: `CV Oluşturucu`), **Uygulamayı kaydet**.
5. Açılan `firebaseConfig` objesindeki değerleri kopyalayın.

---

## 6. .env dosyasına değişkenleri ekleme

Proje kökünde `.env.local` dosyası oluşturun (veya `.env.example` dosyasını `.env.local` olarak kopyalayıp doldurun).

**Next.js** kullandığımız için değişken adları **`NEXT_PUBLIC_`** ile başlamalıdır:

```env
# Firebase (Console'dan kopyaladığınız değerler)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Create React App kullanıyor olsaydınız aynı değerleri `REACT_APP_FIREBASE_*` adlarıyla da yazabilirdiniz; bu projede **sadece `NEXT_PUBLIC_`** kullanılıyor.

---

## 7. Uygulama tarafı

- **Config**: `src/lib/firebase.ts` — Firebase App, Auth, Firestore, Storage başlatılır.
- **Auth yardımcıları**: `src/lib/firebaseAuth.ts` — E-posta/şifre ve Google ile giriş, çıkış, auth dinleyici.
- **Paket**: `firebase` zaten `package.json` içinde; gerekirse `npm install` çalıştırın.

Auth durumunu (giriş/çıkış) uygulama genelinde kullanmak için `AuthContext` içinde `subscribeAuth` ile Firebase kullanıcısını dinleyip state’i güncelleyebilirsiniz.

---

## Özet kontrol listesi

- [ ] Firebase Console’da yeni proje oluşturuldu.
- [ ] Authentication açıldı (E-posta/Parola + Google).
- [ ] Firestore Database oluşturuldu (production mode).
- [ ] Storage etkinleştirildi.
- [ ] Web uygulaması eklendi, config değerleri alındı.
- [ ] `.env.local` dosyasına `NEXT_PUBLIC_FIREBASE_*` değişkenleri yazıldı.
- [ ] `npm install` (ve gerekirse `npm run dev`) çalıştırıldı.
