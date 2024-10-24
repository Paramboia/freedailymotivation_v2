import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { ClerkProvider } from '@clerk/nextjs';
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Daily Motivation",
  description: "Get your daily dose of inspiration and motivation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-purple-400 to-pink-400 dark:bg-gradient-dark">
              <SiteHeader />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
