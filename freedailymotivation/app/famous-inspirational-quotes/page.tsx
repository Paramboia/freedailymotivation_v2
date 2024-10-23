"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QuoteBox from "@/components/quote-box";
import { getRandomQuote, getAllAuthors, loadQuotes } from '@/lib/quotes';
import { Quote } from '@/types';  // Import Quote from types instead of lib/quotes

export default function FamousInspirationalQuotes() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    loadQuotes().then(() => {
      setQuote(getRandomQuote());
      setAuthors(getAllAuthors());
    });
  }, []);

  if (!quote) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-400 to-purple-400 dark:from-pink-800 dark:to-purple-800">
      <h1 className="text-4xl font-bold mb-8 text-white">Famous Inspirational Quotes</h1>
      <QuoteBox quote={quote} onNewQuote={() => setQuote(getRandomQuote())} />
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Check out the top inspirational quotes from famous people!</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
          {authors.map((author) => (
            <Link key={author} href={`/inspirational-quotes-famous/${encodeURIComponent(author.toLowerCase().replace(' ', '-'))}`}>
              <Button variant="secondary" size="sm">{author}</Button>
            </Link>
          ))}
        </div>
      </div>
      <Link href="/" className="mt-8">
        <Button variant="secondary">Back to Home Page</Button>
      </Link>
    </div>
  );
}
