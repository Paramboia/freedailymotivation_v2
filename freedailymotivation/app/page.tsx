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
        <main className="container mx-auto px-4 py-12 md:py-8 flex-grow flex items-center justify-center flex-col">
          <div className="mb-16 md:mb-12 text-center">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white`}>
              Free Daily Motivation
            </h1>
            <p className="text-lg mb-4 italic">Find the best inspirational quotes from famous and influential people across various fields, including business, sports, science, and life, to motivate and inspire you daily.</p>
            <div className="flex justify-center">
              <Link href="/find-quotes">
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600">
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
