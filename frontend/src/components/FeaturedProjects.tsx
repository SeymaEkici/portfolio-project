import { GitBranch, Layers } from 'lucide-react';
import { getProjects } from '@/services/project.service';

export default async function FeaturedProjects() {
  let featuredProjects: any[] = [];
  try {
    featuredProjects = await getProjects(true);
  } catch (error) {
    console.error('Projeler yüklenirken hata oluştu (Backend kapalı olabilir):', error);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-zinc-400" />
          Öne Çıkarılan Projeler
        </h2>
        <span className="text-xs font-mono text-zinc-500">
          [ {featuredProjects.length} Proje Gösteriliyor ]
        </span>
      </div>

      {featuredProjects.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500 font-mono text-sm">
          Backend sunucusu kapalı veya henüz öne çıkarılan proje eklenmedi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project: any) => (
            <div
              key={project.id}
              className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between space-y-6 overflow-hidden"
            >
              <div className="space-y-4">
                {project.imageUrl && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500">#{project.slug}</span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        <GitBranch className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((pt: any) => (
                    <span
                      key={pt.technology.id}
                      className="px-2.5 py-1 rounded-md bg-zinc-800/60 text-xs font-mono text-zinc-300 border border-zinc-700/50"
                    >
                      {pt.technology.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}