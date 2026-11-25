'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

// Points sit at the CENTER of each grid column (matching how the dots are
// positioned with `left: 50%` inside an n-column grid), not spread edge to
// edge across the full width. Those two spacings only coincide at the
// midpoint for odd n, which is why only the middle node used to touch the
// line.
function buildWavePoints(n: number) {
  const colWidth = VIEWBOX_WIDTH / n;
  return Array.from({ length: n }, (_, i) => ({
    x: (i + 0.5) * colWidth,
    y: BAND_HEIGHT / 2 + (i % 2 === 0 ? -AMPLITUDE / 2 : AMPLITUDE / 2),
  }));
}

function pathThrough(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// A dot styled as a ring with a small filled center (image-2 reference).
// The current node inverts the two layers instead of switching to an
// accent color, so it stays inside the existing ink-on-cream palette
// rather than adding a third place that uses primary/burst.
function TimelineDot({ current, size = 'size-4' }: { current?: boolean; size?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex ${current ? 'size-5' : size} items-center justify-center rounded-full border-2 ${
        current ? 'border-foreground bg-foreground' : 'border-foreground/70 bg-background'
      }`}
    >
      <span className={`size-1.5 rounded-full ${current ? 'bg-background' : 'bg-foreground'}`} />
    </span>
  );
}

export default function CareerTimeline() {
  const { lang, t } = useLanguage();
  const items = ITEMS[lang];

  const points = useMemo(() => buildWavePoints(items.length), [items.length]);
  const staticD = useMemo(() => pathThrough(points), [points]);
  // Flow line travels oldest -> current: reverse the points so the path's
  // start (dashoffset = pathLength) is the oldest node and its end
  // (dashoffset = 0) lands exactly on the current node.
  const flowD = useMemo(() => pathThrough([...points].reverse()), [points]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setInView(true);
      return;
    }
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="career-timeline-heading" className="py-6">
      <h2 id="career-timeline-heading" className="mb-8 text-balance text-2xl font-medium tracking-tight sm:text-3xl">
        {t('careerTimeline.heading')}
      </h2>

      {/* Wide viewports: squiggly horizontal wave */}
      <div className="hidden lg:block">
        <div className="relative" style={{ height: BAND_HEIGHT }}>
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${BAND_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {/* Base line: always-visible dashed path */}
            <path
              d={staticD}
              fill="none"
              className="stroke-border"
              strokeWidth={2}
              strokeDasharray="6 8"
            />
            {/* Flow line: solid, thicker, draws on once the section scrolls
                into view. `pathLength={1}` normalizes the dash units to 1
                regardless of the path's real geometric length, so no
                getTotalLength() measurement/ref is needed and there's no
                flash of a solid line before JS runs — it's hidden by
                default via dashoffset=1. */}
            <path
              d={flowD}
              fill="none"
              pathLength={1}
              className="stroke-foreground transition-[stroke-dashoffset] duration-[1400ms] ease-out"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={inView ? 0 : 1}
            />
          </svg>
          <ol className="relative grid h-full" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {items.map((item, i) => (
              <li key={item.title} className="relative">
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '50%', top: `${(points[i].y / BAND_HEIGHT) * 100}%` }}
                >
                  <TimelineDot current={item.current} />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ol className="grid gap-6" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map(item => (
            <li key={item.title} className="px-2" aria-current={item.current ? 'step' : undefined}>
              {item.current && (
                <span className="mb-2 inline-block rounded-full bg-foreground px-2.5 py-0.5 text-[11px] text-background">
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

      {/* Narrower viewports: vertical fallback. No draw-on animation here —
          the ask was specifically about the horizontal wave; a vertical
          list re-triggering its own scroll animation is a separate
          decision, not bundled in silently. */}
      <ol className="space-y-6 border-l border-border pl-6 lg:hidden">
        {items.map(item => (
          <li key={item.title} className="relative pl-2" aria-current={item.current ? 'step' : undefined}>
            <div className="absolute -left-[33px] top-0">
              <TimelineDot current={item.current} size="size-3.5" />
            </div>
            {item.current && (
              <span className="mb-1 inline-block rounded-full bg-foreground px-2.5 py-0.5 text-[11px] text-background">
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