"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "./landing.css";

const NAV_LINKS = [
  { href: "#ozellikler", label: "Özellikler" },
  { href: "#fiyatlar", label: "Fiyatlar" },
  { href: "#hakkimizda", label: "Hakkımızda" },
];

const STATS = [
  { icon: "📄", label: "5 Profesyonel Şablon" },
  { icon: "⚡", label: "Dakikalar İçinde Hazır" },
  { icon: "🚀", label: "Ücretsiz Başla" },
];

const FEATURES = [
  { title: "Yapay Zeka Destekli", desc: "AI ile profesyonel özet ve metin önerileri.", icon: "✨" },
  { title: "5 Profesyonel Şablon", desc: "Sektöre uygun şablonlarla hızlı başlayın.", icon: "📄" },
  { title: "PDF İndirme", desc: "Tek tıkla PDF olarak indirin veya paylaşın.", icon: "📥" },
  { title: "Tek Tıkla Paylaşım", desc: "Link ile CV'nizi anında paylaşın.", icon: "🔗" },
];

const TEMPLATES = [
  { name: "Klasik", desc: "Sade ve okunabilir" },
  { name: "Modern", desc: "Minimal ve şık" },
  { name: "Yaratıcı", desc: "Portfolyo odaklı" },
  { name: "Kurumsal", desc: "Kurumsal başvurular" },
];

const PRICING = [
  { name: "Ücretsiz", price: "0", period: "ay", features: ["2 CV/gün", "1 şablon", "PDF (watermark)"], cta: "Başla", href: "/register", popular: false },
  { name: "Pro", price: "99", period: "ay", features: ["Sınırsız CV", "5 şablon", "PDF watermark yok", "Öncelikli destek"], cta: "Pro'ya geç", href: "/fiyatlandirma", popular: true },
  { name: "Premium", price: "199", period: "ay", features: ["Pro özellikleri", "10 şablon", "Özel link", "PDF arşivi"], cta: "Premium", href: "/fiyatlandirma", popular: false },
];

const TESTIMONIALS = [
  { name: "Ayşe K.", role: "Yazılım Geliştirici", stars: 5, text: "CVcraft ile ilk CV'mi 15 dakikada hazırladım. Mülakata çağrıldım!" },
  { name: "Mehmet Y.", role: "Pazarlama Uzmanı", stars: 5, text: "Şablonlar çok profesyonel. PDF indirme ve paylaşım süper kolay." },
  { name: "Zeynep A.", role: "Öğrenci", stars: 5, text: "Staj başvurularım için ideal. Ücretsiz plan bile yeterli." },
];

function useScrollAnimation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useScrollAnimation();
  const statsRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const templatesRef = useScrollAnimation();
  const pricingRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();

  return (
    <div className="landing landing-bg min-h-screen text-[var(--lp-text)]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0f0f1a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="landing-gradient-text font-bold text-xl tracking-tight">
            CVcraft
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="text-sm text-[var(--lp-muted)] hover:text-white transition">
                {label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/5 transition"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium landing-btn-gradient transition"
            >
              Ücretsiz Başla
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Menü"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="text-[var(--lp-muted)] hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                {label}
              </a>
            ))}
            <Link href="/login" className="text-sm border border-white/20 rounded-lg py-2 text-center" onClick={() => setMobileMenuOpen(false)}>
              Giriş Yap
            </Link>
            <Link href="/register" className="text-sm landing-btn-gradient rounded-lg py-2 text-center" onClick={() => setMobileMenuOpen(false)}>
              Ücretsiz Başla
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section ref={heroRef.ref} className="pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 via-transparent to-[#06b6d4]/20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#6366f1]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#06b6d4]/20 rounded-full blur-3xl pointer-events-none" />
        <motion.div
          className="max-w-6xl mx-auto relative grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={heroRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Hayalinizdeki İşe{" "}
              <span className="landing-gradient-text">CVcraft ile Ulaşın</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--lp-muted)] max-w-xl">
              Yapay zeka destekli CV oluşturucu ile dakikalar içinde profesyonel CV hazırlayın.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/olustur"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold landing-btn-gradient shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/40 transition"
              >
                Ücretsiz CV Oluştur
              </Link>
              <Link
                href="#ozellikler"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold border border-white/20 text-white hover:bg-white/5 transition"
              >
                Örnekleri Gör
              </Link>
            </div>
          </div>
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroRef.inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Arka plan blur shape'ler */}
            <div className="pointer-events-none absolute -top-10 -right-8 w-40 h-40 bg-gradient-to-br from-indigo-500/40 to-cyan-400/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 w-48 h-48 bg-gradient-to-tr from-purple-500/35 to-pink-500/35 blur-3xl" />

            <div className="relative cv-tilt">
              <div className="cv-tilt-inner aspect-[3/4] max-w-sm mx-auto rounded-2xl bg-white/95 shadow-2xl shadow-indigo-950/40 border border-slate-100/80 overflow-hidden flex flex-col">
                {/* Header bar */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-4 py-3 text-white flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] tracking-wide uppercase opacity-80">Özgeçmiş</p>
                    <h3 className="text-lg font-semibold leading-tight">Dilek Doğan</h3>
                    <p className="text-[11px] opacity-90">Senior Software Engineer</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>📱</span>
                      <span>📍</span>
                      <span>🔗</span>
                    </div>
                    <p className="text-[10px] opacity-90">dilek.dogan@example.com</p>
                  </div>
                </div>

                {/* İçerik */}
                <div className="flex flex-1 text-[10px] leading-snug text-slate-800">
                  {/* Sol sidebar */}
                  <div className="w-2/5 max-w-[40%] bg-slate-900 text-slate-100 px-3 py-3 flex flex-col gap-3">
                    <div>
                      <h4 className="text-[9px] font-semibold uppercase tracking-wide text-cyan-300 border-b border-cyan-400/40 pb-0.5">
                        İletişim
                      </h4>
                      <p className="mt-1">📧 dilek.dogan@example.com</p>
                      <p>📱 0532 XXX XX XX</p>
                      <p>📍 İstanbul</p>
                      <p>🔗 linkedin.com/in/dilekdogan</p>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-semibold uppercase tracking-wide text-cyan-300 border-b border-cyan-400/40 pb-0.5">
                        Beceriler
                      </h4>
                      <div className="mt-1 space-y-1.5">
                        <div>
                          <div className="flex justify-between text-[9px]">
                            <span>TypeScript</span>
                            <span>90%</span>
                          </div>
                          <div className="mt-0.5 h-1 rounded-full bg-slate-700 overflow-hidden">
                            <div className="h-full w-[90%] bg-gradient-to-r from-cyan-400 to-indigo-400" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px]">
                            <span>React</span>
                            <span>85%</span>
                          </div>
                          <div className="mt-0.5 h-1 rounded-full bg-slate-700 overflow-hidden">
                            <div className="h-full w-[85%] bg-gradient-to-r from-cyan-400 to-indigo-400" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px]">
                            <span>Node.js</span>
                            <span>80%</span>
                          </div>
                          <div className="mt-0.5 h-1 rounded-full bg-slate-700 overflow-hidden">
                            <div className="h-full w-[80%] bg-gradient-to-r from-cyan-400 to-indigo-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-semibold uppercase tracking-wide text-cyan-300 border-b border-cyan-400/40 pb-0.5">
                        Diller
                      </h4>
                      <p className="mt-1">Türkçe · Ana dil</p>
                      <p>İngilizce · C1</p>
                      <p>Almanca · B1</p>
                    </div>
                  </div>

                  {/* Sağ içerik */}
                  <div className="flex-1 bg-white px-4 py-3 flex flex-col gap-3">
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 border-b border-indigo-200 pb-0.5">
                        İş Deneyimi
                      </h4>
                      <div className="mt-1 space-y-2">
                        <div className="relative pl-4 border-l border-slate-200">
                          <span className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <p className="text-[10px] font-semibold text-slate-900">
                            Senior Software Engineer · CVcraft
                          </p>
                          <p className="text-[9px] text-slate-500">2022 – Günümüz · İstanbul (Remote)</p>
                          <p className="text-[9px] text-slate-600">
                            Yüksek trafikli web uygulamaları, performans optimizasyonu ve ekip liderliği.
                          </p>
                        </div>
                        <div className="relative pl-4 border-l border-slate-200">
                          <span className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <p className="text-[10px] font-semibold text-slate-900">
                            Software Engineer · Tech A.Ş.
                          </p>
                          <p className="text-[9px] text-slate-500">2019 – 2022 · İstanbul</p>
                          <p className="text-[9px] text-slate-600">
                            Mikroservis mimarisi, API tasarımı ve bulut tabanlı çözümler.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 border-b border-indigo-200 pb-0.5">
                        Eğitim
                      </h4>
                      <p className="mt-1 text-[10px] font-semibold text-slate-900">
                        Mekatronik Mühendisliği · XYZ Üniversitesi
                      </p>
                      <p className="text-[9px] text-slate-500">2014 – 2018 · 3.4 GPA</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-[var(--lp-muted)] text-center">Örnek CV çıktısı</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS / ÖNE ÇIKAN FAYDALAR */}
      <section ref={statsRef.ref} className="py-16 px-4 sm:px-6 border-y border-white/5">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={statsRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          {STATS.map(({ icon, label }) => (
            <div key={label} className="text-center flex flex-col items-center">
              <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
              <div className="text-sm font-semibold text-white">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ÖZELLİKLER */}
      <section id="ozellikler" ref={featuresRef.ref} className="py-24 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Özellikler</h2>
          <p className="text-center text-[var(--lp-muted)] max-w-2xl mx-auto mb-16">
            CVcraft ile CV sürecinizi hızlandırın.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ title, desc, icon }, i) => (
              <motion.div
                key={title}
                className="landing-card rounded-2xl border border-white/10 p-6 hover:border-[#6366f1]/40 transition"
                initial={{ opacity: 0, y: 16 }}
                animate={featuresRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-2xl">{icon}</span>
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-[var(--lp-muted)]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ŞABLON GALERİSİ */}
      <section ref={templatesRef.ref} className="py-24 px-4 sm:px-6 bg-white/[0.02]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={templatesRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Şablon Galerisi</h2>
          <p className="text-center text-[var(--lp-muted)] mb-16">Profesyonel şablonlarla fark yaratın.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map(({ name, desc }, i) => (
              <motion.div
                key={name}
                className="landing-card rounded-2xl border border-white/10 overflow-hidden hover:border-[#06b6d4]/40 transition"
                initial={{ opacity: 0, y: 16 }}
                animate={templatesRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-[3/4] bg-white/5 flex items-center justify-center text-[var(--lp-muted)] text-sm">
                  Şablon
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-[var(--lp-muted)]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FİYATLANDIRMA */}
      <section id="fiyatlar" ref={pricingRef.ref} className="py-24 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={pricingRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Fiyatlandırma</h2>
          <p className="text-center text-[var(--lp-muted)] mb-16">İhtiyacınıza uygun planı seçin.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.popular ? "landing-card border-[#6366f1]/50 shadow-lg shadow-[#6366f1]/20" : "landing-card border-white/10"
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={pricingRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium landing-btn-gradient">
                    Popüler
                  </span>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">₺{plan.price}</span>
                  <span className="text-[var(--lp-muted)]">/{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-[var(--lp-muted)] flex items-center gap-2">
                      <span className="text-[#06b6d4]">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-6 block text-center py-3 rounded-xl font-medium transition ${
                    plan.popular ? "landing-btn-gradient" : "border border-white/20 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* KULLANICI YORUMLARI */}
      <section ref={testimonialsRef.ref} className="py-24 px-4 sm:px-6 bg-white/[0.02]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Kullanıcı Yorumları</h2>
          <p className="text-center text-[var(--lp-muted)] mb-16">Kullanıcılarımız CVcraft deneyimlerini şöyle anlatıyor.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="landing-card rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={testimonialsRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 text-amber-400 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="text-[var(--lp-muted)] text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-medium text-white">{t.name}</div>
                  <div className="text-xs text-[var(--lp-muted)]">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section id="hakkimizda" className="py-24 px-4 sm:px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Hemen <span className="landing-gradient-text">ücretsiz</span> başlayın
          </h2>
          <p className="text-[var(--lp-muted)] mb-8">
            Hesap oluşturmak bir dakikanızı alır. Kredi kartı gerekmez.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl text-base font-semibold landing-btn-gradient shadow-lg shadow-[#6366f1]/30"
          >
            Ücretsiz Kayıt Ol
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="landing-gradient-text font-bold text-xl">
            CVcraft
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--lp-muted)]">
            <Link href="#ozellikler" className="hover:text-white transition">Özellikler</Link>
            <Link href="#fiyatlar" className="hover:text-white transition">Fiyatlar</Link>
            <Link href="/fiyatlandirma" className="hover:text-white transition">Fiyatlandırma</Link>
            <Link href="/login" className="hover:text-white transition">Giriş</Link>
            <Link href="/register" className="hover:text-white transition">Kayıt</Link>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-[var(--lp-muted)] hover:text-white transition" aria-label="Twitter">𝕏</a>
            <a href="#" className="text-[var(--lp-muted)] hover:text-white transition" aria-label="LinkedIn">in</a>
            <a href="#" className="text-[var(--lp-muted)] hover:text-white transition" aria-label="Instagram">📷</a>
          </div>
        </div>
        <p className="max-w-6xl mx-auto mt-8 text-center text-xs text-[var(--lp-muted)]">
          © {new Date().getFullYear()} CVcraft. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
}
