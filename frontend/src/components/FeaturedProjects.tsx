import Image from 'next/image';
import { ArrowUpRight, Code2, Layers } from 'lucide-react';
import { getProjects } from '@/services/project.service';
import type { Project } from '@/types';

export default async function FeaturedProjects() {
  let featuredProjects: Project[] = [];
  try {
    featuredProjects = await getProjects(true);
  } catch {
    // The portfolio remains useful while the project API is unavailable.
  }

  return <>
    <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <h3 className="flex items-center gap-2 text-xs font-medium"><Layers size={14} className="text-zinc-500" /> FEATURED PROJECTS</h3>
      <span className="font-mono text-[10px] text-zinc-500">{String(featuredProjects.length).padStart(2, '0')} ENTRIES</span>
    </div>
    {featuredProjects.length === 0 ? <div className="border border-dashed border-zinc-300 px-6 py-10 text-center dark:border-zinc-700"><p className="text-sm">Projects are being curated.</p><p className="mt-2 text-xs text-zinc-500">Check back soon for selected work and case studies.</p></div> :
      <div className="grid gap-5 md:grid-cols-2">{featuredProjects.map(project => <article key={project.id} className="group flex flex-col border border-zinc-200 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
        {project.imageUrl && <div className="aspect-[16/9] overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"><Image src={project.imageUrl} alt={project.title} width={1200} height={675} unoptimized className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /></div>}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500"><span>/{project.slug}</span><div className="flex gap-3">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} source on GitHub`}><Code2 size={15} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} live site`}><ArrowUpRight size={15} /></a>}</div></div>
          <h4 className="mt-5 text-xl font-medium tracking-tight">{project.title}</h4><p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.description}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">{project.technologies?.map(item => <span key={item.technology.id} className="border border-zinc-200 px-2 py-1 font-mono text-[10px] text-zinc-500 dark:border-zinc-800">{item.technology.name}</span>)}</div>
        </div>
      </article>)}</div>}
  </>;
}
