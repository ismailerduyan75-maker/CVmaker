export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Gizlilik Politikası</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Bu Gizlilik Politikası, <strong>İsmail Erduyan</strong> (&quot;Şirket&quot;) tarafından
          sunulan CV oluşturma ve abonelik hizmetlerini kullanırken kişisel verilerinizin 6698
          sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat uyarınca
          nasıl işlendiğini açıklamaktadır.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Veri Sorumlusu</h2>
          <p className="text-sm text-[var(--text-muted)]">
            KVKK uyarınca veri sorumlusu, <strong>İsmail Erduyan</strong>&apos;dır.
          </p>
          <div className="text-sm text-[var(--text-muted)] space-y-1">
            <p><strong>Şirket Adı:</strong> İsmail Erduyan</p>
            <p><strong>Vergi Numarası:</strong> 3520203173</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">İşlenen Kişisel Veriler</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Hizmetlerimizi kullanırken aşağıdaki kişisel verileriniz işlenebilmektedir:
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--text-muted)] space-y-1">
            <li>Kimlik bilgileri (ad, soyad)</li>
            <li>İletişim bilgileri (e-posta adresi, telefon numarası)</li>
            <li>CV içeriği (eğitim, iş deneyimi, beceriler, sertifikalar vb.)</li>
            <li>Oturum ve kullanım verileri (giriş bilgileri, işlem kayıtları)</li>
            <li>Ödeme hizmeti sağlayıcısı (iyzico vb.) aracılığıyla işlenen sınırlı ödeme bilgileri</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Kişisel Verilerin İşlenme Amaçları</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--text-muted)] space-y-1">
            <li>CV oluşturma hizmetinin sunulması ve geliştirilmesi</li>
            <li>Üyelik ve abonelik süreçlerinin yürütülmesi</li>
            <li>Ödeme işlemlerinin gerçekleştirilmesi ve faturalandırma</li>
            <li>Hizmetlere ilişkin bildirimlerin ve duyuruların yapılması</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi ve uyuşmazlıkların çözümü</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Aktarım ve Saklama Süreleri</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Kişisel verileriniz, yalnızca hizmetin sunulması için gerekli olduğu ölçüde ve
            KVKK&apos;da öngörülen saklama süreleri boyunca muhafaza edilir. Ödeme bilgileriniz,
            doğrudan ödeme kuruluşu (örneğin iyzico) tarafından işlenir ve saklanır; şirketimiz
            tam kart numarası gibi hassas ödeme verilerini sistemlerinde saklamaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Haklarınız</h2>
          <p className="text-sm text-[var(--text-muted)]">
            KVKK uyarınca Şirketimize başvurarak aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--text-muted)] space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Şartları oluştuğunda silinmesini veya yok edilmesini isteme</li>
            <li>Düzeltme / silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>Otomatik sistemler ile analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">İletişim</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Gizlilik Politikası ve kişisel verilerinizle ilgili talepleriniz için bize
            e-posta yoluyla ulaşabilirsiniz.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            <strong>E-posta:</strong> destek@cvcraft.com
          </p>
        </section>
      </div>
    </div>
  );
}

