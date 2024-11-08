"use client";

import React from 'react';
import Link from 'next/link';
import ThemeWrapper from "@/components/ThemeWrapper";
import Footer from "@/components/Footer"; // Import the Footer component
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-12 md:py-8 flex-grow">
          <div className="mb-16 md:mb-12">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              Free Daily Motivation
            </h1>
            <p className="text-lg text-center mb-4">Find the top inspirational quotes from famous people</p>
            <div className="flex justify-center">
              <Link href="/find-quotes">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Find Quotes
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer /> {/* Use the Footer component */}
      </div>
    </ThemeWrapper>
  );
}
