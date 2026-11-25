'use client';

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
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
const INTERVAL_MS = 3500; // otomatik adım aralığı
const TAU_MS = 140; // süzülme sabiti: büyüdükçe hareket daha yumuşak/yavaş oturur
const MIN_ITEMS = 18; // şerit geniş (4K) ekranda bile boş kalmasın diye klonlama eşiği
const DRAG_THRESHOLD = 5; // px: bundan az hareket tıklama sayılır
const FLING_MS = 300; // bırakma hızı x bu süre = süzülme mesafesi
const MAX_FLING = 900; // px
const FOCUS_PAD = 24; // px: klavye odağı kartı ekrana taşırken soldan boşluk
const WHEEL_CAPTURES_VERTICAL = true; // false: yalnızca yatay tekerlek/trackpad şeridi çevirir

// Buzlu cam hissi için hafif gri film greni (SVG feTurbulence, siyah-beyaz)
const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E` +
  `%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E` +
  `%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E` +
  `%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const faceClass = 'absolute inset-0 flex flex-col overflow-hidden rounded-[20px] border border-border bg-card';

function ProjectCard({ project, clone, flipped, onFlip }: {
  project: Project;
  clone: boolean;
  flipped: boolean;
  onFlip: (value: boolean) => void;
}) {
  const { t } = useLanguage();
  const pointerType = useRef('mouse');

  const techs = project.technologies ?? [];
  const primaryHref = project.liveUrl || project.githubUrl || undefined; // önce canlı, yoksa GitHub
  const canFlip = Boolean(project.githubUrl || project.liveUrl || techs.length);
  const tab = clone ? -1 : undefined; // klonlar klavye sırasına girmez
  const flipLabel = flipped
    ? t('featuredProjects.flipBack')
    : t('featuredProjects.flipToDetails', { title: project.title });
  const linkLabel = project.liveUrl
    ? t('featuredProjects.viewLive', { title: project.title })
    : t('featuredProjects.viewSource', { title: project.title });
  const backLinkPointer = flipped ? 'pointer-events-auto' : 'pointer-events-none';

  // Dokunmatikte ilk dokunuş kartı çevirir, ikincisi linke gider.
  // e.detail === 0: klavye (Enter) ile tetiklenmiş, o durumda doğrudan git.
  const onOverlayClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (canFlip && !flipped && e.detail !== 0 && pointerType.current === 'touch') {
      e.preventDefault();
      onFlip(true);
    }
  };

  return (
    <div
      data-card
      className="relative rounded-[20px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
      style={{ height: CARD_H, perspective: 900 }}
      onPointerDown={e => { pointerType.current = e.pointerType; }}
      onPointerEnter={e => { if (canFlip && e.pointerType !== 'touch') onFlip(true); }}
      onPointerLeave={e => { if (e.pointerType !== 'touch') onFlip(false); }}
      onFocus={(e: ReactFocusEvent<HTMLDivElement>) => {
        if (canFlip && e.target.matches(':focus-visible')) onFlip(true);
      }}
      onBlur={(e: ReactFocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onFlip(false);
      }}
    >
      {/* Tıklama katmanı: dönen yüzlerin ALTINDA, boş alana tıklama buraya düşer */}
      {primaryHref && (
        <a
          href={primaryHref}
          target="_blank"
          rel="noreferrer"
          draggable={false}
          tabIndex={tab}
          aria-label={linkLabel}
          onClick={onOverlayClick}
          className="absolute inset-0 rounded-[20px] outline-none"
        />
      )}

      {canFlip && !primaryHref && (
        <button
          type="button"
          tabIndex={tab}
          aria-expanded={flipped}
          aria-label={flipLabel}
          onClick={() => onFlip(!flipped)}
          className="absolute inset-0 rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}

      <div
        className="pointer-events-none relative size-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* ÖN YÜZ: görsel, ad, kısa açıklama */}
        <div className={faceClass} style={{ backfaceVisibility: 'hidden' }}>
          <div className="aspect-[16/10] shrink-0 overflow-hidden border-b border-border bg-muted">
            {project.imageUrl ? (
              <Image src={project.imageUrl} alt={project.title} width={416} height={260} unoptimized draggable={false} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground"><Layers size={20} /></div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3.5">
            <h4 className="line-clamp-1 text-sm font-medium tracking-tight">{project.title}</h4>
            <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{project.description}</p>
          </div>
        </div>

        {/* ARKA YÜZ: GitHub, canlı link, teknolojiler */}
        <div className={faceClass} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
            {(project.githubUrl || project.liveUrl) && (
              <div className="flex flex-col gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    draggable={false}
                    tabIndex={tab}
                    aria-label={t('featuredProjects.viewSource', { title: project.title })}
                    className={`${buttonVariants({ variant: 'outline', size: 'sm' })} ${backLinkPointer} w-full`}
                  >
                    <GitBranch /> GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    draggable={false}
                    tabIndex={tab}
                    aria-label={t('featuredProjects.viewLive', { title: project.title })}
                    className={`${buttonVariants({ variant: 'default', size: 'sm' })} ${backLinkPointer} w-full`}
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
  const { data: projects, isError, isLoading, refetch } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => getProjects(true),
  });
  const featuredProjects = projects ?? [];

  const regionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const pauseRef = useRef({ hover: false, focus: false, flipped: false, dragging: false });
  const [flippedKey, setFlippedKey] = useState<string | null>(null);
  const count = featuredProjects.length;

  useEffect(() => {
    pauseRef.current.flipped = flippedKey !== null;
  }, [flippedKey]);

  // Hook'lar erken return'lerden önce olmalı
  useEffect(() => {
    const region = regionRef.current;
    const track = trackRef.current;
    if (!region || !track || count === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pause = pauseRef.current;
    const loop = count * STEP; // tek bir proje setinin genişliği: klonlar bu aralıkla tekrar eder

    let pos = 0; // şeridin gerçek konumu (px)
    let target = 0; // gitmek istediği konum; pos buna süzülür
    let raf = 0;
    let last = 0;

    // Konumu [0, loop) aralığında tut: klonlar birebir aynı olduğu için sıçrama görünmez
    const normalize = () => {
      const k = Math.floor(pos / loop);
      if (k) {
        pos -= k * loop;
        target -= k * loop;
      }
    };
    const apply = () => {
      track.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };
    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      pos = reduced ? target : pos + (target - pos) * (1 - Math.exp(-dt / TAU_MS));
      normalize();
      apply();
      if (Math.abs(target - pos) > 0.3) {
        raf = requestAnimationFrame(frame);
      } else {
        pos = target;
        normalize();
        apply();
        raf = 0;
      }
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    // ---- Sürükleme ----
    let pointerId: number | null = null;
    let startX = 0;
    let startPos = 0;
    let dragging = false;
    let suppressClick = false;
    let samples: { t: number; x: number }[] = [];

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startPos = pos;
      dragging = false;
      suppressClick = false;
      samples = [{ t: e.timeStamp, x: e.clientX }];
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        pause.dragging = true;
        region.dataset.dragging = 'true';
        // Capture'ı eşik aşılınca alıyoruz; erken alınırsa kartlardaki link tıklamaları bozulur
        try { region.setPointerCapture(e.pointerId); } catch { /* pointer artık aktif değil */ }
        setFlippedKey(null);
      }
      pos = target = startPos - dx;
      normalize();
      apply();
      samples.push({ t: e.timeStamp, x: e.clientX });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      pause.dragging = false;
      region.removeAttribute('data-dragging');
      suppressClick = true; // sürükleme sonrası bırakılan yerdeki link tıklanmasın
      const a = samples[0];
      const b = samples[samples.length - 1];
      const v = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px/ms, sağa pozitif
      if (!reduced) {
        target = pos - Math.max(-MAX_FLING, Math.min(MAX_FLING, v * FLING_MS));
        kick();
      }
      samples = [];
    };
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      pause.dragging = false;
      region.removeAttribute('data-dragging');
      samples = [];
    };
    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      if (e.detail === 0) return;
      e.preventDefault();
      e.stopPropagation();
    };

    // ---- Fare tekerleği: React'in onWheel'i pasif olduğu için preventDefault çalışmaz, native dinliyoruz ----
    const onWheel = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const raw = horizontal ? e.deltaX : WHEEL_CAPTURES_VERTICAL ? e.deltaY : 0;
      if (!raw) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? region.clientWidth : 1;
      target += raw * unit;
      setFlippedKey(null);
      kick();
    };

    // ---- Duraklatma ----
    const onEnter = () => { pause.hover = true; };
    const onLeave = () => { pause.hover = false; };

    // Klavye odağı: duraklat, ekran dışındaki orijinal karta odaklanıldıysa onu görünür alana getir
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.matches(':focus-visible')) return;
      pause.focus = true;
      const card = el.closest<HTMLElement>('[data-index]');
      if (!card) return;
      const x = Number(card.dataset.index) * STEP;
      const left = track.offsetLeft + x - pos;
      if (left < 0 || left + CARD_W > region.clientWidth) {
        target = x + track.offsetLeft - FOCUS_PAD;
        kick();
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!region.contains(e.relatedTarget as Node | null)) pause.focus = false;
    };

    // Dokunmatikte kartın dışına dokunulunca açık kart kapansın (şeridin dışı dahil)
    const onDocDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && !(e.target as Element).closest('[data-card]')) setFlippedKey(null);
    };

    const preventNativeDrag = (e: Event) => e.preventDefault();

    region.addEventListener('pointerdown', onDown);
    region.addEventListener('pointermove', onMove);
    region.addEventListener('pointerup', onUp);
    region.addEventListener('pointercancel', onCancel);
    region.addEventListener('click', onClickCapture, true);
    region.addEventListener('wheel', onWheel, { passive: false });
    region.addEventListener('pointerenter', onEnter);
    region.addEventListener('pointerleave', onLeave);
    region.addEventListener('focusin', onFocusIn);
    region.addEventListener('focusout', onFocusOut);
    region.addEventListener('dragstart', preventNativeDrag);
    document.addEventListener('pointerdown', onDocDown);

    const id = reduced
      ? 0
      : window.setInterval(() => {
          if (pause.hover || pause.focus || pause.flipped || pause.dragging || document.hidden) return;
          target += STEP;
          kick();
        }, INTERVAL_MS);

    return () => {
      if (id) window.clearInterval(id);
      if (raf) cancelAnimationFrame(raf);
      region.removeEventListener('pointerdown', onDown);
      region.removeEventListener('pointermove', onMove);
      region.removeEventListener('pointerup', onUp);
      region.removeEventListener('pointercancel', onCancel);
      region.removeEventListener('click', onClickCapture, true);
      region.removeEventListener('wheel', onWheel);
      region.removeEventListener('pointerenter', onEnter);
      region.removeEventListener('pointerleave', onLeave);
      region.removeEventListener('focusin', onFocusIn);
      region.removeEventListener('focusout', onFocusOut);
      region.removeEventListener('dragstart', preventNativeDrag);
      document.removeEventListener('pointerdown', onDocDown);
      region.removeAttribute('data-dragging');
      track.style.transform = '';
    };
  }, [count]);

  if (isLoading) {
    return <div role="status" className="border border-border p-8 font-mono text-xs text-muted-foreground">{t('featuredProjects.loading')}</div>;
  }

  if (isError) {
    return (
      <div role="alert" className="border border-border p-8 text-sm">
        <p>{t('featuredProjects.loadError')}</p>
        <button
          type="button"
          onClick={() => { void refetch(); }}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          {t('featuredProjects.retry')}
        </button>
      </div>
    );
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
    return { project, index: i % count, clone: i >= count, key: `${project.id}-${Math.floor(i / count)}` };
  });

  return (
    // Şerit: container'dan taşıp ekranın tamamını kaplar (HeroRipple ile aynı teknik)
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={t('featuredProjects.heading')}
      className="relative isolate left-1/2 w-screen -translate-x-1/2 cursor-grab touch-pan-y select-none overflow-hidden py-8 sm:py-10 [&[data-dragging=true]_*]:cursor-grabbing"
    >
      {/* Buzlu cam: açık butter-yellow + üstten parıltı + blur, ardından film greni. Çizgi/border yok. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-primary/25 bg-linear-to-b from-white/35 to-transparent backdrop-blur-2xl backdrop-saturate-150 dark:from-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-screen"
        style={{ backgroundImage: GRAIN }}
      />

      <ul ref={trackRef} className="ml-5 flex w-max sm:ml-8" style={{ columnGap: GAP }}>
        {items.map(({ project, index, clone, key }) => (
          <li
            key={key}
            data-index={clone ? undefined : index}
            aria-hidden={clone || undefined}
            style={{ width: CARD_W }}
            className="shrink-0"
          >
            <ProjectCard
              project={project}
              clone={clone}
              flipped={flippedKey === key}
              onFlip={value => setFlippedKey(current => value ? key : current === key ? null : current)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}