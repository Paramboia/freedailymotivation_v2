'use client';

import Link from 'next/link';
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from '@/types';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FavoriteQuotes() {
  const { isLoaded, isSignedIn } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const response = await fetch('/api/favorite-quotes');
        if (!response.ok) {
          throw new Error('Failed to fetch quotes');
        }
        const data = await response.json();
        setQuotes(data.quotes);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError('Failed to load your favorite quotes');
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      fetchQuotes();
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Loading...
            </h1>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  if (!isSignedIn) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Please sign in to view your favorite quotes
            </h1>
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Go back home
            </Link>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  if (error) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Go back home
            </Link>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className={`${poppins.className} text-4xl mb-8 text-center text-gray-800 dark:text-white`}>
            Your Favorite Quotes
          </h1>
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Loading your favorite quotes...
                </p>
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't favorited any quotes yet.
                </p>
                <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Discover quotes to favorite
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quotes.map((quote) => (
                  <QuoteBox key={quote.id} quote={quote} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}
