"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { getRandomQuote, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import dynamic from 'next/dynamic';
import CategoryButtons from "@/components/category-buttons";
import SavePagePopup from "@/components/SavePagePopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer"; // Import the Footer component

const QuoteBox = dynamic(() => import("@/components/quote-box"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center -mt-16"> {/* Adjust the margin-top here */}
          <div className="loader"></div>
          <div>Finding the best motivational quotes for you...</div>
        </div>

        {/* Add the loader styles */}
        <style jsx>{`
          .loader {
            border: 8px solid transparent;
            border-top: 8px solid;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            border-image: linear-gradient(to right, #ff007f, #3498db);
            border-image-slice: 1;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
  )
});

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FindQuotes() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function initializeQuotes() {
      try {
        const [fetchedCategories, initialQuote] = await Promise.all([
          getAllCategories(),
          getRandomQuote()
        ]);
        setCategories(fetchedCategories);
        setQuote(initialQuote);
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    }
    initializeQuotes();
  }, []);

  const handleNewQuote = async () => {
    try {
      const newQuote = await getRandomQuote(selectedCategory);
      if (newQuote) {
        setQuote(newQuote);
      }
    } catch (error) {
      console.error('Error fetching new quote:', error);
    }
  };

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-12 md:py-8 flex-grow">
          <div className="mb-16 md:mb-12">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              Find Inspirational Quotes
            </h1>
          </div>
          {quote && (
            <QuoteBox 
              quote={quote}
              onNewQuote={handleNewQuote}
              selectedCategory={selectedCategory}
            />
          )}
          {!quote && (
            <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center -mt-16"> {/* Adjust the margin-top here */}
              <div className="loader"></div>
              <div>Finding the best motivational quotes for you...</div>
            </div>
    
            {/* Add the loader styles */}
            <style jsx>{`
              .loader {
                border: 8px solid transparent;
                border-top: 8px solid;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                border-image: linear-gradient(to right, #ff007f, #3498db);
                border-image-slice: 1;
              }
    
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
          )}
          {categories.length > 0 && (
            <div className="mt-8">
              <CategoryButtons 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>
          )}
        </main>
        <Footer /> {/* Use the Footer component */}
      </div>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
      <style jsx>{`
        .loader {
          border: 8px solid transparent;
          border-top: 8px solid;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          border-image: linear-gradient(to right, #ff007f, #3498db);
          border-image-slice: 1;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ThemeWrapper>
  );
}
