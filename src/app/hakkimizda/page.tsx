export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Hakkımızda</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Bu web sitesi, <strong>İsmail Erduyan</strong> tarafından işletilen çevrimiçi bir CV
          oluşturma ve dijital abonelik platformudur. Kullanıcıların profesyonel özgeçmişlerini
          hızlı, modern ve yurt içi / yurt dışı başvurulara uygun formatlarda hazırlamalarını
          sağlamayı amaçlarız.
        </p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Misyonumuz</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Misyonumuz, iş arayanların ve kariyerinde ilerlemek isteyen profesyonellerin,
            teknik bilgiye ihtiyaç duymadan profesyonel CV&apos;ler oluşturabilmesini sağlamak
            ve başvuru süreçlerinde onlara zaman kazandırmaktır.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Vizyonumuz</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Vizyonumuz, Türkiye&apos;de ve global ölçekte en çok tercih edilen CV oluşturma
            araçlarından biri olmak ve kullanıcılarımıza kariyer yolculuklarında güvenilir bir
            dijital asistan sunmaktır.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Şirket Bilgileri</h2>
          <div className="text-sm text-[var(--text-muted)] space-y-1">
            <p><strong>Şirket Adı:</strong> İsmail Erduyan</p>
            <p><strong>Vergi Numarası:</strong> 3520203173</p>
            <p><strong>Hizmet Türü:</strong> Dijital içerik ve abonelik hizmetleri (CV oluşturma aracı)</p>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">İletişim</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Ürün ve hizmetlerimize ilişkin her türlü soru, öneri ve talepleriniz için bizimle
            iletişime geçebilirsiniz.
          </p>
          <div className="text-sm text-[var(--text-muted)] space-y-1">
            <p><strong>E-posta:</strong> destek@cvcraft.com</p>
            <p><strong>İletişim Formu:</strong> Uygulama içerisindeki destek kanalları üzerinden bize ulaşabilirsiniz.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

