'use client';

import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { sendContactMessage } from '@/services/contact.service';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendContactMessage(form);
      setSuccess(true);
      setForm(initialForm);
    } catch (submitError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(submitError)
        ? submitError.response?.data?.message
        : undefined;
      setError(message || 'Mesaj gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="space-y-8 border-t border-zinc-800 pt-12">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">İletişime Geçin</h2>
        <p className="text-sm text-zinc-400">
          Projeleriniz veya iş birliği teklifleri için doğrudan mesaj bırakabilirsiniz.
        </p>
      </div>

      {success ? (
        <div
          role="status"
          className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-400"
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-mono">
            Mesajınız başarıyla iletildi! Hem sisteme kaydedildi hem de mail olarak gönderildi.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8"
        >
          {error && (
            <div role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs font-mono text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder="Adınız *"
              aria-label="Adınız"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="E-posta Adresiniz *"
              aria-label="E-posta adresiniz"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Konu (İsteğe bağlı)"
            aria-label="Konu (isteğe bağlı)"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Mesajınız..."
            aria-label="Mesajınız"
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Mesajı Gönder
          </button>
        </form>
      )}
    </section>
  );
}