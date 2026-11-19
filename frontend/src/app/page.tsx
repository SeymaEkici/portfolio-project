'use client';

import { ArrowDown, ArrowUpRight, BookOpen, Braces, Cpu, Layers3, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';
import FeaturedProjects from '@/components/FeaturedProjects';
import SiteHeader from '@/components/SiteHeader';
import MiniTerminal from '@/components/MiniTerminal';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();

  const stats = [
    { label: t('stats.experienceLabel'), value: t('stats.experienceValue') },
    { label: t('stats.focusLabel'), value: t('stats.focusValue') },
    { label: t('stats.architectureLabel'), value: t('stats.architectureValue') },
    { label: t('stats.locationLabel'), value: t('stats.locationValue'), icon: MapPin },
  ];

  const skills = [
    { group: t('skillsGroups.languages'), items: ['TypeScript', 'JavaScript', 'SQL', 'HTML / CSS'] },
    { group: t('skillsGroups.frontend'), items: ['React', 'Next.js', 'Tailwind CSS', 'TanStack Query'] },
    { group: t('skillsGroups.backend'), items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL'] },
    { group: t('skillsGroups.practice'), items: ['Clean architecture', 'Testing', 'Git', 'CI / CD'] },
  ];

  return (
    <>
      <a href="#top" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:border focus:border-border">{t('header.skipToContent')}</a>
      <SiteHeader />
      <main id="top" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="grid min-h-[620px] items-center gap-12 border-b border-zinc-200 py-20 dark:border-zinc-800 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
          <div>
            <div className="mb-8 inline-flex -rotate-6 items-center gap-2 rounded-full bg-burst px-3 py-1 text-xs text-burst-foreground">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {t('hero.systemStatus')} {t('hero.operational')}
            </div>
            <p className="mb-5 text-sm text-muted-foreground">{t('hero.eyebrow')}</p>
            <h1 className="max-w-3xl text-balance text-5xl font-medium leading-[1.05] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              {t('hero.titlePrefix')} <span className="text-zinc-400 dark:text-zinc-500">{t('hero.titleSuffix')}</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
              {t('hero.description')}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="default" render={<a href="#projects" />}>{t('hero.ctaProjects')} <ArrowUpRight size={15} /></Button>
              <Button variant="outline" render={<a href="#contact" />}>{t('hero.ctaContact')} <ArrowDown size={15} /></Button>
            </div>
          </div>
          <div className="relative hidden aspect-square max-h-[360px] border border-zinc-200 p-6 dark:border-zinc-800 lg:block" aria-hidden="true">
            <div className="absolute inset-6 grid grid-cols-6 grid-rows-6 border-l border-t border-zinc-200 dark:border-zinc-800">
              {Array.from({ length: 36 }, (_, index) => <span key={index} className="border-b border-r border-zinc-200/70 dark:border-zinc-800/70" />)}
            </div>
            <div className="absolute left-[28%] top-[22%] flex size-28 items-center justify-center border border-zinc-400 bg-background font-mono text-xs tracking-widest shadow-[8px_8px_0_var(--color-zinc-200)] dark:border-zinc-600 dark:shadow-[8px_8px_0_var(--color-zinc-800)]">SYSTEM<br />01</div>
            <div className="absolute bottom-[20%] right-[20%] flex size-20 items-center justify-center border border-zinc-300 bg-background font-mono text-[10px] text-zinc-500 dark:border-zinc-700">BUILD<br />DEPLOY</div>
            <span className="absolute bottom-7 left-7 font-mono text-[10px] uppercase tracking-widest text-zinc-500">{t('hero.diagramCaption')}</span>
          </div>
        </section>

        <section aria-label="Quick information" className="grid grid-cols-2 border-b border-zinc-200 py-8 dark:border-zinc-800 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => <div key={label} className="border-l border-zinc-200 py-2 pl-4 first:border-0 first:pl-0 dark:border-zinc-800 sm:pl-6"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-2 flex items-center gap-2 text-sm font-medium">{Icon && <Icon size={14} className="text-zinc-500" />}{value}</p></div>)}
        </section>

        <section id="projects" className="scroll-mt-24 py-20 sm:py-24">
          <SectionHeading index="01" title={t('sections.selectedWork.title')} note={t('sections.selectedWork.note')} />
          <FeaturedProjects />
        </section>

        <section id="experience" className="scroll-mt-24 border-t border-border py-20 sm:py-24">
          <SectionHeading index="02" title={t('sections.experience.title')} note={t('sections.experience.note')} />
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="border-l border-border pl-6">
              <p className="text-xs text-muted-foreground">{t('experienceBlock.currentPractice')}</p>
              <h3 className="mt-3 text-balance text-lg font-medium">{t('experienceBlock.roleTitle')}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('experienceBlock.roleDescription')}</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Braces size={14} /> {t('experienceBlock.remoteNote')}</div>
            </div>
            <div id="skills" className="scroll-mt-24 grid gap-7 sm:grid-cols-2">
              {skills.map(({ group, items }) => <div key={group} className="border-t border-border pt-4"><h3 className="text-xs text-muted-foreground">{group}</h3><ul className="mt-4 flex flex-wrap gap-2">{items.map(item => <li key={item} className="border border-border px-2.5 py-1.5 text-xs">{item}</li>)}</ul></div>)}
            </div>
          </div>
        </section>

        <section className="grid gap-5 border-t border-border py-20 md:grid-cols-[1fr_1fr] sm:py-24">
          <div><SectionHeading index="03" title={t('sections.exploring.title')} note={t('sections.exploring.note')} /><p className="max-w-md text-sm leading-7 text-muted-foreground">{t('sections.exploring.text')}</p></div>
          <div className="grid gap-0 border border-border">
            <GardenRow icon={<Cpu size={16} />} label={t('garden.buildingLabel')} title={t('garden.buildingTitle')} />
            <GardenRow icon={<Layers3 size={16} />} label={t('garden.learningLabel')} title={t('garden.learningTitle')} />
            <GardenRow icon={<BookOpen size={16} />} label={t('garden.readingLabel')} title={t('garden.readingTitle')} />
          </div>
        </section>

        <section id="lab" className="scroll-mt-24 border-t border-zinc-200 py-20 dark:border-zinc-800 sm:py-24">
          <SectionHeading index="04" title={t('sections.lab.title')} note={t('sections.lab.note')} />
          <MiniTerminal />
        </section>

        <section id="contact" className="scroll-mt-24 border-t border-zinc-200 py-20 dark:border-zinc-800 sm:py-24">
          <SectionHeading index="05" title={t('sections.contact.title')} note={t('sections.contact.note')} />
          <ContactForm />
        </section>
      </main>
    </>
  );
}

function SectionHeading({ title, note }: { index: string; title: string; note: string }) {
  return <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2></div><p className="max-w-sm text-sm text-zinc-500">{note}</p></div>;
}

function GardenRow({ icon, label, title }: { icon: React.ReactNode; label: string; title: string }) {
  return <div className="flex items-center gap-4 border-b border-border p-5 last:border-b-0"><span className="text-muted-foreground">{icon}</span><div className="flex-1"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-sm">{title}</p></div></div>;
}