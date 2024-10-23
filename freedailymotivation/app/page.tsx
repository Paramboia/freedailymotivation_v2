"use client";

import { useState, useEffect } from 'react';
import { getRandomQuote, loadQuotes } from '@/lib/quotes';
import { Quote } from '@/types';
import QuoteBox from "@/components/quote-box";
import CategoryButtons from "@/components/category-buttons";
import BookmarkReminder from "@/components/bookmark-reminder";
import TopQuotes from "@/components/top-quotes";

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeQuotes() {
      await loadQuotes();
      setQuote(getRandomQuote());
      setIsLoading(false);
    }
    initializeQuotes();
  }, []);

  const handleCategorySelect = (category: string) => {
    setQuote(getRandomQuote(category));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-800 dark:to-pink-800">
      <h1 className="text-4xl font-bold mb-8 text-white">Free Daily Motivation</h1>
      {quote && <QuoteBox quote={quote} onNewQuote={() => setQuote(getRandomQuote())} />}
      <CategoryButtons onCategorySelect={handleCategorySelect} />
      <TopQuotes />
      <footer className="mt-8 text-sm text-white">
        © 2024 Free Daily Motivation. All rights reserved.
      </footer>
      <BookmarkReminder />
    </div>
  );
}
