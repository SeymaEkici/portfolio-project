'use client';

import Image from 'next/image';
import { ArrowUpRight, Code2, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/project.service';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function FeaturedProjects() {
  const { t } = useLanguage();
  const { data: featuredProjects = [], isLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => getProjects(true),
  });

  if (isLoading) {
    return <div role="status" className="border border-border p-8 font-mono text-xs text-muted-foreground">{t('featuredProjects.loading')}</div>;
  }

  return <>
    <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
      <h3 className="flex items-center gap-2 text-xs font-medium"><Layers size={14} className="text-muted-foreground" /> {t('featuredProjects.heading')}</h3>
      <span className="font-mono text-[10px] text-muted-foreground">{t('featuredProjects.entries', { count: String(featuredProjects.length).padStart(2, '0') })}</span>
    </div>
    {featuredProjects.length === 0 ? <div className="border border-dashed border-border px-6 py-10 text-center"><p className="text-sm">{t('featuredProjects.emptyTitle')}</p><p className="mt-2 text-xs text-muted-foreground">{t('featuredProjects.emptyNote')}</p></div> :
      <div className="grid gap-5 md:grid-cols-2">{featuredProjects.map((project, index) => <article key={project.id} className="group relative flex flex-col overflow-hidden rounded-[20px] border border-border transition-colors hover:border-foreground/40">
        {index === 0 && <span className="absolute right-4 top-4 z-10 -rotate-6 rounded-full bg-burst px-3 py-1 text-xs text-burst-foreground">favorim</span>}
        {project.imageUrl && <div className="aspect-[16/9] overflow-hidden border-b border-border bg-muted"><Image src={project.imageUrl} alt={project.title} width={1200} height={675} unoptimized className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /></div>}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground"><span>/{project.slug}</span><div className="flex gap-3">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={t('featuredProjects.viewSource', { title: project.title })}><Code2 size={15} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={t('featuredProjects.viewLive', { title: project.title })}><ArrowUpRight size={15} /></a>}</div></div>
          <h4 className="mt-5 text-balance text-xl font-medium tracking-tight">{project.title}</h4><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">{project.technologies?.map(item => <span key={item.technology.id} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">{item.technology.name}</span>)}</div>
        </div>
      </article>)}</div>}
  </>;
}