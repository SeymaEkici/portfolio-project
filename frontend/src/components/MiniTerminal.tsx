'use client';

import { useState, type FormEvent } from 'react';
import { CornerDownLeft, TerminalSquare } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function MiniTerminal() {
  const { t } = useLanguage();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([t('miniTerminal.welcome')]);

  const responses: Record<string, string> = {
    help: t('miniTerminal.helpResponse'),
    skills: t('miniTerminal.skillsResponse'),
    now: t('miniTerminal.nowResponse'),
    'sudo hire-me': t('miniTerminal.hireResponse'),
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const typed = command.trim().toLowerCase();
    if (!typed) return;
    setHistory(current => [...current, `visitor@portfolio:~$ ${typed}`, responses[typed] ?? t('miniTerminal.notFound', { cmd: typed })]);
    setCommand('');
  }

  return <div className="overflow-hidden border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
    <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"><TerminalSquare size={14} className="text-zinc-500" /><span className="font-mono text-[10px] tracking-widest text-zinc-500">{t('miniTerminal.interactiveTerminal')}</span><span className="ml-auto size-2 rounded-full bg-emerald-500" aria-label={t('miniTerminal.readyAria')} /></div>
    <div aria-live="polite" className="min-h-32 space-y-2 p-4 font-mono text-xs leading-5 text-zinc-600 dark:text-zinc-400">{history.map((line, index) => <p key={`${index}-${line}`} className={line.startsWith('visitor@') ? 'text-foreground' : ''}>{line}</p>)}</div>
    <form onSubmit={submit} className="flex items-center gap-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800"><label htmlFor="terminal-command" className="font-mono text-xs text-zinc-500">$</label><input id="terminal-command" value={command} onChange={event => setCommand(event.target.value)} placeholder={t('miniTerminal.placeholder')} autoComplete="off" className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-zinc-400" /><button aria-label={t('miniTerminal.runAria')} className="text-zinc-500 transition hover:text-foreground" type="submit"><CornerDownLeft size={15} /></button></form>
  </div>;
}