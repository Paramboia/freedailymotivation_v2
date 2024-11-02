import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { ClerkProvider } from '@clerk/nextjs';
import SiteHeader from "@/components/SiteHeader";
import dynamic from 'next/dynamic';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const SupabaseUserProvider = dynamic(
  () => import('@/components/SupabaseUserProvider').then(mod => mod.SupabaseUserProvider),
  { ssr: false }
);

const ErrorBoundary = dynamic(
  () => import('@/components/ErrorBoundary'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Free Daily Motivation",
  description: "Get your daily dose of motivation with free inspirational quotes.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
              <SiteHeader />
              <ErrorBoundary>
                <SupabaseUserProvider>
                  {children}
                </SupabaseUserProvider>
              </ErrorBoundary>
            </div>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
