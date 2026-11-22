'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Layers, MessageSquare, Briefcase, Plus, Loader2, Trash2, Mail, ExternalLink, Moon, Sun } from 'lucide-react';
import { getProjects } from '@/services/project.service';
import { getMessages, deleteMessage } from '@/services/message.service';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();

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

  // Mesaj silme mutasyonu
  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Güvenli Bölge</span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">Yönetim Paneli (Dashboard)</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-[8px] bg-card border border-border text-muted-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Siteye Dön
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            className="flex size-9 items-center justify-center rounded-[8px] border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[20px] bg-card/40 border border-border space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono">PROJELER</span>
            <Briefcase className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-foreground font-mono">
            {isLoadingProjects ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : projects.length}
          </div>
          <p className="text-xs text-muted-foreground">Sistemde kayıtlı toplam proje sayısı.</p>
        </div>

        <div className="p-6 rounded-[20px] bg-card/40 border border-border space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono">İLETİŞİM MESAJLARI</span>
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-foreground font-mono">
            {isLoadingMessages ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : messages.length}
          </div>
          <p className="text-xs text-muted-foreground">Gelen toplam ziyaretçi mesajı.</p>
        </div>

        <div className="p-6 rounded-[20px] bg-card/40 border border-border space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono">DURUM</span>
            <Layers className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-emerald-500 font-mono text-xl">Aktif</div>
          <p className="text-xs text-muted-foreground">API & Veritabanı bağlantısı sağlıklı.</p>
        </div>
      </div>

      {/* İLETİŞİM MESAJLARI BÖLÜMÜ */}
      <div className="p-8 rounded-[20px] bg-card/20 border border-border/80 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Ziyaretçi Mesajları
          </h2>
          <span className="text-xs font-mono text-muted-foreground">[ {messages.length} Mesaj ]</span>
        </div>

        {isLoadingMessages ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center rounded-[12px] border border-dashed border-border text-muted-foreground font-mono text-sm">
            Henüz hiç mesaj alınmadı.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className="p-6 rounded-[12px] bg-card/60 border border-border space-y-4 hover:border-border transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/80 pb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-base">{msg.name}</h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => deleteMessageMutation.mutate(msg.id)}
                      disabled={deleteMessageMutation.isPending}
                      className="p-2 rounded-[8px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      title="Mesajı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {msg.subject && (
                  <div className="text-xs font-mono text-muted-foreground">
                    <span className="text-muted-foreground">Konu:</span> {msg.subject}
                  </div>
                )}

                <p className="text-sm text-foreground leading-relaxed bg-background/50 p-4 rounded-[8px] border border-border/50">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROJE YÖNETİMİ BÖLÜMÜ */}
      <div className="p-8 rounded-[20px] bg-card/20 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Proje Yönetimi</h2>
          <Button variant="default" render={<Link href="/admin/projects/new" />}>
            <Plus className="w-4 h-4" />
            Yeni Proje Ekle
          </Button>
        </div>

        <div className="space-y-3 pt-2">
          {projects.map((project: any) => (
            <div
              key={project.id}
              className="p-4 rounded-[12px] bg-card/60 border border-border flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-foreground">{project.title}</h3>
                <span className="text-xs font-mono text-muted-foreground">/{project.slug}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  project.isFeatured
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-card text-muted-foreground'
                }`}
              >
                {project.isFeatured ? 'Öne Çıkarılan' : 'Standart'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}