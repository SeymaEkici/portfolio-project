import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SiteFooter from "@/components/SiteFooter";

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
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased transition-colors duration-300 selection:bg-zinc-300 dark:selection:bg-zinc-700`}>
        <Providers>
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
