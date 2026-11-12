import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Şeyma Ekici — Full-Stack Engineer',
  description: 'Full-stack engineer building thoughtful digital products with clean architecture, reliable type-safety, and scalable systems.',
  keywords: ['Full-Stack Engineer', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Portfolio'],
  authors: [{ name: 'Şeyma Ekici' }],
  openGraph: {
    title: 'Şeyma Ekici — Full-Stack Engineer',
    description: 'Selected work, engineering practice, and current explorations.',
    siteName: 'Şeyma Ekici',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased transition-colors duration-300 selection:bg-zinc-300 dark:selection:bg-zinc-700`}>
        <Providers>
          {children}
          <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p>© 2026 Şeyma Ekici. Built with Next.js, TypeScript &amp; care.</p>
              <div className="flex gap-5"><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a><a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-foreground">X / Twitter</a></div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
