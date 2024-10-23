import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/contexts/theme-context";
import ThemeToggle from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Daily Motivation",
  description: "Get your daily dose of inspiration and motivation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm z-10">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.webp"
                alt="Free Daily Motivation Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <span className="text-xl font-bold dark:text-white">Free Daily Motivation</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/about" className="text-sm dark:text-white hover:underline">
                About Us
              </Link>
              <ThemeToggle />
            </nav>
          </header>
          <main className="pt-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
