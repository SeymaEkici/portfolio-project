'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TimelineItem {
  period: string;
  title: string;
  org: string;
  description: string;
  current?: boolean;
}

// NOTE: hardcoded here rather than in translations.ts to keep this drop-in.
// Move into translations.ts under a `careerTimeline.items` key if you want
// it to live alongside the rest of the site's bilingual copy.
const ITEMS: Record<'tr' | 'en', TimelineItem[]> = {
  tr: [
    {
      period: '2026 — Devam ediyor',
      title: 'Freelance Yazılımcı',
      org: 'Serbest çalışma',
      description: 'Web geliştirici olarak freelance projeler üzerinde çalışıyorum.',
      current: true,
    },
    {
      period: 'Temmuz 2025',
      title: 'Bilgisayar Mühendisliği Mezuniyeti',
      org: 'Ostim Teknik Üniversitesi',
      description: 'Lisans eğitimimi tamamladım.',
    },
    {
      period: '2025',
      title: 'Uzun Dönem Stajyer — Masaüstü ve Web Geliştirici',
      org: 'Bilgi Teknolojileri ve İletişim Kurumu (BTK)',
      description: 'Masaüstü uygulamalar ve web geliştirme üzerine uzun dönem stajımı tamamladım.',
    },
    {
      period: '2024',
      title: 'Masaüstü Uygulama Geliştirici Stajyeri',
      org: 'DGH R&D Yazılım Geliştirme ve Danışmanlık',
      description: 'MVC mimarisiyle masaüstü uygulama geliştirme stajı yaptım.',
    },
    {
      period: '2023',
      title: 'Backend Geliştirici Stajyeri',
      org: 'İnnova Bilişim Çözümleri',
      description: 'Ürün geliştirme takımında backend geliştirici olarak staj yaptım.',
    },
  ],
  en: [
    {
      period: '2026 — Present',
      title: 'Freelance Developer',
      org: 'Self-employed',
      description: 'Working on freelance web development projects.',
      current: true,
    },
    {
      period: 'July 2025',
      title: 'B.Sc. in Computer Engineering',
      org: 'Ostim Technical University',
      description: 'Completed my undergraduate degree.',
    },
    {
      period: '2025',
      title: 'Long-Term Intern — Desktop & Web Developer',
      org: 'Information and Communication Technologies Authority (BTK)',
      description: 'Completed a long-term internship building desktop applications and web software.',
    },
    {
      period: '2024',
      title: 'Desktop Application Developer Intern',
      org: 'DGH R&D Software Development & Consulting',
      description: 'Interned building desktop applications with an MVC architecture.',
    },
    {
      period: '2023',
      title: 'Backend Developer Intern',
      org: 'İnnova Bilişim Çözümleri',
      description: 'Interned as a backend developer on the product engineering team.',
    },
  ],
};

const VIEWBOX_WIDTH = 1000;
const BAND_HEIGHT = 120;
const AMPLITUDE = 44;

function buildWavePath(n: number) {
  const step = VIEWBOX_WIDTH / (n - 1);
  const points = Array.from({ length: n }, (_, i) => ({
    x: i * step,
    y: BAND_HEIGHT / 2 + (i % 2 === 0 ? -AMPLITUDE / 2 : AMPLITUDE / 2),
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return { d, points };
}

export default function CareerTimeline() {
  const { lang, t } = useLanguage();
  const items = ITEMS[lang];
  const { d, points } = useMemo(() => buildWavePath(items.length), [items.length]);

  return (
    <section aria-labelledby="career-timeline-heading" className="py-6">
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <h2 id="career-timeline-heading" className="text-balance text-2xl font-medium tracking-tight sm:text-3xl">
          {t('careerTimeline.heading')}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">{t('careerTimeline.note')}</p>
      </div>

      {/* Wide viewports: squiggly horizontal wave */}
      <div className="hidden lg:block">
        <div className="relative" style={{ height: BAND_HEIGHT }}>
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${BAND_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            <path d={d} fill="none" className="stroke-border" strokeWidth={2} />
          </svg>
          <ol className="relative grid h-full" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {items.map((item, i) => (
              <li key={item.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground"
                  style={{ left: '50%', top: `${(points[i].y / BAND_HEIGHT) * 100}%` }}
                />
              </li>
            ))}
          </ol>
        </div>

        <ol className="grid gap-6" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map(item => (
            <li key={item.title} className="px-2" aria-current={item.current ? 'step' : undefined}>
              {item.current && (
                <span className="mb-2 inline-block rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[11px] text-foreground">
                  {t('careerTimeline.current')}
                </span>
              )}
              <p className="text-xs text-muted-foreground">{item.period}</p>
              <h3 className="mt-2 text-sm font-medium leading-5">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{item.org}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Narrower viewports: vertical fallback — a horizontal wave with 5
          text-heavy columns does not hold up below ~1024px */}
      <ol className="space-y-6 border-l border-border pl-6 lg:hidden">
        {items.map(item => (
          <li key={item.title} className="relative" aria-current={item.current ? 'step' : undefined}>
            <span
              aria-hidden="true"
              className="absolute -left-[29px] top-1 size-3 rounded-full border-2 border-background bg-foreground"
            />
            {item.current && (
              <span className="mb-1 inline-block rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[11px] text-foreground">
                {t('careerTimeline.current')}
              </span>
            )}
            <p className="text-xs text-muted-foreground">{item.period}</p>
            <h3 className="mt-1 text-sm font-medium leading-5">{item.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{item.org}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}