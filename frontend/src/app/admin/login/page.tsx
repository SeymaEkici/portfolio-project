'use client';

import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { loginUser } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-8 rounded-[20px] bg-card/50 border border-border">
        <div className="space-y-2 text-center">
          <div className="inline-flex p-3 rounded-[12px] bg-card/60 border border-border/55 text-primary mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Girişi</h1>
          <p className="text-sm text-muted-foreground font-mono">portfolio.dev yönetim paneli</p>
        </div>

        {error && (
          <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground">E-posta Adresi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.dev"
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-background border border-border text-foreground text-sm focus:outline-none focus:border-ring transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground">Şifre</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-background border border-border text-foreground text-sm focus:outline-none focus:border-ring transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full mt-2"
            disabled={loading}
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
          </Button>
        </form>
      </div>
    </div>
  );
}