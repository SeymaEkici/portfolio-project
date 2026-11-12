'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>{t('footer.copyright')}</p>
        <div className="flex gap-5">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-foreground">X / Twitter</a>
        </div>
      </div>
    </footer>
  );
}