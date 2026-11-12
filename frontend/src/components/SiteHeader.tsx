'use client';

import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

const links = [
  ['Projects', '#projects'], ['Experience', '#experience'], ['Skills', '#skills'], ['Lab', '#lab'], ['Contact', '#contact'],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  }

  return <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/90 backdrop-blur-md dark:border-zinc-800/80">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
      <a href="#top" aria-label="Seyma Ekici, home" className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center border border-zinc-300 font-mono text-xs font-semibold dark:border-zinc-700">SE</span>
        <span className="hidden text-sm font-medium sm:inline">Şeyma Ekici</span>
      </a>
      <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">{links.map(([label, href]) => <a key={label} href={href} className="text-xs text-zinc-500 transition hover:text-foreground">{label}</a>)}</nav>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-2 font-mono text-[10px] text-zinc-500 lg:flex"><span className="size-1.5 rounded-full bg-emerald-500" />AVAILABLE FOR WORK</span>
        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} className="flex size-9 items-center justify-center border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900">{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
        <button type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} className="flex size-9 items-center justify-center border border-zinc-200 md:hidden dark:border-zinc-800">{open ? <X size={16} /> : <Menu size={16} />}</button>
      </div>
    </div>
    {open && <nav aria-label="Mobile navigation" className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-800 md:hidden">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="block border-b border-zinc-100 py-3 text-sm last:border-0 dark:border-zinc-900">{label}</a>)}</nav>}
  </header>;
}
