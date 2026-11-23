'use client';

import { useEffect, useRef } from 'react';
import { useTheme, type Theme } from '@/components/providers/ThemeProvider';

/* ---------- Tunables ---------- */
const CELL = 5; 
const WAVE = 0.15; 
const DAMPING = 0.988; 
const STEP_MS = 1000 / 60; 
const IDLE_EPS = 0.003; 
const MAX_HEIGHT = 1.5;

const COLORS = {
  light: { rgb: [224, 185, 58], maxAlpha: 150 },
  dark: { rgb: [232, 197, 71], maxAlpha: 95 },
} as const;

function startRipple(
  wrap: HTMLElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  getTheme: () => Theme
): () => void {
  let gw = 0;
  let gh = 0;
  let cur = new Float32Array(0);
  let prev = new Float32Array(0);
  let next = new Float32Array(0);
  let img: ImageData | null = null;

  let raf = 0;
  let running = false;
  let last = 0;
  let acc = 0;
  let energy = 0;
  let lastX: number | null = null;
  let lastY = 0;
  const timers = new Set<number>();

  const resize = () => {
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(3, Math.round(rect.width / CELL));
    const h = Math.max(3, Math.round(rect.height / CELL));
    if (w === gw && h === gh) return;
    gw = w;
    gh = h;
    canvas.width = w;
    canvas.height = h;
    cur = new Float32Array(w * h);
    prev = new Float32Array(w * h);
    next = new Float32Array(w * h);
    img = ctx.createImageData(w, h);
    energy = 0;
  };

  const step = () => {
    let peak = 0;
    for (let j = 1; j < gh - 1; j++) {
      const row = j * gw;
      for (let i = 1; i < gw - 1; i++) {
        const k = row + i;
        const c = cur[k];
        const lap = cur[k - 1] + cur[k + 1] + cur[k - gw] + cur[k + gw] - 4 * c;
        const v = (2 * c - prev[k] + WAVE * lap) * DAMPING;
        next[k] = v;
        const a = v < 0 ? -v : v;
        if (a > peak) peak = a;
      }
    }
    const t = prev;
    prev = cur;
    cur = next;
    next = t;
    energy = peak;
  };

  const render = () => {
    if (!img) return;
    const { rgb, maxAlpha } = COLORS[getTheme()];
    const data = img.data;
    for (let j = 1; j < gh - 1; j++) {
      const row = j * gw;
      for (let i = 1; i < gw - 1; i++) {
        const k = row + i;
        const slope = cur[k + 1] - cur[k - 1] + (cur[k + gw] - cur[k - gw]);
        const strength = Math.abs(cur[k]) * 1.6 + Math.abs(slope) * 1.1;
        const p = k * 4;
        data[p] = rgb[0];
        data[p + 1] = rgb[1];
        data[p + 2] = rgb[2];
        data[p + 3] = Math.min(1, strength) * maxAlpha;
      }
    }
    ctx.putImageData(img, 0, 0);
  };

  const frame = (t: number) => {
    if (!last) last = t;
    acc += Math.min(t - last, 64);
    last = t;
    while (acc >= STEP_MS) {
      step();
      acc -= STEP_MS;
    }
    render();
    if (energy > IDLE_EPS) {
      raf = requestAnimationFrame(frame);
    } else {
      running = false;
    }
  };

  const kick = (amp: number) => {
    energy = Math.max(energy, amp, IDLE_EPS * 2);
    if (!running) {
      running = true;
      last = 0;
      acc = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const bump = (cx: number, cy: number, radius: number, amp: number) => {
    const x0 = Math.max(1, Math.floor(cx - radius));
    const x1 = Math.min(gw - 2, Math.ceil(cx + radius));
    const y0 = Math.max(1, Math.floor(cy - radius));
    const y1 = Math.min(gh - 2, Math.ceil(cy + radius));
    const r2 = radius * radius;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const d2 = (dx * dx + dy * dy) / r2;
        if (d2 >= 1) continue;
        const f = (1 - d2) * (1 - d2);
        const k = y * gw + x;
        const v = Math.max(-MAX_HEIGHT, Math.min(MAX_HEIGHT, cur[k] + amp * f));
        cur[k] = v;
        prev[k] = v;
      }
    }
    kick(Math.abs(amp));
  };

  const toGrid = (e: PointerEvent): [number, number] => {
    const r = wrap.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * gw, ((e.clientY - r.top) / r.height) * gh];
  };

  const onEnter = (e: PointerEvent) => {
    [lastX, lastY] = toGrid(e);
  };

  const onMove = (e: PointerEvent) => {
    const [x, y] = toGrid(e);
    if (lastX === null) {
      lastX = x;
      lastY = y;
      return;
    }
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.5) return;
    const steps = Math.ceil(dist / 2);
    const amp = Math.min(0.18 + dist * 0.02, 0.5) * 0.6;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      bump(lastX + dx * t, lastY + dy * t, 3, amp);
    }
    lastX = x;
    lastY = y;
  };

  const onLeave = () => {
    lastX = null;
  };

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const [x, y] = toGrid(e);
    bump(x, y, 5, 1.1);
    const t1 = window.setTimeout(() => {
      timers.delete(t1);
      bump(x, y, 4, -0.7);
    }, 150);
    const t2 = window.setTimeout(() => {
      timers.delete(t2);
      bump(x, y, 3, 0.45);
    }, 320);
    timers.add(t1);
    timers.add(t2);
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  wrap.addEventListener('pointerenter', onEnter);
  wrap.addEventListener('pointermove', onMove);
  wrap.addEventListener('pointerleave', onLeave);
  wrap.addEventListener('pointerdown', onDown);

  return () => {
    cancelAnimationFrame(raf);
    running = false;
    timers.forEach(id => window.clearTimeout(id));
    timers.clear();
    ro.disconnect();
    wrap.removeEventListener('pointerenter', onEnter);
    wrap.removeEventListener('pointermove', onMove);
    wrap.removeEventListener('pointerleave', onLeave);
    wrap.removeEventListener('pointerdown', onDown);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

export default function HeroRipple() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef<Theme>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let teardown: (() => void) | null = null;

    const sync = () => {
      teardown?.();
      teardown = mq.matches ? null : startRipple(wrap, canvas, ctx, () => themeRef.current);
    };

    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      teardown?.();
      teardown = null;
    };
  }, []);

  return (
    <div 
      ref={wrapRef}
      className="pointer-events-auto absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#F2DF91]/50 via-[#F2DF91]/15 to-transparent dark:from-[#E8C547]/20 dark:via-transparent dark:to-transparent"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-none opacity-90"
      />
    </div>
  );
}