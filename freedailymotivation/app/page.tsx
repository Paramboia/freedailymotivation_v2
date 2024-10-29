"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getRandomQuote, loadQuotes, getAllCategories } from '@/lib/quotes';
import { Quote } from '@/types';
import QuoteBox from "@/components/quote-box";
import CategoryButtons from "@/components/category-buttons";
import SavePagePopup from "@/components/SavePagePopup";
import ThemeWrapper from "@/components/ThemeWrapper";

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function initializeQuotes() {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
        const initialQuote = await getRandomQuote();
        setQuote(initialQuote);
      } catch (error) {
        console.error('Failed to load quotes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    initializeQuotes();

    const hasSeenPopup = localStorage.getItem('hasSeenSavePagePopup');
    if (hasSeenPopup) return;

    let clickCount = 0;
    const handleClick = () => {
      clickCount++;
      if (clickCount === 3) {
        setShowPopup(true);
        localStorage.setItem('hasSeenSavePagePopup', 'true');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleCategorySelect = async (category: string | null) => {
    setSelectedCategory(category);
    const newQuote = await getRandomQuote(category || undefined);
    setQuote(newQuote);
  };

  const handleNewQuote = async () => {
    const newQuote = await getRandomQuote(selectedCategory || undefined);
    setQuote(newQuote);
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Head>
        <title>Free Daily Motivation - Inspirational Quotes</title>
        <meta name="description" content="Get your daily dose of motivation with free inspirational quotes. Discover wisdom from famous thinkers, leaders, and innovators to boost your day and inspire greatness." />
      </Head>
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
        <footer className="p-4 text-sm text-white text-center">
          © 2024 Free Daily Motivation. All rights reserved.
        </footer>
        {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
      </ThemeWrapper>
    </>
  );
}
