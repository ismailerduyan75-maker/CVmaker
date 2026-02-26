export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Kullanım Şartları</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Bu Kullanım Şartları, <strong>İsmail Erduyan</strong> tarafından sunulan CV oluşturma
          ve abonelik hizmetlerinin (&quot;Hizmet&quot;) kullanımına ilişkin kuralları düzenler.
          Hizmeti kullanmaya başlayan tüm kullanıcılar, bu şartları okumuş ve kabul etmiş
          sayılır.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Hizmetin Tanımı</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Hizmet; kullanıcıların çevrimiçi ortamda özgeçmiş oluşturmasına, düzenlemesine ve
            farklı formatlarda çıktı almasına imkan tanıyan bir dijital araçtır. Hizmet, tamamen
            dijital içerik ve abonelik modeli ile sunulur; fiziksel ürün gönderimi yapılmaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Üyelik ve Hesap Güvenliği</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Kullanıcılar, kayıt sırasında doğru ve güncel bilgiler vermekle yükümlüdür. Hesap
            bilgileri ve şifrelerin gizliliğinden kullanıcı sorumludur. Üçüncü kişilerin hesabı
            izinsiz kullanımı halinde derhal Şirkete bildirilmelidir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Kullanım Kuralları</h2>
          <ul className="list-disc list-inside text-sm text-[var(--text-muted)] space-y-1">
            <li>Hizmet, yürürlükteki mevzuata ve genel ahlak kurallarına aykırı amaçlarla kullanılamaz.</li>
            <li>Hizmet üzerinden paylaşılan içeriklerin doğruluğundan kullanıcı sorumludur.</li>
            <li>Hizmetin kaynak kodunu tersine mühendislik yöntemiyle çözmeye, kopyalamaya veya izinsiz paylaşmaya yönelik eylemler yasaktır.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Ücretlendirme ve Abonelik</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Hizmetin belirli özellikleri ücretsiz, belirli özellikleri ise ücretli abonelik
            kapsamında sunulabilir. Güncel fiyatlar ve paket içerikleri, sitede &quot;Fiyatlandırma&quot;
            bölümünde yayımlanan bilgilere tabidir. Şirket, makul bildirim süreleriyle fiyat
            değişikliği yapma hakkını saklı tutar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Fikri Mülkiyet Hakları</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Site tasarımı, yazılım kodları, logo ve markalar ile sunulan tüm içerikler,
            ilgili mevzuat uyarınca fikri ve sınai mülkiyet koruması altındadır. Kullanıcılar,
            Şirketin yazılı izni olmaksızın bu içerikleri kopyalayamaz, çoğaltamaz veya ticari
            amaçla kullanamaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Sorumluluğun Sınırı</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Hizmet, makul çaba ile sürekli ve kesintisiz sunulmaya çalışılmakla birlikte; teknik
            arızalar, bakım süreçleri veya üçüncü taraf hizmet sağlayıcılarından kaynaklanan
            kesintilerden doğan dolaylı zararlardan Şirket sorumlu tutulamaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Yürürlük ve Değişiklikler</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Bu Kullanım Şartları yayımlandığı tarihte yürürlüğe girer. Şirket, gerekli gördüğü
            hallerde şartları güncelleyebilir; güncel metin her zaman bu sayfada erişime açık
            olacaktır. Değişikliklerden sonra Hizmetin kullanılmaya devam edilmesi, yeni
            şartların kabulü anlamına gelir.
          </p>
        </section>
      </div>
    </div>
  );
}

