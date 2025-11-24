import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { ClerkProvider } from '@clerk/nextjs';
import { default as nextDynamic } from 'next/dynamic';
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import OneSignalProvider from "@/components/OneSignalProvider";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

const SupabaseUserProvider = nextDynamic(
  () => import('@/components/SupabaseUserProvider').then(mod => mod.SupabaseUserProvider),
  { ssr: false }
);

const ErrorBoundary = nextDynamic(
  () => import('@/components/ErrorBoundary'),
  { ssr: false }
);

const MobileLayout = nextDynamic(
  () => import('@/components/mobile/MobileLayout'),
  { ssr: false }
);

const ClientPageTracker = nextDynamic(() => import('@/components/ClientPageTracker'), { ssr: false });

export const metadata: Metadata = {
  title: {
    default: "Free Daily Motivation - Inspirational Quotes",
    template: "%s | Free Daily Motivation"
  },
  description: "Get your daily dose of motivation with inspirational quotes from famous figures across business, sports, science, and life. Discover wisdom to fuel your success.",
  keywords: [
    "inspirational quotes",
    "motivational quotes", 
    "daily motivation",
    "famous quotes",
    "business quotes",
    "success quotes",
    "life quotes",
    "wisdom",
    "personal growth",
    "self improvement"
  ],
  authors: [{ name: "Free Daily Motivation Team" }],
  creator: "Free Daily Motivation",
  publisher: "Free Daily Motivation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.freedailymotivation.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.freedailymotivation.com',
    title: 'Free Daily Motivation - Inspirational Quotes',
    description: 'Get your daily dose of motivation with inspirational quotes from famous figures across business, sports, science, and life.',
    siteName: 'Free Daily Motivation',
    images: [
      {
        url: '/og_image.jpg',
        width: 1200,
        height: 675,
        alt: 'Free Daily Motivation - Inspirational Quotes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Daily Motivation - Inspirational Quotes',
    description: 'Get your daily dose of motivation with inspirational quotes from famous figures across business, sports, science, and life.',
    images: ['/og_image.jpg'],
    creator: '@freedailymotiv',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PPZFSY342J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PPZFSY342J');
          `}
        </Script>
        <OneSignalProvider />
      </head>
      <ClerkProvider>
        <body className={inter.className}>
          <ClientPageTracker />
          <div id="onesignal-slidedown-container"></div>
          {/* Google Tag Manager (noscript) */}
          <noscript dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PQ8LSCWN"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }} />
          {/* End Google Tag Manager (noscript) */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <StructuredData type="organization" />
            <StructuredData type="website" />
            <ErrorBoundary>
              <SupabaseUserProvider>
                <MobileLayout>
                  {children}
                </MobileLayout>
              </SupabaseUserProvider>
            </ErrorBoundary>
          </ThemeProvider>
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  );
}
