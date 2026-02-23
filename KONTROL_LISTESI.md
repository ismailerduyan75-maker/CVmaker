# Site kontrol listesi (Stripe kurulumundan önce)

## 1. Projeyi çalıştırma

Proje klasöründe (Türkçe karakterli klasör adıyla) terminal açıp:

```bash
npm run dev
```

Tarayıcıda **http://localhost:3000** açın.

---

## 2. Kontrol edilecekler

### Genel
- [ ] Ana sayfa açılıyor, form ve önizleme görünüyor.
- [ ] Giriş yapmadan CV oluşturma butonu korumalı (girişe yönlendiriyor veya uyarı veriyor).

### Giriş / Firebase (Firebase ayarlıysa)
- [ ] **Giriş** / **Kayıt** sayfaları çalışıyor.
- [ ] Giriş yaptıktan sonra sağ üstte kullanıcı menüsü ve **Ücretsiz** planı görünüyor.
- [ ] Menüden **Fiyatlandırma** ve **Dashboard** linkleri çalışıyor.

### Fiyatlandırma (`/fiyatlandirma`)
- [ ] Sayfa açılıyor; Ücretsiz, Pro (₺99/ay), Premium (₺199/ay) kartları görünüyor.
- [ ] Giriş yapmadan "Pro'ya geç" / "Premium'a geç" tıklanınca giriş sayfasına yönlendiriyor (`?redirect=/fiyatlandirma`).
- [ ] Giriş yapılıyken "Pro'ya geç" tıklanınca (Stripe ayarlı değilse) API hatası veya yönlendirme hatası normal; Stripe kurulunca düzelecek.

### Ana sayfa – CV ve limit
- [ ] Giriş yapılmışken **CV metni oluştur** çalışıyor (OpenAI key varsa).
- [ ] Ücretsiz planda 2 CV oluşturduktan sonra 3. denemede "Bugünkü CV oluşturma limitiniz doldu" benzeri uyarı çıkıyor.
- [ ] PDF indir: Ücretsiz planda PDF’de **"CV Oluşturucu ile hazırlandı"** watermark’ı görünüyor.

### Dashboard
- [ ] **Dashboard** → **CVlerim**: Kayıtlı CV’ler listeleniyor, PDF indirme (watermark’lı) çalışıyor.
- [ ] **Dashboard** → **İstatistikler**: "CV oluşturma (günlük)" alanında ücretsiz planda "X / 2 CV (günlük)" görünüyor.
- [ ] **Dashboard** → **Abonelik**: "Ücretsiz" plan ve "Planı yükselt" linki görünüyor.
- [ ] **Dashboard** → **CVlerim**: Her CV'de paylaşım linki, "Açık" toggle, görüntülenme, "Linki kopyala" var.
- [ ] **Public link**: Bir CV kaydedip linki açıkken `/cv/SLUG` adresi çalışıyor; "Bu CV'yi sen de oluştur" ve paylaşım butonları görünüyor; görüntülenme +1 artıyor.

### Hata durumları (beklenen)
- **Stripe / Firebase Admin ayarlı değilse:** "Pro'ya geç" tıklanınca 401 veya 500 alabilirsiniz; `.env.local` ve Stripe kurulumundan sonra düzelir.
- **Firebase yoksa:** Giriş/Kayıt ve plan bilgisi çalışmaz; sadece demo modda ana sayfa ve form çalışır.

---

## 3. Build (opsiyonel)

Derleme hatası olup olmadığını görmek için:

```bash
npm run build
```

Türkçe karakterli klasörde sorun çıkarsa projeyi Türkçe karakter içermeyen bir klasöre kopyalayıp orada `npm run build` deneyin.
