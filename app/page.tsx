"use client";

import React, { useState } from "react";
import Link from "next/link";
import ThemeWrapper from "@/components/ThemeWrapper";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Poppins } from "next/font/google";
import SavePagePopup from "@/components/SavePagePopup";
import { analytics } from "@/lib/analytics";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [clicks, setClicks] = useState(0); // Track the number of clicks
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility

  const handleClick = () => {
    if (showPopup) return; // Prevent further actions if popup is already shown

    const newClicks = clicks + 1;
    if (newClicks === 3) {
      setShowPopup(true);
    }
    setClicks(newClicks); // Update the number of clicks
  };

  const handleFindQuotesClick = () => {
    // Track CTA click event
    analytics.trackCTAClick('Find Quotes', 'Home Page');
  };

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col relative" onClick={handleClick}>
        
        <main className="container mx-auto px-4 py-12 md:py-8 flex-grow flex items-center justify-center flex-col relative z-10">
          <div className="mb-16 md:mb-12 text-center">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              Free Daily Motivation
            </h1>
            <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
              Find the best inspirational quotes from famous and influential
              people across various fields, including business, sports, science,
              and life, to motivate and inspire you daily.
            </p>
            <div className="flex justify-center">
              <Link href="/find-quotes">
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
                  onClick={handleFindQuotesClick}
                >
                  Find Quotes
                </button>
              </Link>
            </div>
          </div>
        </main>
        <ConditionalFooter />
        {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
      </div>
    </ThemeWrapper>
  );
}
