"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { getRandomQuote, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import dynamic from 'next/dynamic';
import CategoryButtons from "@/components/category-buttons";
import SavePagePopup from "@/components/SavePagePopup";
import ThemeWrapper from "@/components/ThemeWrapper";

const QuoteBox = dynamic(() => import("@/components/quote-box"), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center">Loading quote...</div>
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
        
        console.log('Fetched categories:', fetchedCategories);
        console.log('Initial quote:', initialQuote);
        
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

  const handleCategorySelect = (category: string | undefined) => {
    setSelectedCategory(category);
  };

  return (
    <ThemeWrapper>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {categories.length > 0 && (
            <CategoryButtons 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          )}
          {quote && (
            <QuoteBox 
              quote={quote}
              onNewQuote={handleNewQuote}
              selectedCategory={selectedCategory}
            />
          )}
        </main>
      </div>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
    </ThemeWrapper>
  );
}
