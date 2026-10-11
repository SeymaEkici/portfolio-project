'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2, Plus, Check } from 'lucide-react';
import { uploadImage } from '@/services/upload.service';
import { createProject } from '@/services/project.service';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    isFeatured: false,
    order: 1,
  });

  // Başlık girildikçe otomatik slug üretme yardımcı fonksiyonu
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({ ...prev, title, slug }));
  };

  // Cloudinary'ye görsel yükleme
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Görsel yüklenirken bir hata oluştu.');
    } finally{
      setUploadingImage(false);
    }
  };

  // Formu kaydetme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProject(formData);
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Proje eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      {/* Üst Yönlendirme */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Yönetim Paneli</span>
            <h1 className="text-2xl font-bold text-zinc-100">Yeni Proje Ekle</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Proje Başlığı *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Örn: E-Commerce Microservice"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Slug (URL) *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e-commerce-microservice"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 text-sm font-mono focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400">Kısa Açıklama *</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Projenin amacını ve öne çıkan teknik detaylarını özetleyin..."
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600 resize-none"
          />
        </div>

        {/* Görsel Yükleme Alanı */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400">Proje Görseli (Cloudinary)</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors">
              {uploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-zinc-400" />
                  Görsel Seç
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {formData.imageUrl && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Yüklendi
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Live Demo URL</label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-amber-500 focus:ring-0"
          />
          <label htmlFor="isFeatured" className="text-sm text-zinc-300 cursor-pointer">
            Ana sayfada öne çıkarılan proje olarak göster
          </label>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Projeyi Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}