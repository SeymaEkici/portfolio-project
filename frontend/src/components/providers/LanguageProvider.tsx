'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { translations, type Lang } from '@/lib/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'portfolio-lang';

// A small external store backing the current language. Reading/writing it through
// useSyncExternalStore keeps the browser's localStorage (and same-tab updates) in
// sync without ever calling setState from inside an effect.
let currentLang: Lang = 'tr';
let hydrated = false;
const listeners = new Set<() => void>();

function isLang(value: string | null): value is Lang {
  return value === 'tr' || value === 'en';
}

function hydrateFromStorage() {
  if (hydrated || typeof window === 'undefined') return;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) currentLang = stored;
  hydrated = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Lang {
  hydrateFromStorage();
  return currentLang;
}

function getServerSnapshot(): Lang {
  // The default is Turkish; the real (possibly stored) preference is picked up
  // on the client via getSnapshot, right after hydration.
  return 'tr';
}

function writeLang(next: Lang) {
  currentLang = next;
  hydrated = true;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach(listener => listener());
}

function getNested(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);

  const toggleLang = useCallback(() => {
    writeLang(lang === 'tr' ? 'en' : 'tr');
  }, [lang]);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const value = getNested(translations[lang], path);
      let result = typeof value === 'string' ? value : path;
      if (vars) {
        for (const [key, replacement] of Object.entries(vars)) {
          result = result.replaceAll(`{${key}}`, String(replacement));
        }
      }
      return result;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}