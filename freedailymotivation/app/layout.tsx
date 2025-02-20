import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { ClerkProvider } from '@clerk/nextjs';
import SiteHeader from "@/components/SiteHeader";
import dynamic from 'next/dynamic';
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import OneSignalProvider from "@/components/OneSignalProvider";

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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PQ8LSCWN');
          `}
        </Script>
        <OneSignalProvider />
      </head>
      <ClerkProvider>
        <body className={inter.className}>
          <div id="onesignal-slidedown-container"></div>
          {/* Google Tag Manager (noscript) */}
          <noscript dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PQ8LSCWN"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }} />
          {/* End Google Tag Manager (noscript) */}
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
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  );
}
