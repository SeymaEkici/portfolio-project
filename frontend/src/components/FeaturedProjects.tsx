'use client';

import { useEffect, useRef, type FocusEvent } from 'react';
import Image from 'next/image';
import { ArrowUpRight, GitBranch, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/project.service';
import { useLanguage } from '@/components/providers/LanguageProvider';

const CARD_W = 232; // px
const GAP = 16; // px
const STEP = CARD_W + GAP;
const INTERVAL_MS = 3500; // her adım arası
const SLIDE_MS = 700; // kayma süresi
const MIN_ITEMS = 14; // şerit geniş ekranda bile boş kalmasın diye klonlama eşiği

export default function FeaturedProjects() {
  const { t } = useLanguage();
  const { data: featuredProjects = [], isLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => getProjects(true),
  });

  const trackRef = useRef<HTMLUListElement>(null);
  const pauseRef = useRef({ hover: false, focus: false });
  const count = featuredProjects.length;

  // Hook'lar erken return'lerden önce olmalı
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let index = 0;

    const tick = () => {
      const { hover, focus } = pauseRef.current;
      if (hover || focus || document.hidden) return;
      index += 1;
      track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;
      track.style.transform = `translateX(${-index * STEP}px)`;
    };

    // Orijinal liste sonuna gelince animasyonsuz başa sar (klonlar sayesinde fark edilmez)
    const onEnd = (e: TransitionEvent) => {
      if (e.target !== track || index < count) return;
      index -= count;
      track.style.transition = 'none';
      track.style.transform = `translateX(${-index * STEP}px)`;
    };

    track.addEventListener('transitionend', onEnd);
    const id = window.setInterval(tick, INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      track.removeEventListener('transitionend', onEnd);
      track.style.transition = 'none';
      track.style.transform = '';
    };
  }, [count]);

  if (isLoading) {
    return <div role="status" className="border border-border p-8 font-mono text-xs text-muted-foreground">{t('featuredProjects.loading')}</div>;
  }

  const reps = count ? Math.ceil(MIN_ITEMS / count) + 1 : 0;
  const items = Array.from({ length: reps * count }, (_, i) => {
    const project = featuredProjects[i % count];
    return { project, clone: i >= count, key: `${project.id}-${Math.floor(i / count)}` };
  });

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pauseRef.current.focus = false;
  };

  return <>
    <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
      <h3 className="flex items-center gap-2 text-xs font-medium"><Layers size={14} className="text-muted-foreground" /> {t('featuredProjects.heading')}</h3>
      <span className="font-mono text-[10px] text-muted-foreground">{t('featuredProjects.entries', { count: String(count).padStart(2, '0') })}</span>
    </div>

    {count === 0 ? (
      <div className="border border-dashed border-border px-6 py-10 text-center"><p className="text-sm">{t('featuredProjects.emptyTitle')}</p><p className="mt-2 text-xs text-muted-foreground">{t('featuredProjects.emptyNote')}</p></div>
    ) : (
      // Şerit: container'dan taşıp ekranın tamamını kaplar (HeroRipple ile aynı teknik)
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t('featuredProjects.heading')}
        onPointerEnter={() => { pauseRef.current.hover = true; }}
        onPointerLeave={() => { pauseRef.current.hover = false; }}
        onFocusCapture={() => { pauseRef.current.focus = true; }}
        onBlurCapture={onBlur}
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-primary py-8 sm:py-10 motion-reduce:overflow-x-auto"
      >
        <ul
          ref={trackRef}
          className="ml-5 flex w-max sm:ml-8 motion-reduce:transform-none!"
          style={{ columnGap: GAP }}
        >
          {items.map(({ project, clone, key }) => (
            <li
              key={key}
              aria-hidden={clone || undefined}
              style={{ width: CARD_W }}
              className={`shrink-0 ${clone ? 'motion-reduce:hidden' : ''}`}
            >
              <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-colors hover:border-foreground/40">
                {project.imageUrl && (
                  <div className="aspect-[16/10] overflow-hidden border-b border-border bg-muted">
                    <Image src={project.imageUrl} alt={project.title} width={464} height={290} unoptimized className="size-full object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[10px] text-muted-foreground">/{project.slug}</span>
                    <div className="flex shrink-0 gap-1.5">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={clone ? -1 : undefined}
                          aria-label={t('featuredProjects.viewSource', { title: project.title })}
                          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <GitBranch size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={clone ? -1 : undefined}
                          aria-label={t('featuredProjects.viewLive', { title: project.title })}
                          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  <h4 className="line-clamp-1 text-sm font-medium tracking-tight">{project.title}</h4>
                  <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {project.technologies?.slice(0, 3).map(item => (
                      <span key={item.technology.id} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{item.technology.name}</span>
                    ))}
                    {(project.technologies?.length ?? 0) > 3 && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>;
}