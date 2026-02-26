export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-sm text-[var(--text-muted)]">
          İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), 6502 sayılı Tüketicinin
          Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca elektronik ortamda
          kurulmuştur.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Taraflar</h2>
          <p className="text-sm text-[var(--text-muted)]">
            <strong>Satıcı:</strong> İsmail Erduyan
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            <strong>Vergi Numarası:</strong> 3520203173
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            <strong>Alıcı (Tüketici):</strong> Hizmete üye olan ve ödeme yapan gerçek kişi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Konu</h2>
          <p className="text-sm text-[var(--text-muted)]">
            İşbu Sözleşme&apos;nin konusu, Alıcı&apos;nın Satıcı&apos;ya ait internet sitesi
            üzerinden elektronik ortamda satın aldığı dijital abonelik ve CV oluşturma hizmetinin
            sunulmasına ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. Ürün ve Hizmetin Temel Nitelikleri</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Satın alınan ürün; fiziksel teslimatı olmayan, tamamen dijital nitelikte bir CV
            oluşturma ve saklama hizmeti ile buna ilişkin abonelik haklarından oluşmaktadır.
            Hizmetin kapsamı, süreleri ve özellikleri sitede yayımlanan paket detaylarında
            belirtilmiştir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Ücret ve Ödeme</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Hizmete ilişkin ücretler, vergiler dâhil olarak ödeme sayfasında gösterilir.
            Ödemeler, yetkili ödeme kuruluşları (örneğin iyzico) aracılığıyla tahsil edilir.
            Kart bilgileriniz Satıcı tarafından değil, ilgili ödeme kuruluşu tarafından işlenir
            ve saklanır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Teslimat ve İfa</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Ödeme işleminin başarılı tamamlanmasıyla birlikte, hizmete erişim hakkı Alıcı&apos;nın
            kullanıcı hesabına otomatik olarak tanımlanır. Dijital hizmet, çevrimiçi olarak ifa
            edilir; fiziki teslimat söz konusu değildir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Cayma Hakkı</h2>
          <p className="text-sm text-[var(--text-muted)]">
            6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, dijital içerik
            hizmetlerinde cayma hakkı, hizmetin ifasına başlanmamış olmak kaydıyla kullanılabilir.
            Hizmete derhal erişim sağlanan ve ifasına başlanan aboneliklerde, mevzuattaki istisnalar
            çerçevesinde cayma hakkı sınırlandırılabilir. Bununla birlikte, Satıcı kullanıcı
            memnuniyetini gözeterek başvuruları ayrıca değerlendirebilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Sözleşmenin Feshi</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Alıcı, aboneliğini dilediği zaman iptal edebilir. İptal halinde, yürürlükteki dönem
            sonuna kadar hizmetten yararlanılmaya devam edilir; dönem bitiminde yenileme yapılmaz.
            Satıcı, kullanım şartlarının ihlali halinde hizmeti sona erdirme hakkını saklı tutar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">8. Uyuşmazlıkların Çözümü</h2>
          <p className="text-sm text-[var(--text-muted)]">
            İşbu Sözleşme&apos;den doğabilecek uyuşmazlıklarda, Tüketici Hakem Heyetleri ve
            Tüketici Mahkemeleri yetkilidir. Yetki ve sınırlar, Ticaret Bakanlığı tarafından
            her yıl ilan edilen parasal değerlere göre belirlenir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">9. Yürürlük</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Alıcı&apos;nın elektronik ortamda Sözleşme&apos;yi onaylaması ve ödeme işlemini
            tamamlamasıyla, işbu Sözleşme yürürlüğe girer.
          </p>
        </section>
      </div>
    </div>
  );
}

