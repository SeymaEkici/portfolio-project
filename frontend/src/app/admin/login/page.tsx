'use client';

import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { loginUser } from '@/services/auth.service';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser({ email, password });
      // Başarılı giriş sonrası admin dashboard sayfasına yönlendiriyoruz
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="space-y-2 text-center">
          <div className="inline-flex p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/55 text-amber-500 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Admin Girişi</h1>
          <p className="text-sm text-zinc-400 font-mono">portfolio.dev yönetim paneli</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-zinc-400">E-posta Adresi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.dev"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-zinc-400">Şifre</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                Panele Giriş Yap
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}