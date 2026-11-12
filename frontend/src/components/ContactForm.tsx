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

const initialForm: ContactFormData = { name: '', email: '', subject: '', message: '' };
const fieldClass = 'w-full border border-zinc-200 bg-background px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:focus:border-zinc-500';

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
      const message = axios.isAxiosError<{ message?: string }>(submitError) ? submitError.response?.data?.message : undefined;
      setError(message || 'Your message could not be sent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
    <aside className="flex flex-col gap-4"><p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">Whether you have a project to discuss, a question, or just want to say hello — my inbox is open. Use the form to get in touch.</p><p className="font-mono text-[10px] text-zinc-500">TÜRKİYE · UTC+3</p></aside>
    {success ? <div role="status" className="flex items-center gap-3 border border-emerald-600/30 bg-emerald-500/5 p-6 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={18} />Thanks — your message has been sent.</div> : <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div role="alert" className="border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="contact-name" className="mb-2 block font-mono text-[10px] tracking-widest text-zinc-500">YOUR NAME *</label><input id="contact-name" type="text" name="name" autoComplete="name" required placeholder="Jane Smith" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={fieldClass} /></div>
        <div><label htmlFor="contact-email" className="mb-2 block font-mono text-[10px] tracking-widest text-zinc-500">EMAIL ADDRESS *</label><input id="contact-email" type="email" name="email" autoComplete="email" required placeholder="jane@example.com" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className={fieldClass} /></div>
      </div>
      <div><label htmlFor="contact-subject" className="mb-2 block font-mono text-[10px] tracking-widest text-zinc-500">SUBJECT</label><input id="contact-subject" type="text" name="subject" placeholder="What would you like to build?" value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} className={fieldClass} /></div>
      <div><label htmlFor="contact-message" className="mb-2 block font-mono text-[10px] tracking-widest text-zinc-500">MESSAGE *</label><textarea id="contact-message" name="message" required rows={5} placeholder="Tell me a little about it…" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} className={`${fieldClass} resize-y`} /></div>
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">{loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}Send message</button>
    </form>}
  </div>;
}
