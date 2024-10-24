"use client";

import { useState, useEffect } from 'react';
import { getRandomQuote, loadQuotes, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import QuoteBox from "@/components/quote-box";
import CategoryButtons from "@/components/category-buttons";
import BookmarkReminder from "@/components/bookmark-reminder";
import SavePagePopup from "@/components/SavePagePopup";
import ThemeWrapper from "@/components/ThemeWrapper";

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function initializeQuotes() {
      await loadQuotes();
      setQuote(getRandomQuote());
      setCategories(getAllCategories());
      setIsLoading(false);
    }
    initializeQuotes();

    const handleClick = () => {
      setClickCount(prevCount => {
        if (prevCount === 2) {
          setShowPopup(true);
        }
        return prevCount + 1;
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setQuote(getRandomQuote(category || undefined));
  };

  const handleNewQuote = () => {
    setQuote(getRandomQuote(selectedCategory || undefined));
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <ThemeWrapper>
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          {quote && <QuoteBox quote={quote} onNewQuote={handleNewQuote} />}
          <CategoryButtons 
            categories={categories} 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
      </main>
      <BookmarkReminder />
      <footer className="p-4 text-sm text-white text-center">
        © 2024 Free Daily Motivation. All rights reserved.
      </footer>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
    </ThemeWrapper>
  );
}
