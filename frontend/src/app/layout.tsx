import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Şeyma Nur Ekici | Full-Stack Developer Portfolio',
  description: 'Next.js, Node.js ve PostgreSQL mimarisiyle geliştirilmiş, modern ve ölçeklenebilir full-stack portfolyo projesi.',
  keywords: ['Full-Stack Developer', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Portfolio'],
  authors: [{ name: 'Şeyma Nur Ekici' }],
  openGraph: {
    title: 'Şeyma Nur Ekici | Full-Stack Developer Portfolio',
    description: 'Clean architecture ve modern full-stack teknolojileriyle geliştirilmiş projelerimi inceleyin.',
    url: 'https://portfolio-project-delta-navy.vercel.app',
    siteName: 'Portfolyo',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-400">
        <main className="min-h-screen flex flex-col justify-between">
          {children}
          
          {/* Footer */}
          <footer className="w-full border-t border-zinc-900 py-8 text-center text-xs font-mono text-zinc-600">
            <p>© {new Date().getFullYear()} — Built with Next.js, Node.js & PostgreSQL.</p>
          </footer>
        </main>
      </body>
    </html>
  );
}