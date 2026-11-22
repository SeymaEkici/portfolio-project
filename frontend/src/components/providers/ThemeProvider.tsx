'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'portfolio-theme';

let currentTheme: Theme = 'light';
let hydrated = false;
const listeners = new Set<() => void>();

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function hydrateFromStorage() {
  if (hydrated || typeof window === 'undefined') return;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isTheme(stored)) currentTheme = stored;
  hydrated = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  hydrateFromStorage();
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return 'light';
}

function writeTheme(next: Theme) {
  currentTheme = next;
  hydrated = true;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach(listener => listener());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setTheme = useCallback((next: Theme) => writeTheme(next), []);

  const toggleTheme = useCallback(() => {
    writeTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
