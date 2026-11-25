'use client';

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent } from 'react';
import Image from 'next/image';
import { ArrowUpRight, GitBranch, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/project.service';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { buttonVariants } from '@/components/ui/button';
import type { Project } from '@/types';

const CARD_W = 208; // px
const CARD_H = 232; // px
const GAP = 16; // px
const STEP = CARD_W + GAP;
const INTERVAL_MS = 3500; // her adım arası
const SLIDE_MS = 700; // kayma süresi
const MIN_ITEMS = 18; // şerit 4K ekranda bile boş kalmasın diye klonlama eşiği

const faceClass = 'absolute inset-0 flex flex-col overflow-hidden rounded-[20px] border border-border bg-card';
const overlayBtn = 'absolute inset-0 cursor-pointer rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-ring';

function ProjectCard({ project, clone, flipped, onToggle }: {
  project: Project;
  clone: boolean;
  flipped: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  const techs = project.technologies ?? [];
  const hasBack = Boolean(project.githubUrl || project.liveUrl || techs.length);
  const tab = clone ? -1 : undefined; // klonlar klavye sırasına girmez

  // Yüzlerden biri `inert` olunca odak kaybolur; klavye kullanıcısı için odağı yeni yüze taşı
  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (flipped ? backRef : frontRef).current?.focus();
  }, [flipped]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    restoreFocus.current = e.currentTarget.matches(':focus-visible');
    onToggle();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && flipped) {
      restoreFocus.current = true;
      onToggle();
    }
  };

  return (
    <div style={{ height: CARD_H, perspective: 900 }} onKeyDown={handleKeyDown}>
      <div
        className="relative size-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* ÖN YÜZ: görsel, ad, kısa açıklama */}
        <div
          inert={flipped}
          className={`${faceClass} transition-colors hover:border-foreground/40`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="aspect-[16/10] shrink-0 overflow-hidden border-b border-border bg-muted">
            {project.imageUrl ? (
              <Image src={project.imageUrl} alt={project.title} width={416} height={260} unoptimized className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground"><Layers size={20} /></div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3.5">
            <h4 className="line-clamp-1 text-sm font-medium tracking-tight">{project.title}</h4>
            <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{project.description}</p>
          </div>
          {hasBack && (
            <button
              ref={frontRef}
              type="button"
              onClick={handleClick}
              tabIndex={tab}
              aria-expanded={flipped}
              aria-label={t('featuredProjects.flipToDetails', { title: project.title })}
              className={overlayBtn}
            />
          )}
        </div>

        {/* ARKA YÜZ: GitHub, canlı link, teknolojiler */}
        <div
          inert={!flipped}
          className={faceClass}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <button
            ref={backRef}
            type="button"
            onClick={handleClick}
            tabIndex={tab}
            aria-label={t('featuredProjects.flipBack')}
            className={overlayBtn}
          />
          {/* Boş alana tıklayınca kart geri döner; yalnızca linkler tıklamayı yakalar */}
          <div className="pointer-events-none relative flex flex-1 flex-col gap-3 overflow-hidden p-4">
            {(project.githubUrl || project.liveUrl) && (
              <div className="pointer-events-auto flex flex-col gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={tab}
                    aria-label={t('featuredProjects.viewSource', { title: project.title })}
                    className={`${buttonVariants({ variant: 'outline', size: 'sm' })} w-full`}
                  >
                    <GitBranch /> GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={tab}
                    aria-label={t('featuredProjects.viewLive', { title: project.title })}
                    className={`${buttonVariants({ variant: 'default', size: 'sm' })} w-full`}
                  >
                    <ArrowUpRight /> {t('featuredProjects.liveLabel')}
                  </a>
                )}
              </div>
            )}
            {techs.length > 0 && (
              <ul className="flex flex-wrap content-start gap-1.5">
                {techs.map(item => (
                  <li key={item.technology.id} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    {item.technology.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const { t } = useLanguage();
  const { data: featuredProjects = [], isLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => getProjects(true),
  });

  const trackRef = useRef<HTMLUListElement>(null);
  const pauseRef = useRef({ hover: false, focus: false, flipped: false });
  const [flippedKey, setFlippedKey] = useState<string | null>(null);
  const count = featuredProjects.length;

  const setFlipped = (key: string | null) => {
    pauseRef.current.flipped = key !== null;
    setFlippedKey(key);
  };

  // Hook'lar erken return'lerden önce olmalı
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let index = 0;

    const tick = () => {
      const { hover, focus, flipped } = pauseRef.current;
      if (hover || focus || flipped || document.hidden) return;
      index += 1;
      track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;
      track.style.transform = `translateX(${-index * STEP}px)`;
    };

    // Orijinal liste sonuna gelince animasyonsuz başa sar (klonlar sayesinde fark edilmez).
    // e.target kontrolü: kart flip animasyonlarının transitionend'i buraya kabarcıklanır, onları yok say.
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

  if (count === 0) {
    return (
      <div className="border border-dashed border-border px-6 py-10 text-center">
        <p className="text-sm">{t('featuredProjects.emptyTitle')}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t('featuredProjects.emptyNote')}</p>
      </div>
    );
  }

  const reps = Math.ceil(MIN_ITEMS / count) + 1;
  const items = Array.from({ length: reps * count }, (_, i) => {
    const project = featuredProjects[i % count];
    return { project, clone: i >= count, key: `${project.id}-${Math.floor(i / count)}` };
  });

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pauseRef.current.focus = false;
  };

  return (
    // Şerit: container'dan taşıp ekranın tamamını kaplar (HeroRipple ile aynı teknik)
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t('featuredProjects.heading')}
      onPointerEnter={() => { pauseRef.current.hover = true; }}
      onPointerLeave={e => {
        pauseRef.current.hover = false;
        if (e.pointerType === 'mouse') setFlipped(null); // fare çıkınca kart geri döner
      }}
      onFocusCapture={e => {
        // Yalnızca klavye odağı duraklatsın; fare tıklamasından kalan odak şeridi kilitlemesin
        if ((e.target as HTMLElement).matches(':focus-visible')) pauseRef.current.focus = true;
      }}
      onBlurCapture={onBlur}
      className="relative isolate left-1/2 w-screen -translate-x-1/2 overflow-hidden py-8 sm:py-10"
    >
      {/* Cam efektinin bulanıklaştıracağı keskin kenarlı renk lekeleri */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-8 left-[6%] size-56 rounded-full bg-primary" />
        <span className="absolute -bottom-12 left-[38%] size-64 rounded-full bg-[color-mix(in_oklch,var(--primary),var(--foreground)_18%)]" />
        <span className="absolute -top-6 right-[8%] size-52 rounded-full bg-primary" />
      </div>
      {/* Cam katmanı: kartlardan ayrı, statik. Kayan kartlar blur'u yeniden hesaplatmaz */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 border-y border-primary/60 bg-primary/25 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.45)] backdrop-blur-xl dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)]"
      />

      <div className="overflow-hidden motion-reduce:overflow-x-auto">
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
              <ProjectCard
                project={project}
                clone={clone}
                flipped={flippedKey === key}
                onToggle={() => setFlipped(flippedKey === key ? null : key)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}