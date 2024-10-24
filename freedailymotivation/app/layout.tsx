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
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-800 dark:to-pink-800">
              <SiteHeader />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
