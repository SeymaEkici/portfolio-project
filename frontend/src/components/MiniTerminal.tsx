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

  return <div className="overflow-hidden rounded-[20px] border border-border bg-card">
    <div className="flex items-center gap-2 border-b border-border px-4 py-3"><TerminalSquare size={14} className="text-muted-foreground" /><span className="font-mono text-[10px] tracking-widest text-muted-foreground">{t('miniTerminal.interactiveTerminal')}</span><span role="status" className="ml-auto size-2 rounded-full bg-emerald-500" aria-label={t('miniTerminal.readyAria')} /></div>
    <div aria-live="polite" className="min-h-32 space-y-2 p-4 font-mono text-xs leading-5 text-muted-foreground">{history.map((line, index) => <p key={`${index}-${line}`} className={`break-words ${line.startsWith('visitor@') ? 'text-foreground' : ''}`}>{line}</p>)}</div>
    <form onSubmit={submit} className="flex items-center gap-3 border-t border-border px-4 py-3"><label htmlFor="terminal-command" className="font-mono text-xs text-muted-foreground">$</label><input id="terminal-command" name="command" value={command} onChange={event => setCommand(event.target.value)} placeholder={t('miniTerminal.placeholder')} autoComplete="off" className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground" /><button aria-label={t('miniTerminal.runAria')} className="text-muted-foreground transition hover:text-foreground" type="submit"><CornerDownLeft size={15} /></button></form>
  </div>;
}