'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Layers, MessageSquare, Briefcase, Plus, Loader2, Trash2 } from 'lucide-react';
import { getProjects } from '@/services/project.service';
import { getMessages } from '@/services/message.service';

export default function AdminDashboardPage() {
  // Projeleri çekiyoruz
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => getProjects(),
  });

  // Mesajları çekiyoruz
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => getMessages(),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">Güvenli Bölge</span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mt-1">Yönetim Paneli (Dashboard)</h1>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Siteye Dön
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono">PROJELER</span>
            <Briefcase className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-100 font-mono">
            {isLoadingProjects ? <Loader2 className="w-6 h-6 animate-spin text-zinc-500" /> : projects.length}
          </div>
          <p className="text-xs text-zinc-500">Sistemde kayıtlı toplam proje sayısı.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono">İLETİŞİM MESAJLARI</span>
            <MessageSquare className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-100 font-mono">
            {isLoadingMessages ? <Loader2 className="w-6 h-6 animate-spin text-zinc-500" /> : messages.length}
          </div>
          <p className="text-xs text-zinc-500">Gelen toplam ziyaretçi mesajı.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono">DURUM</span>
            <Layers className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500 font-mono text-xl">Aktif</div>
          <p className="text-xs text-zinc-500">API & Veritabanı bağlantısı sağlıklı.</p>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Proje Yönetimi</h2>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Proje Ekle
          </Link>
        </div>

        {/* Proje Tablosu / Listesi */}
        <div className="space-y-3 pt-4">
          {projects.map((project: any) => (
            <div
              key={project.id}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-zinc-200">{project.title}</h3>
                <span className="text-xs font-mono text-zinc-500">/{project.slug}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-mono ${project.isFeatured ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                  {project.isFeatured ? 'Öne Çıkarılan' : 'Standart'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}