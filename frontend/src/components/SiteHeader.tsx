'use client';

import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function SiteHeader() {
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const links: [string, string][] = [
    [t('header.nav.projects'), '#projects'],
    [t('header.nav.experience'), '#experience'],
    [t('header.nav.skills'), '#skills'],
    [t('header.nav.lab'), '#lab'],
    [t('header.nav.contact'), '#contact'],
  ];

  return <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
      <a href="#top" aria-label={t('header.homeAria')} className="flex items-center gap-3 transition-opacity hover:opacity-70">
        <span className="flex size-8 items-center justify-center border border-border font-mono text-xs font-semibold">SE</span>
        <span className="text-sm font-medium">Şeyma Ekici</span>
      </a>
      <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">{links.map(([label, href]) => <a key={href} href={href} className="text-xs text-muted-foreground transition hover:text-foreground">{label}</a>)}</nav>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-2 text-[10px] text-muted-foreground lg:flex"><span className="size-1.5 rounded-full bg-emerald-500" />{t('header.availableForWork')}</span>
        <button type="button" onClick={toggleLang} aria-label={lang === 'tr' ? t('header.switchToEnglish') : t('header.switchToTurkish')} className="flex size-9 items-center justify-center rounded-sm border border-border font-mono text-[10px] font-semibold uppercase text-muted-foreground transition hover:bg-muted">{lang}</button>
        <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? t('header.switchToLight') : t('header.switchToDark')} className="flex size-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition hover:bg-muted">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
        <button type="button" onClick={() => setOpen(!open)} aria-label={open ? t('header.closeMenu') : t('header.openMenu')} aria-expanded={open} className="flex size-9 items-center justify-center border border-border transition-colors hover:bg-muted md:hidden">{open ? <X size={16} /> : <Menu size={16} />}</button>
      </div>
    </div>
    {open && <nav aria-label="Mobile navigation" className="border-t border-border px-5 py-3 md:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-border py-3 text-sm transition-colors hover:bg-muted last:border-0">{label}</a>)}</nav>}
  </header>;
}