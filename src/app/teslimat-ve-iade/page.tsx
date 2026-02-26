export default function TeslimatVeIadePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Teslimat ve İade Politikası</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Bu sayfa, <strong>İsmail Erduyan</strong> tarafından sunulan dijital CV oluşturma ve
          abonelik hizmetlerine ilişkin teslimat, iptal ve iade koşullarını açıklamaktadır.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Hizmetin Teslimatı</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Sunulan ürün ve hizmetler tamamen dijital niteliktedir. Ödeme işleminin başarıyla
            tamamlanmasının ardından, kullanıcı hesabına ilgili abonelik hakları tanımlanır ve
            kullanıcı hizmete derhal erişim sağlar. Fiziksel ürün gönderimi yapılmamaktadır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Abonelik İptali</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Kullanıcılar, aboneliklerini diledikleri zaman iptal edebilir. İptal işlemi,
            mevcut fatura dönemi sonuna kadar hizmetin kullanılmasına engel olmaz; dönem sonu
            itibarıyla abonelik yenilenmez ve yeni ücret tahsil edilmez.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">İade Koşulları</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Hizmet dijital içerik niteliğinde olduğundan, 6502 sayılı Tüketicinin Korunması
            Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında cayma hakkının istisnaları
            arasında yer alabilir. Bununla birlikte, Şirket, kullanıcı memnuniyetini gözeterek
            haklı ve makul durumlarda destek kanalları üzerinden yapılacak başvuruları inceleyip
            uygun gördüğü hallerde iade gerçekleştirebilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Teknik Sorunlar</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Ödeme işlemi başarılı olmasına rağmen hizmete erişimde teknik bir sorun yaşanırsa,
            kullanıcı destek kanalları üzerinden durumu bildirmelidir. Sorunun teyidi halinde,
            abonelik süresi uzatılabilir veya iade seçeneği değerlendirilebilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">İletişim</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Teslimat ve iade süreçlerine ilişkin her türlü soru ve talebiniz için:
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            <strong>E-posta:</strong> destek@cvcraft.com
          </p>
        </section>
      </div>
    </div>
  );
}

