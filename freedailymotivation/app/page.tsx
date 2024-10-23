"use client";

import { useState, useEffect } from 'react';
import { getRandomQuote, loadQuotes, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import QuoteBox from "@/components/quote-box";
import CategoryButtons from "@/components/category-buttons";
import BookmarkReminder from "@/components/bookmark-reminder";

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeQuotes() {
      await loadQuotes();
      setQuote(getRandomQuote());
      setCategories(getAllCategories());
      setIsLoading(false);
    }
    initializeQuotes();
  }, []);

  const handleCategorySelect = (category: string) => {
    setQuote(getRandomQuote(category));
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-800 dark:to-pink-800">
      <div className="fixed top-20 left-0 right-0 flex flex-col items-center">
        {quote && <QuoteBox quote={quote} onNewQuote={() => setQuote(getRandomQuote())} />}
        <CategoryButtons categories={categories} onCategorySelect={handleCategorySelect} />
      </div>
      <BookmarkReminder />
      <footer className="mt-auto text-sm text-white">
        © 2024 Free Daily Motivation. All rights reserved.
      </footer>
    </div>
  );
}
