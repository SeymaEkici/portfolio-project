'use client';

import { ArrowDown, ArrowUpRight, BookOpen, Braces, Cpu, Layers3, MapPin } from 'lucide-react';
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
      <SiteHeader />
      <main id="top" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="grid min-h-[620px] items-center gap-12 border-b border-zinc-200 py-20 dark:border-zinc-800 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
          <div>
            <div className="mb-8 flex items-center gap-2 font-mono text-xs text-zinc-500">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {t('hero.systemStatus')} <span className="text-zinc-300 dark:text-zinc-700">/</span> {t('hero.operational')}
            </div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[.22em] text-zinc-500">{t('hero.eyebrow')}</p>
            <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              {t('hero.titlePrefix')} <span className="text-zinc-400 dark:text-zinc-500">{t('hero.titleSuffix')}</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
              {t('hero.description')}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="inline-flex items-center gap-2 bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">{t('hero.ctaProjects')} <ArrowUpRight size={15} /></a>
              <a href="#contact" className="inline-flex items-center gap-2 border border-zinc-300 px-5 py-3 text-sm font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-400">{t('hero.ctaContact')} <ArrowDown size={15} /></a>
            </div>
          </div>
          <div className="relative hidden aspect-square max-h-[360px] border border-zinc-200 p-6 dark:border-zinc-800 lg:block" aria-label={t('hero.diagramAria')}>
            <div className="absolute inset-6 grid grid-cols-6 grid-rows-6 border-l border-t border-zinc-200 dark:border-zinc-800">
              {Array.from({ length: 36 }, (_, index) => <span key={index} className="border-b border-r border-zinc-200/70 dark:border-zinc-800/70" />)}
            </div>
            <div className="absolute left-[28%] top-[22%] flex size-28 items-center justify-center border border-zinc-400 bg-background font-mono text-xs tracking-widest shadow-[8px_8px_0_var(--color-zinc-200)] dark:border-zinc-600 dark:shadow-[8px_8px_0_var(--color-zinc-800)]">SYSTEM<br />01</div>
            <div className="absolute bottom-[20%] right-[20%] flex size-20 items-center justify-center border border-zinc-300 bg-background font-mono text-[10px] text-zinc-500 dark:border-zinc-700">BUILD<br />DEPLOY</div>
            <span className="absolute bottom-7 left-7 font-mono text-[10px] uppercase tracking-widest text-zinc-500">{t('hero.diagramCaption')}</span>
          </div>
        </section>

        <section aria-label="Quick information" className="grid grid-cols-2 border-b border-zinc-200 py-8 dark:border-zinc-800 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => <div key={label} className="border-l border-zinc-200 py-2 pl-4 first:border-0 first:pl-0 dark:border-zinc-800 sm:pl-6"><p className="font-mono text-[10px] tracking-[.15em] text-zinc-500">{label}</p><p className="mt-2 flex items-center gap-2 text-sm font-medium">{Icon && <Icon size={14} className="text-zinc-500" />}{value}</p></div>)}
        </section>

        <section id="projects" className="scroll-mt-24 py-20 sm:py-24">
          <SectionHeading index="01" title={t('sections.selectedWork.title')} note={t('sections.selectedWork.note')} />
          <FeaturedProjects />
        </section>

        <section id="experience" className="scroll-mt-24 border-t border-zinc-200 py-20 dark:border-zinc-800 sm:py-24">
          <SectionHeading index="02" title={t('sections.experience.title')} note={t('sections.experience.note')} />
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="border-l border-zinc-300 pl-6 dark:border-zinc-700">
              <p className="font-mono text-xs text-zinc-500">{t('experienceBlock.currentPractice')}</p>
              <h3 className="mt-3 text-lg font-medium">{t('experienceBlock.roleTitle')}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{t('experienceBlock.roleDescription')}</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500"><Braces size={14} /> {t('experienceBlock.remoteNote')}</div>
            </div>
            <div id="skills" className="scroll-mt-24 grid gap-7 sm:grid-cols-2">
              {skills.map(({ group, items }) => <div key={group} className="border-t border-zinc-200 pt-4 dark:border-zinc-800"><h3 className="font-mono text-[10px] tracking-[.16em] text-zinc-500">{group}</h3><ul className="mt-4 flex flex-wrap gap-2">{items.map(item => <li key={item} className="border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-800">{item}</li>)}</ul></div>)}
            </div>
          </div>
        </section>

        <section className="grid gap-5 border-t border-zinc-200 py-20 dark:border-zinc-800 md:grid-cols-[1fr_1fr] sm:py-24">
          <div><SectionHeading index="03" title={t('sections.exploring.title')} note={t('sections.exploring.note')} /><p className="max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-400">{t('sections.exploring.text')}</p></div>
          <div className="grid gap-0 border border-zinc-200 dark:border-zinc-800">
            <GardenRow icon={<Cpu size={16} />} label={t('garden.buildingLabel')} title={t('garden.buildingTitle')} number="01" />
            <GardenRow icon={<Layers3 size={16} />} label={t('garden.learningLabel')} title={t('garden.learningTitle')} number="02" />
            <GardenRow icon={<BookOpen size={16} />} label={t('garden.readingLabel')} title={t('garden.readingTitle')} number="03" />
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

function SectionHeading({ index, title, note }: { index: string; title: string; note: string }) {
  const { t } = useLanguage();
  return <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="mb-3 font-mono text-[10px] tracking-[.2em] text-zinc-500">{index} / {t('common.portfolioLabel')}</p><h2 className="text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2></div><p className="max-w-sm text-sm text-zinc-500">{note}</p></div>;
}

function GardenRow({ icon, label, title, number }: { icon: React.ReactNode; label: string; title: string; number: string }) {
  return <div className="flex items-center gap-4 border-b border-zinc-200 p-5 last:border-b-0 dark:border-zinc-800"><span className="text-zinc-500">{icon}</span><div className="flex-1"><p className="font-mono text-[10px] tracking-widest text-zinc-500">{label}</p><p className="mt-1 text-sm">{title}</p></div><span className="font-mono text-xs text-zinc-400">{number}</span></div>;
}