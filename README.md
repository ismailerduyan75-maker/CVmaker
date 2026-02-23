# CV Oluşturucu

Next.js ve Tailwind CSS ile Türkçe CV metni oluşturan web uygulaması. Formu doldurup "CV Metnini Oluştur" butonuna bastığınızda OpenAI API ile profesyonel Türkçe CV metni üretilir ve sağ tarafta önizleme olarak gösterilir.

## Özellikler

- **Kişisel bilgiler:** Ad Soyad, E-posta, Telefon, Şehir
- **Profil özeti / Hakkımda:** Metin alanı + "AI ile otomatik oluştur" butonu
- **İş deneyimi:** Şirket, pozisyon, tarih, açıklama (birden fazla)
- **Eğitim:** Okul, bölüm, mezuniyet yılı, GPA (opsiyonel)
- **Beceriler:** Tag girişi, seviye (Başlangıç/Orta/İleri)
- **Dil becerileri:** Dil + seviye (A1–C2)
- **Sertifikalar:** Sertifika adı, kurum, tarih
- **LinkedIn & GitHub** URL alanları
- **Fotoğraf yükleme:** Firebase Storage’a kayıt (opsiyonel)
- **Bölümler** Yukarı/Aşağı butonları ile sıralanabilir
- **Form verisi** localStorage’a otomatik kaydedilir
- **PDF indirme:** html2pdf.js ile; Ücretsiz kullanıcılarda "CV Oluşturucu ile hazırlandı" watermark’ı; Pro+ watermark’sız ve PDF Firebase Storage’a kaydedilir
- **Firebase Authentication:** Giriş yapmadan CV oluşturulamaz. Kayıt ol (/kayit), Giriş yap (/giris), Google ile giriş, Şifremi unuttum (/sifremi-unuttum). Auth state listener ile oturum yönetimi.
- **Hesap / limit:** Ücretsiz ayda 3 PDF; Pro+ sınırsız; indirmeden önce giriş ve limit kontrolü
- OpenAI ile profesyonel Türkçe CV metni üretimi

## Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Ortam değişkenlerini ayarlayın:
   - `.env.example` dosyasını `.env.local` olarak kopyalayıp doldurun.
   - `OPENAI_API_KEY`: [OpenAI API Keys](https://platform.openai.com/api-keys) sayfasından alın (zorunlu).
   - **Firebase** (fotoğraf, PDF, Auth, Firestore): Tüm adımlar için **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** dosyasına bakın. `.env.local` içine `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` ekleyin.

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

4. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

- Sol taraftaki formu doldurun.
- İş deneyimi ve eğitim için "Deneyim ekle" / "Eğitim ekle" ile birden fazla kayıt ekleyebilirsiniz.
- "CV Metnini Oluştur" butonuna tıklayın.
- Sağ tarafta oluşturulan profesyonel CV metni önizleme olarak görüntülenecektir.
- Önizleme panelindeki **PDF İndir** ile CV’yi PDF olarak indirebilirsiniz. Header’dan Hesap: **Ücretsiz** (3 PDF/ay, watermark’lı) veya **Pro+** (watermark’sız, PDF Storage’a kayıt) seçebilirsiniz.

## Teknolojiler

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS
- html2pdf.js (PDF indirme)
- Firebase (Authentication: E-posta/şifre + Google; Storage: fotoğraf, Pro+ PDF)
- OpenAI API (GPT-4o-mini)
