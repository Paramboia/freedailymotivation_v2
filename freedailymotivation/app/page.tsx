"use client";

import { useState, useEffect } from 'react';
import { getRandomQuote, loadQuotes, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import QuoteBox from "@/components/quote-box";
import CategoryButtons from "@/components/category-buttons";
import BookmarkReminder from "@/components/bookmark-reminder";
import SavePagePopup from "@/components/SavePagePopup";

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
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-800 dark:to-pink-800">
      <div className="fixed top-20 left-0 right-0 flex flex-col items-center">
        {quote && <QuoteBox quote={quote} onNewQuote={handleNewQuote} />}
        <CategoryButtons 
          categories={categories} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>
      <BookmarkReminder />
      <footer className="mt-auto text-sm text-white">
        © 2024 Free Daily Motivation. All rights reserved.
      </footer>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
