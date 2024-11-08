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
import Link from 'next/link';
import { Facebook } from 'lucide-react';

const QuoteBox = dynamic(() => import("@/components/quote-box"), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center">Loading quote...</div>
});

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
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
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center whitespace-nowrap overflow-hidden text-ellipsis`}>
              Free Daily Motivation
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
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading quote...</p>
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
        <footer className="flex justify-center items-center p-4 text-sm text-white dark:text-gray-300 relative">
          <div className="text-center">
            <span>© 2024 Free Daily Motivation.</span>
            <br />
            <span>All rights reserved.</span>
          </div>
          <div className="absolute right-4">
            <Link href="https://www.facebook.com/people/Free-Daily-Motivation/61566119962164/" className="flex items-center text-blue-600 hover:underline">
              <Facebook className="h-5 w-5 mr-1" />
              Join the Community
            </Link>
          </div>
        </footer>
      </div>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
    </ThemeWrapper>
  );
}
