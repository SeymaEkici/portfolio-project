import { Suspense } from 'react';
import { ArrowUpRight, Mail, Cpu } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import FeaturedProjects from '@/components/FeaturedProjects';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24">

      {/* 1. HERO SECTION */}
      <section className="space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Status: Operational & Ready
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100">
            Full-Stack Geliştirici & Mühendislik Disiplini.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Görsel olarak şık olmanın ötesinde; temiz mimari, tip güvenliği (type-safety) ve ölçeklenebilir altyapılarla gerçek dünya problemleri çözen sistemler inşa ediyorum.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            Projeleri İncele
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="mailto:iletisim@portfolio.dev"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-800 transition-colors"
          >
            <Mail className="w-4 h-4 text-zinc-400" />
            İletişime Geç
          </a>
        </div>
      </section>

      {/* 2. STATS / QUICK INFO BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 font-mono text-sm">
        <div>
          <div className="text-zinc-500 text-xs">DENEYİM</div>
          <div className="text-zinc-100 font-semibold mt-1">1+ Yıl (Junior/Mid)</div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs">ODAK ALANI</div>
          <div className="text-zinc-100 font-semibold mt-1">Node & Next.js</div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs">MİMARİ</div>
          <div className="text-zinc-100 font-semibold mt-1">Clean / Layered</div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs">KONUM</div>
          <div className="text-zinc-100 font-semibold mt-1">Türkiye / Remote</div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS SECTION */}
      <section id="projects" className="space-y-8">
        <Suspense
          fallback={
            <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500 font-mono text-sm animate-pulse">
              Projeler yükleniyor...
            </div>
          }
        >
          <FeaturedProjects />
        </Suspense>
      </section>

      {/* 4. DIGITAL GARDEN / NOW SECTION */}
      <section className="p-8 rounded-2xl bg-linear-to-br from-zinc-900/80 to-zinc-900/30 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          Digital Garden / Şimdi Ne Yapıyorum?
        </div>
        <h3 className="text-xl font-semibold text-zinc-100">Sürekli Öğrenme & Geliştirme Döngüsü</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Şu aralar ileri düzey TypeScript pattern&apos;leri, PostgreSQL performans optimizasyonları ve CI/CD pipeline yapıları üzerine çalışıyorum. Bu portfolyo projesi de bu sürecin canlı bir ürünüdür.
        </p>
      </section>

      {/* 5. CONTACT FORM SECTION */}
      <ContactForm />

    </div>
  );
}